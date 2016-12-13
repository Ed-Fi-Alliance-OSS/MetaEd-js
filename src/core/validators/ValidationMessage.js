// @flow

export type ValidationMessage = {
  message: string,
  filename: string,
  lineNumber: number,
  characterPosition: number,
  concatenatedLineNumber: number,
  tokenText: string
}
