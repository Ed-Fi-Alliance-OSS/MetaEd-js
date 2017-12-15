// @flow

export type ColumnNamePair = {
  parentTableColumnName: string;
  foreignTableColumnName: string;
}

export function newColumnNamePair(): ColumnNamePair {
  return {
    parentTableColumnName: '',
    foreignTableColumnName: '',
  };
}
