import { parse } from "../src/parser"
import { errors, getErrorCode } from "../src/diagnostics"
import test from "node:test"
import assert from "node:assert"

test.suite("Basic block tests", () => {
	test("missing block type", (t) => {
		const input = "~"
		const result = parse(input)
		assert.equal(result.diagnostics.length, 1)
		assert.equal(
			result.diagnostics[0].msgId,
			getErrorCode(errors.MISSING_BLOCK_TYPE),
		)
	})

	test("invalid block type", (t) => {
		const input = "~x"
		const result = parse(input)
		assert.equal(result.diagnostics.length, 1)
		assert.equal(
			result.diagnostics[0].msgId,
			getErrorCode(errors.INVALID_BLOCK_TYPE),
		)
	})

	test("missing whitespace after block type", (t) => {
		const input = "~1Heading"
		const result = parse(input)
		assert.equal(result.diagnostics.length, 1)
		assert.equal(
			result.diagnostics[0].msgId,
			getErrorCode(errors.MISSING_WHITESPACE),
		)
	})
})

test.suite("Heading tests", () => {
	test("missing heading text", (t) => {
		const input = "~1 "
		const result = parse(input)
		assert.equal(result.diagnostics.length, 1)
		assert.equal(
			result.diagnostics[0].msgId,
			getErrorCode(errors.MISSING_HEADING_TEXT),
		)
	})

	test("valid heading 1 block", (t) => {
		const input = "~1 Heading"
		const result = parse(input)
		assert.equal(result.diagnostics.length, 0)
		assert.equal(result.cst.length, 1)
		const line = result.cst[0]
		assert.equal(line.type, "block")
		assert.equal(line.tokens.length, 3)
		assert.equal(line.tokens[0].value, "startHeading1")
		assert.equal(line.tokens[1].value, "Heading")
		assert.equal(line.tokens[2].value, "endHeading1")
	})

	test("valid heading 2 block", (t) => {
		const input = "~2 Heading"
		const result = parse(input)
		assert.equal(result.diagnostics.length, 0)
		assert.equal(result.cst.length, 1)
		const line = result.cst[0]
		assert.equal(line.type, "block")
		assert.equal(line.tokens.length, 3)
		assert.equal(line.tokens[0].value, "startHeading2")
		assert.equal(line.tokens[1].value, "Heading")
		assert.equal(line.tokens[2].value, "endHeading2")
	})

	test("valid heading 3 block", (t) => {
		const input = "~3 Heading"
		const result = parse(input)
		assert.equal(result.diagnostics.length, 0)
		assert.equal(result.cst.length, 1)
		const line = result.cst[0]
		assert.equal(line.type, "block")
		assert.equal(line.tokens.length, 3)
		assert.equal(line.tokens[0].value, "startHeading3")
		assert.equal(line.tokens[1].value, "Heading")
		assert.equal(line.tokens[2].value, "endHeading3")
	})

	test("valid heading 4 block", (t) => {
		const input = "~4 Heading"
		const result = parse(input)
		assert.equal(result.diagnostics.length, 0)
		assert.equal(result.cst.length, 1)
		const line = result.cst[0]
		assert.equal(line.type, "block")
		assert.equal(line.tokens.length, 3)
		assert.equal(line.tokens[0].value, "startHeading4")
		assert.equal(line.tokens[1].value, "Heading")
		assert.equal(line.tokens[2].value, "endHeading4")
	})

	test("valid heading 5 block", (t) => {
		const input = "~5 Heading"
		const result = parse(input)
		assert.equal(result.diagnostics.length, 0)
		assert.equal(result.cst.length, 1)
		const line = result.cst[0]
		assert.equal(line.type, "block")
		assert.equal(line.tokens.length, 3)
		assert.equal(line.tokens[0].value, "startHeading5")
		assert.equal(line.tokens[1].value, "Heading")
		assert.equal(line.tokens[2].value, "endHeading5")
	})

	test("valid heading 6 block", (t) => {
		const input = "~6 Heading"
		const result = parse(input)
		assert.equal(result.diagnostics.length, 0)
		assert.equal(result.cst.length, 1)
		const line = result.cst[0]
		assert.equal(line.type, "block")
		assert.equal(line.tokens.length, 3)
		assert.equal(line.tokens[0].value, "startHeading6")
		assert.equal(line.tokens[1].value, "Heading")
		assert.equal(line.tokens[2].value, "endHeading6")
	})
})
