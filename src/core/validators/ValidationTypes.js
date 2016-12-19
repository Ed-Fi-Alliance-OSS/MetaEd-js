// @flow

export type ValidationMessage = {
  validatorName?: string,
  message: string,
  filename: string,
  lineNumber: number,
  characterPosition: number,
  concatenatedLineNumber: number,
  tokenText: string
}

export type ValidationProblem = {
  validatorName: string,
  reason: string,
}

export type ValidatableResult = {
  invalidPath?: string[],
  validatorName: string,
}
