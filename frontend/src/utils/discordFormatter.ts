/**
 * Convert markdown to Discord-compatible format
 * Discord doesn't support headers, tables, etc.
 */
export function convertToDiscordFormat(markdown: string): string {
  let discord = markdown;

  // Convert headers to bold text
  // ### Header -> **Header**
  discord = discord.replace(/^#{1,6}\s+(.+)$/gm, '**$1**');

  // Convert tables to code blocks
  // Detect table (lines with |)
  const tableRegex = /(\|.+\|[\r\n]+)+/g;
  discord = discord.replace(tableRegex, (match) => {
    return '```\n' + match + '```\n';
  });

  // Convert HTML to plain text (if any)
  discord = discord.replace(/<[^>]+>/g, '');

  // Ensure code blocks use Discord format
  // Already compatible: ```language\ncode\n```

  // Ensure lists are properly formatted
  // Already compatible: - item or 1. item

  // Ensure quotes are properly formatted
  // Already compatible: > quote

  return discord.trim();
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}
