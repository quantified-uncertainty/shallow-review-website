/**
 * Converts markdown-style links [text](url) to HTML anchor tags
 * @param text - Text containing markdown links
 * @returns HTML string with anchor tags
 */
export function convertMarkdownLinks(text: string): string {
  return text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
  );
}
