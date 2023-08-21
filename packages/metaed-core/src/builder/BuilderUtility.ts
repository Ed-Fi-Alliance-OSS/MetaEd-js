function quoteCorrection(rawDocumentation: string): string {
  return rawDocumentation.substr(1, rawDocumentation.length - 2).replace(/""/g, '"');
}

// ANTLR provides token text of the form <xyz> for some error conditions
// Our language has no valid text tokens that start with '<'
// (even documentation free text, as it starts with double-quote).
// Other error conditions have token text as null, even though the context
// was not flagged with an exception.
export const isErrorText = (text: string): boolean => text == null || text.startsWith('<');

function extractText(contextWithText: any): string {
  if (
    contextWithText.exception ||
    contextWithText.TEXT() == null ||
    contextWithText.TEXT().exception != null ||
    isErrorText(contextWithText.TEXT().getText())
  ) {
    return '';
  }
  return quoteCorrection(contextWithText.TEXT().getText());
}

export const extractShortDescription = extractText;
export const extractDocumentation = extractText;
export const extractDeprecationReason = extractText;
