import { ChangeDataColumn } from './ChangeDataColumn';
import { HasTableName } from './HasName';

export interface CreateTriggerUpdateChangeVersion extends HasTableName {
  schema: string;
  triggerName: string;
  primaryKeyColumnNames: string[];
  changeDataColumns: ChangeDataColumn[];
  includeKeyChanges: boolean;
}
