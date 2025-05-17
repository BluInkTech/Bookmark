export class UnicodeIterator {
	private characters: string[]
	position: number
	current: string | null
	input: string

	constructor(input: string) {
		this.input = input
		// Properly split the string into Unicode characters
		this.characters = Array.from(input)
		this.position = 0
		this.current = this.characters.length > 0 ? this.characters[0] : null
	}

	// Move to the next character
	next(): string | null {
		if (this.position < this.characters.length - 1) {
			this.position++
			this.current = this.characters[this.position]
			return this.current
		}
		this.position = this.characters.length
		this.current = null
		return null
	}

	// Reset the iterator to the beginning
	reset(): void {
		this.position = 0
		this.current = this.characters.length > 0 ? this.characters[0] : null
	}

	// Check if the iterator has more characters
	hasNext(): boolean {
		return this.position < this.characters.length - 1
	}

	advance(n = 1): void {
		if (n > 0) {
			for (let i = 0; i < n && this.hasNext(); i++) {
				this.next()
			}
		}
	}

	isWhitespace(): boolean {
		return this.current === " "
	}

	// Eat a single whitespace character
	eatWhitespace(): boolean {
		if (this.current === " ") {
			this.next()
			return true
		}
		return false
	}

	// Eat all whitespace characters
	eatWhitespaces() {
		while (this.current === " ") {
			this.next()
		}
	}

	eatNumber(): number {
		let result = ""
		while (this.current && /\d/.test(this.current)) {
			result += this.current
			this.next()
		}
		return Number.parseInt(result, 10)
	}

	// Eat all characters until a specific character is found
	eatUntil(char: string): string {
		let result = ""
		while (this.current !== char && this.hasNext()) {
			result += this.current
			this.next()
		}
		return result
	}

	/**
	 * Consumes characters from the current position in the input until the end.
	 *
	 * @returns {string} The string of characters consumed until the end.
	 */
	eatUntilEnd(): string {
		return this.input.substring(this.position)
	}
}
