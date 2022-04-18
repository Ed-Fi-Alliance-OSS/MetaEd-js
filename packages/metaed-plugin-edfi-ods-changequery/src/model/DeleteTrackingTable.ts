import { Column } from '@edfi/metaed-plugin-edfi-ods-relational';
import { ChangeDataColumn } from './ChangeDataColumn';
import { HasTableName } from './HasName';

export interface DeleteTrackingTable extends HasTableName {
  schema: string;
  columns: Column[];
  primaryKeyName: string;
  primaryKeyColumns: Column[];
  isStyle6dot0: boolean;
  isDescriptorTable: boolean;
  isIgnored: boolean;
  changeDataColumns: ChangeDataColumn[];
  omitDiscriminator: boolean;
  includeNamespace: boolean;
}

export function newDeleteTrackingTable(): DeleteTrackingTable {
  return {
    schema: '',
    tableName: '',
    columns: [],
    primaryKeyName: '',
    primaryKeyColumns: [],
    isStyle6dot0: false,
    isDescriptorTable: false,
    isIgnored: false,
    changeDataColumns: [],
    omitDiscriminator: false,
    includeNamespace: false,
  };
}
