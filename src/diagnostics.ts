import { blockTypeMap, boxTypeMap } from "./tokens.js"

// Get error code from error message
export function getErrorCode(message: string): string {
	const match = message.match(/^[A-Z_]+:/)
	if (match) {
		return match[0].slice(0, -1) // Remove the trailing colon
	}
	return ""
}

export const errors = {
	MISSING_BLOCK_TYPE: `MISSING_BLOCK_TYPE:The line is started with a block ('~') command but no valid block type is provided. Valid options are ${Object.keys(
		blockTypeMap,
	).join(",")}`,
	INVALID_BLOCK_TYPE: `INVALID_BLOCK_TYPE:The line is started with a block ('~') command but no valid block type is provided. Valid options are ${Object.keys(
		blockTypeMap,
	).join(",")}`,
	MISSING_WHITESPACE: "MISSING_WHITESPACE:Expected whitespace.",
	MISSING_HEADING_TEXT: "MISSING_HEADING_TEXT:Blank headings are not allowed.",
	MISSING_BOX_TYPE_OR_TITLE: `MISSING_BOX_TYPE_OR_TITLE:Box command is missing a box type or title. Valid options are ${Object.keys(
		boxTypeMap,
	).join(",")}`,
}
