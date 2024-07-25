import { PairedForeignKeyColumnName } from './PairedForeignKeyColumnName';

export type IndirectUpdateCascadeTrigger = {
  mainTableSchema: string;
  mainTableName: string;
  subTableSchema: string;
  subTableName: string;
  checkForUpdateColumnNames: string[];
  fkToMainTableColumnNames: PairedForeignKeyColumnName[];
};

export function newIndirectUpdateCascadeTrigger(): IndirectUpdateCascadeTrigger {
  return {
    mainTableSchema: '',
    mainTableName: '',
    subTableSchema: '',
    subTableName: '',
    checkForUpdateColumnNames: [],
    fkToMainTableColumnNames: [],
  };
}
