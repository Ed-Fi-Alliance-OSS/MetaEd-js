// @flow
export interface ValidationMessage {
    message: string;
    fileName: string;
    lineNumber: number;
    characterPosition: number;
    concatenatedLineNumber: number;
}

