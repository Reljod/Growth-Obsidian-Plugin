export const getAllLinesFromMarkdownContent = (mdContent: string) =>
	mdContent.split(/\r?\n/);
export const combineMarkdownContentLines = (lines: string[]) =>
	lines.join("\n");
