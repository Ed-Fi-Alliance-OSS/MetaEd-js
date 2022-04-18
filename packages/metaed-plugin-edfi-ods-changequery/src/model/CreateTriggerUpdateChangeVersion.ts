import { ChangeDataColumn } from './ChangeDataColumn';
import { HasTableName } from './HasName';

export interface CreateTriggerUpdateChangeVersion extends HasTableName {
  schema: string;
  triggerName: string;
  primaryKeyColumnNames: string[];
  changeDataColumns: ChangeDataColumn[];
  includeKeyChanges: boolean;
  isStyle6dot0: boolean;
  omitDiscriminator: boolean;
  includeNamespace: boolean;
}

export function newCreateTriggerUpdateChangeVersion(): CreateTriggerUpdateChangeVersion {
  return {
    schema: '',
    tableName: '',
    triggerName: '',
    primaryKeyColumnNames: [],
    changeDataColumns: [],
    includeKeyChanges: false,
    isStyle6dot0: false,
    omitDiscriminator: false,
    includeNamespace: false,
  };
}
