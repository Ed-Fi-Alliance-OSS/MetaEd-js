// @flow
import { newEnumerationRowBase } from './EnumerationRowBase';
import type { EnumerationRowBase } from './EnumerationRowBase';

export type EnumerationRow = {
  ...$Exact<EnumerationRowBase>;
  codeValue: string;
  description: string;
  shortDescription: string;
}

export function newEnumerationRow(): EnumerationRow {
  return Object.assign({}, newEnumerationRowBase(), {
    codeValue: '',
    description: '',
    shortDescription: '',
  });
}

export const NoEnumerationRow: EnumerationRow = Object.assign(newEnumerationRow(), {
  name: 'NoEnumerationRow',
});
