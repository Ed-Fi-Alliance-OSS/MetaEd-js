import { ChangeDataColumn } from './ChangeDataColumn';

export interface CreateTriggerUpdateChangeVersion {
  schema: string;
  tableName: string;
  triggerName: string;
  primaryKeyColumnNames: string[];
  changeDataColumns: ChangeDataColumn[];
  includeKeyChanges: boolean;
}
