// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import antlr4 from '@edfi/antlr4';
import { ValidationFailure } from '../validator/ValidationFailure';

export class MetaEdErrorListener {
  messageCollection: ValidationFailure[];

  validatorName: string;

  constructor(messageCollection: ValidationFailure[], validatorName: string = 'MetaEdErrorListener') {
    antlr4.error.ErrorListener.call(this);
    this.messageCollection = messageCollection;
    this.validatorName = validatorName;
  }

  syntaxError(_1: any, offendingSymbol: any, concatenatedLineNumber: number, characterPosition: number, message: string) {
    this.messageCollection.push({
      validatorName: this.validatorName,
      category: 'error',
      message,
      sourceMap: {
        line: concatenatedLineNumber,
        column: characterPosition,
        tokenText: offendingSymbol && offendingSymbol.text ? offendingSymbol.text : '',
      },
      fileMap: null,
    });
  }

  getMessageCollection(): ValidationFailure[] {
    return this.messageCollection;
  }
}
