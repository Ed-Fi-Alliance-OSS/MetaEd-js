// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import path from 'path';

export interface MetaEdFile {
  contents: string;
  lineCount: number;
  directoryName: string;
  filename: string;
  fullPath: string;
}

export interface FileSet {
  namespaceName: string;
  projectExtension: string;
  projectName: string;
  isExtension: boolean;
  files: MetaEdFile[];
}

export function createMetaEdFile(directoryName: string, filename: string, originalContents: string): MetaEdFile {
  let contents = originalContents;
  if (contents == null) contents = '';

  if (!contents.endsWith('\r\n') && !contents.endsWith('\n')) {
    contents += '\r\n';
  }

  const lineCount = contents.split(/\r\n|\r|\n/).length - 1;

  return {
    contents,
    lineCount,
    directoryName,
    filename,
    fullPath: directoryName ? path.join(directoryName, filename) : filename,
  };
}
