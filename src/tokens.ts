export const escapeMark = "\\"
export type BlockType =
	| "Attach"
	| "Box"
	| "Code"
	| "Heading1"
	| "Heading2"
	| "Heading3"
	| "Heading4"
	| "Heading5"
	| "Heading6"
	| "Image"
	| "Include"
	| "Line"
	| "Nested"
	| "OrderedList"
	| "PageBreak"
	| "Table"
	| "ThematicBreak"
	| "UnorderedList"
	| "Verbatim"

export const blockTypeMap: Record<string, BlockType> = {
	"^": "Attach",
	">": "Box",
	"%": "Code",
	"1": "Heading1",
	"2": "Heading2",
	"3": "Heading3",
	"4": "Heading4",
	"5": "Heading5",
	"6": "Heading6",
	"!": "Image",
	"@": "Include",
	"-": "Line",
	"~": "Nested",
	"#": "OrderedList",
	".": "PageBreak",
	"|": "Table",
	"+": "ThematicBreak",
	"*": "UnorderedList",
	"=": "Verbatim",
}

export type InlineType0 = "text"

export type InlineType1 =
	| "bold"
	| "italic"
	| "underline"
	| "maths"
	| "monospace"
	| "smallCaps"

export const inlineType1Map: Record<string, InlineType1> = {
	"*": "bold",
	"/": "italic",
	_: "underline",
	$: "maths",
	"=": "monospace",
	"^": "smallCaps",
}

export type InlineType2 =
	| "endnote"
	| "footnote"
	| "highlight"
	| "link"
	| "pageRef"
	| "reference"
	| "strike"
	| "subscript"
	| "superscript"

export const inlineType2Map: Record<string, InlineType2> = {
	"⤵": "endnote",
	"†": "footnote",
	"!": "highlight",
	"↗": "link",
	"#": "pageRef",
	"@": "reference",
	"-": "strike",
	"↓": "subscript",
	"↑": "superscript",
}

export type InlineType3 = "code" | "comment" | "insert" | "delete"

export const inlineType3Map: Record<string, InlineType3> = {
	"%": "code",
	"💬": "comment",
	"➕": "insert",
	"➖": "delete",
}

export type InlineType = InlineType0 | InlineType1 | InlineType2 | InlineType3

export type MetaType =
	// File level metadata
	| "title"
	| "author"
	| "date"
	| "tags"
	| "setting"
	| "goal"
	| "image"
	| "comment"
	| "variableGroup"
	| "variable"
	| "blockMeta"

export const metaTypeMap: Record<string, MetaType> = {
	"⚡": "title",
	"🏷️": "tags",
	"📅": "date",
	"🖊️": "author",
	"⚙️": "setting",
	"🎯": "goal",
	"🔧": "variable",
	"📦": "variableGroup",
	"🖼️": "image",
	"💬": "comment",
	"🆔": "blockMeta",
}

export type MetaVariableType = "paragraph" | "object" | "array"
export type BlockMetaType = "id" | "tag" | "key"

export type BoxType =
	| "box"
	| "abstract"
	| "announcement"
	| "bug"
	| "construction"
	| "discussion"
	| "error"
	| "example"
	| "important"
	| "info"
	| "note"
	| "poetry"
	| "question"
	| "quote"
	| "success"
	| "tip"
	| "warning"

export const boxTypeMap: Record<string, BoxType> = {
	"📋": "abstract",
	"📢": "announcement",
	"🐛": "bug",
	"🚧": "construction",
	"💬": "discussion",
	"🗨️": "discussion",
	"❌": "error",
	"✖️": "error",
	"🧪": "example",
	"❕": "important",
	"❗": "important",
	"‼️": "important",
	ℹ️: "info",
	ℹ: "info",
	"✏️": "note",
	"🎭": "poetry",
	"❓": "question",
	"❔": "question",
	"🗣️": "quote",
	"✔️": "success",
	"☑️": "success",
	"✅": "success",
	"💡": "tip",
	"⚠️": "warning",
	"⚠": "warning",
}

export type TableRowType =
	| "headerRightAligned"
	| "headerLeftAligned"
	| "headerCenterAligned"
	| "cell"
	| "attach"
	| "row"

export const tableRowTypeMap: Record<string, TableRowType> = {
	">": "headerRightAligned",
	"<": "headerLeftAligned",
	"=": "headerCenterAligned",
	"-": "row",
	"^": "attach",
}
