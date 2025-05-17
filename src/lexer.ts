/**
 * Simple general purpose lexer for parsing a string into tokens using Regex
 * expression.
 */

export type Patterns = Record<string, RegExp>
export type Token = {
	type: string
	value: string
	offset: number
}

const patternCache: Map<Patterns, RegExp> = new Map()

// Joins all the patterns into a single regex with named groups
function compilePatterns(patterns: Patterns) {
	const pattern = Object.entries(patterns)
		.map(([name, regex]) => `(?<${name}>${regex.source})`)
		.join("|")
	const regex = new RegExp(pattern, "miuy")
	patternCache.set(patterns, regex)
	return regex
}

export function tokenize(input: string, patterns: Patterns) {
	const tokens: Token[] = []
	const regex = patternCache.get(patterns) || compilePatterns(patterns)
	let lastIndex = 0 // Track the current position manually

	while (lastIndex < input.length) {
		// Set the regex to start matching from the current position
		regex.lastIndex = lastIndex
		const match = regex.exec(input)

		if (match?.groups) {
			const groups = match.groups
			let matched = false

			for (const name in groups) {
				const value = groups[name]
				if (value !== undefined && name !== "ignore") {
					tokens.push({
						type: name,
						value: value,
						offset: lastIndex,
					})
					// Move the position forward by the length of the matched value
					lastIndex += value.length
					matched = true
					break
				}
			}

			if (!matched) {
				// If no valid group matched, move forward to avoid
				// infinite loops
				lastIndex++
			}
		} else {
			// If no match is found, treat the remaining input as an error
			tokens.push({
				type: "error",
				value: input.slice(lastIndex),
				offset: lastIndex,
			})
			break
		}
	}

	return tokens
}

export type Grammar = {
	start: Array<string>
	end: Array<string>
	follow: Record<string, Array<string>>
	title: Record<string, string>
}

export function validate(tokens: Token[], grammar: Grammar) {
	const toStr = (tokens: string[]) => {
		let str = ""
		for (let i = 0; i < tokens.length; i++) {
			const tokenName = tokens[i]
			str += `'${grammar.title[tokenName] || tokenName}'`
			if (i < tokens.length - 1) {
				str += ", "
			}
		}

		return str
	}

	// Validate that the tokens match the LL(1) parser table
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i]
		if (i === 0) {
			// Check if the first token is a start token
			if (!grammar.start.includes(token.type)) {
				throw {
					message: `Unexpected token, was expecting ${toStr(grammar.start)}`,
					offset: token.offset,
				}
			}
		} else if (i > 0) {
			// Check if the token is in the follow set of the previous token
			const prevToken = tokens[i - 1]
			if (!grammar.follow[prevToken.type].includes(token.type)) {
				throw {
					message: `Unexpected token, was expecting ${toStr(
						grammar.follow[prevToken.type],
					)}`,
					offset: token.offset,
				}
			}
		}
	}

	// Check if the last token is an end token
	const last = tokens[tokens.length - 1]
	if (!grammar.end.includes(last.type)) {
		throw {
			message: `Unexpected token, was expecting ${toStr(
				grammar.follow[last.type],
			)}`,
			offset: last.offset,
		}
	}
}
