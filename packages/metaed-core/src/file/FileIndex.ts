// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import { MetaEdFile } from './MetaEdFile';

export interface FileAndLineNumber {
  file: MetaEdFile;
  lineNumber: number;
}

export interface FileMap {
  fullPath: string;
  lineNumber: number;
}

export interface FileIndex {
  fileAndLineNumbersSorted: FileAndLineNumber[];
  totalLineCount: number;
}

export function getAllContents(fileIndex: FileIndex | null): string {
  if (fileIndex == null) return '';
  return fileIndex.fileAndLineNumbersSorted.map((x) => x.file.contents).join('');
}

export function getFilenameAndLineNumber(fileIndex: FileIndex, concatenatedLineNumber: number): FileMap {
  const matchingFileAndLineNumber = R.findLast(
    (x) => x.lineNumber <= concatenatedLineNumber,
    fileIndex.fileAndLineNumbersSorted,
  );

  if (matchingFileAndLineNumber == null) {
    return { fullPath: 'Error/matchingFileAndLineNumber/null', lineNumber: -1 };
  }

  const lineNumber = concatenatedLineNumber - matchingFileAndLineNumber.lineNumber + 1;
  return { fullPath: matchingFileAndLineNumber.file.fullPath, lineNumber };
}

export function createFileIndex(metaEdFiles: MetaEdFile[]): FileIndex {
  const fileAndLineNumbers: FileAndLineNumber[] = [];
  let lineNumber = 1;
  metaEdFiles.forEach((file) => {
    fileAndLineNumbers.push({ file, lineNumber });
    lineNumber += file.lineCount;
  });

  return {
    fileAndLineNumbersSorted: R.sortBy(R.prop('lineNumber'))(fileAndLineNumbers),
    totalLineCount: lineNumber,
  };
}
