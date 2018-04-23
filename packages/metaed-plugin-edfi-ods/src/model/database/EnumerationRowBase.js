// @flow
import deepFreeze from 'deep-freeze';

export type EnumerationRowBase = {
  name: string,
  type: string,
  namespace: string,
  schemaName: string,
  tableName: string,
  documentation: string,
};

export function newEnumerationRowBase(): EnumerationRowBase {
  return {
    name: '',
    type: 'enumerationRow',
    namespace: '',
    schemaName: '',
    tableName: '',
    documentation: '',
  };
}

export const NoEnumerationRowBase: EnumerationRowBase = deepFreeze(
  Object.assign(newEnumerationRowBase(), {
    name: 'NoEnumerationRowBase',
  }),
);
