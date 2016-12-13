// @flow
import path from 'path';
import { Record } from 'immutable';

type MetaEdFileRecord = {
  contents: string;
  lineCount: number;
  directoryName: string;
  filename: string;
  fullName: string;
}

export type MetaEdFile = Record<MetaEdFileRecord>;

export const MetaEdFileInstance: MetaEdFile = Record({
  contents: null,
  lineCount: null,
  directoryName: null,
  filename: null,
  fullName: null,
});

export type FileSet = {
  namespace: string,
  projectExtension: string,
  isExtension: boolean,
  files: MetaEdFile[],
}

export function createMetaEdFile(directoryName: string, filename: string, originalContents: string): MetaEdFile {
  let contents = originalContents;
  if (contents == null) contents = '';

  if (!contents.endsWith('\r\n') && !contents.endsWith('\n')) {
    contents += '\r\n';
  }

  const lineCount = contents.split(/\r\n|\r|\n/).length - 1;

  // $FlowFixMe -- doesn't like constructor call on Immutable.Record
  return new MetaEdFileInstance({
    contents,
    lineCount,
    directoryName,
    filename,
    fullName: directoryName ? path.join(directoryName, filename) : filename,
  });
}
