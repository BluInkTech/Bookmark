import test from "node:test"
import assert from "node:assert"
import { UnicodeIterator } from "../src/iterator.js"

test.suite("UnicodeIterator", () => {
	test("basic navigation", () => {
		const it = new UnicodeIterator("abc")
		// By default, position is 0, but current is undefined/null
		assert.strictEqual(it.position, 0)
		assert.strictEqual(it.current, "a")

		// Move to next character
		assert.strictEqual(it.next(), "b")
		assert.strictEqual(it.position, 1)
		assert.strictEqual(it.current, "b")

		// Move to next character again
		assert.strictEqual(it.next(), "c")
		assert.strictEqual(it.position, 2)
		assert.strictEqual(it.current, "c")

		// No more next
		assert.strictEqual(it.next(), null)
	})

	test("hasNext and hasPrevious", () => {
		const it = new UnicodeIterator("xy")
		assert.strictEqual(it.hasNext(), true)

		it.next()
		assert.strictEqual(it.hasNext(), false)
	})

	test("advance forward", () => {
		const it = new UnicodeIterator("12345")
		it.next() // position 1
		it.advance(2) // should move to position 3
		assert.strictEqual(it.position, 3)
		assert.strictEqual(it.current, "4")
	})

	test("eatWhitespace and eatWhitespaces", () => {
		const it = new UnicodeIterator("  ab")
		it.next() // position 1, current is ' '
		it.eatWhitespace()
		assert.strictEqual(it.current, "a")

		it.reset()
		it.next() // position 1, current is ' '
		it.eatWhitespaces()
		assert.strictEqual(it.current, "a")
	})

	test("eatNumber", () => {
		const it = new UnicodeIterator("123abc")
		const num = it.eatNumber()
		assert.strictEqual(num, 123)
	})

	test("eatUntil", () => {
		const it = new UnicodeIterator("hello,world")
		const result = it.eatUntil(",")
		assert.strictEqual(result, "hello")
	})

	test("eatUntilEnd", () => {
		const it = new UnicodeIterator("foo")
		it.current = "f"
		const result = it.eatUntilEnd()
		assert.strictEqual(result, "foo")
	})
})
