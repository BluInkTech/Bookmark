import { errors, getErrorCode } from "./diagnostics.js"
import { UnicodeIterator } from "./iterator.js"
import { type BlockType, blockTypeMap, boxTypeMap } from "./tokens.js"

export type AstVisitor = {
	[key in `start${Capitalize<BlockType>}`]: (
		token: Token,
		meta: LineMeta,
		state: ParseState,
	) => string
} & {
	[key in `end${Capitalize<BlockType>}`]: (
		token: Token,
		meta: LineMeta,
		state: ParseState,
	) => string
}

export const DiagnosticSeverity = {
	Error: 0,
	Warning: 1,
	Information: 2,
	Hint: 3,
} as const

export interface Diagnostic {
	startLine: number
	startCharacter: number
	endLine?: number
	endCharacter?: number
	severity: number
	message: string
	msgId: string
}

export type LineType =
	| "block" // ~
	| "code" // 4 spaces
	| "table" // |
	| "meta" // :
	| "box" // 2 spaces
	| "paragraph" // no prefix
	| "blankLine"

export type Variables = Record<string, unknown>
export type LineMeta = {
	id: string
	labels: string[]
	properties: Record<string, unknown>
}

export interface Token {
	type: "Command" | "Property" | "Text"
	value: string
}

export interface SrcLine {
	no: number // Line number in the source file
	text: string // Raw text of the line
	type: LineType // Type of the line (block, code, table, etc.)
	tokens: Token[] // Array of tokens parsed from the line
	parent?: SrcLine // Parent line item, if any
	meta?: LineMeta // Metadata for the line
}

export interface ParseState {
	cst: Readonly<SrcLine[]>
	lines: Readonly<string[]>
	diagnostics: Readonly<Diagnostic[]>
	variables: Readonly<Variables>
}

export class ParseStateImpl implements ParseState {
	lines: string[]
	cst: SrcLine[]
	diagnostics: Diagnostic[]
	variables: Variables
	current?: {
		line: SrcLine
		index: number
		iterator: UnicodeIterator
	}

	constructor(input: string) {
		this.lines = input.split(/\r?\n/)
		this.cst = []
		this.diagnostics = []
		this.variables = {}
	}

	private detectLineType(iterator: UnicodeIterator): LineType {
		if (iterator.input.trim() === "") {
			return "blankLine"
		}
		const next = iterator.current
		if (next === "~") {
			iterator.next()
			return "block"
		}
		if (next === ":") {
			iterator.next()
			return "meta"
		}
		if (next === "|") {
			iterator.next()
			return "table"
		}
		if (iterator.input.startsWith("    ")) {
			iterator.advance(4)
			return "code"
		}
		if (iterator.input.startsWith("  ")) {
			iterator.advance(2)
			return "box"
		}

		return "paragraph"
	}

	next(): boolean {
		if (!this.current) {
			this.current = {
				line: {} as SrcLine,
				iterator: {} as UnicodeIterator,
				index: 0,
			}
		}

		if (this.current.index < this.lines.length) {
			const iterator = new UnicodeIterator(this.lines[this.current.index])
			const lineType = this.detectLineType(iterator)
			const srcLine: SrcLine = {
				no: this.current.index,
				text: iterator.input,
				type: lineType,
				tokens: [],
			}
			this.cst.push(srcLine)
			this.current.iterator = iterator
			this.current.line = srcLine
			this.current.index++
			return true
		}

		return false
	}

	addToken(type: Token["type"], value: string) {
		if (!this.current) {
			return
		}
		this.current.line.tokens.push({
			type,
			value,
		})
	}

	addError(message: string): void {
		if (!this.current) {
			return
		}
		this.diagnostics.push({
			startLine: this.current.index + 1,
			startCharacter: this.current.iterator.position,
			severity: DiagnosticSeverity.Error,
			message,
			msgId: getErrorCode(message),
		})
	}
}

// Helper function to assert state.current is set
function assertCurrent(
	state: ParseStateImpl,
): asserts state is ParseStateImpl & {
	current: NonNullable<ParseStateImpl["current"]>
} {
	if (!state.current) {
		throw new Error("INTERNAL:Current line is not set")
	}
}

const lineHandlers: Record<LineType, (state: ParseStateImpl) => void> = {
	block: handleBlock,
	meta: handleMeta,
	table: handleTable,
	code: handleCode,
	box: handleBox,
	paragraph: handleParagraph,
	blankLine: () => {},
}

export function parse(input: string): ParseState {
	const state = new ParseStateImpl(input)
	while (state.next()) {
		assertCurrent(state)
		const handler = lineHandlers[state.current.line.type]
		handler(state)
	}

	return state
}

function handleHeading(
	headingLevel: 1 | 2 | 3 | 4 | 5 | 6,
	state: ParseStateImpl,
): void {
	assertCurrent(state)
	const { iterator } = state.current

	state.addToken("Command", `startHeading${headingLevel}`)
	const heading = iterator.eatUntilEnd()
	if (!heading) {
		state.addError(errors.MISSING_HEADING_TEXT)
		return
	}
	state.addToken("Text", heading)
	state.addToken("Command", `endHeading${headingLevel}`)
}

const blockTypeHandlers: Record<BlockType, (state: ParseStateImpl) => void> = {
	Attach: (_: ParseStateImpl): void => {
		throw new Error("Function not implemented.")
	},
	Box: (state: ParseStateImpl): void => {
		assertCurrent(state)
		const { iterator } = state.current
		state.addToken("Command", "startBox")
		const boxType = iterator.next()
		if (!boxType) {
			state.addError(errors.MISSING_BOX_TYPE_OR_TITLE)
			return
		}
		const boxTypeValue = boxTypeMap[boxType]
		if (boxTypeValue) {
			state.addToken("Command", boxTypeValue)
		}
	},
	Code: (_: ParseStateImpl): void => {
		throw new Error("Function not implemented.")
	},
	Heading1: handleHeading.bind(null, 1),
	Heading2: handleHeading.bind(null, 2),
	Heading3: handleHeading.bind(null, 3),
	Heading4: handleHeading.bind(null, 4),
	Heading5: handleHeading.bind(null, 5),
	Heading6: handleHeading.bind(null, 6),
	Image: (_: ParseStateImpl): void => {
		throw new Error("Function not implemented.")
	},
	Include: (_: ParseStateImpl): void => {
		throw new Error("Function not implemented.")
	},
	Line: (_: ParseStateImpl): void => {
		throw new Error("Function not implemented.")
	},
	Nested: (_: ParseStateImpl): void => {
		throw new Error("Function not implemented.")
	},
	OrderedList: (_: ParseStateImpl): void => {
		throw new Error("Function not implemented.")
	},
	PageBreak: (_: ParseStateImpl): void => {
		throw new Error("Function not implemented.")
	},
	Table: (_: ParseStateImpl): void => {
		throw new Error("Function not implemented.")
	},
	ThematicBreak: (_: ParseStateImpl): void => {
		throw new Error("Function not implemented.")
	},
	UnorderedList: (_: ParseStateImpl): void => {
		throw new Error("Function not implemented.")
	},
	Verbatim: (_: ParseStateImpl): void => {
		throw new Error("Function not implemented.")
	},
}

function handleBlock(state: ParseStateImpl): void {
	assertCurrent(state)
	const { iterator } = state.current

	// We expect the next character to be a block command
	if (iterator.current === null) {
		state.addError(errors.MISSING_BLOCK_TYPE)
		return
	}

	const blockType = blockTypeMap[iterator.current]
	if (!blockType) {
		state.addError(errors.INVALID_BLOCK_TYPE)
		return
	}
	iterator.next()

	// code and box blocks can have type immediately after the declaration
	if (
		blockType !== "Code" &&
		blockType !== "Box" &&
		!iterator.eatWhitespace()
	) {
		state.addError(errors.MISSING_WHITESPACE)
		return
	}

	blockTypeHandlers[blockType](state)
}

function handleMeta(_: ParseStateImpl) {
	throw new Error("Not implemented")
}
function handleTable(_: ParseStateImpl) {
	throw new Error("Not implemented")
}
function handleCode(_: ParseStateImpl) {
	throw new Error("Not implemented")
}
function handleBox(_: ParseStateImpl) {
	throw new Error("Not implemented")
}
function handleParagraph(_: ParseStateImpl) {
	throw new Error("Not implemented")
}
