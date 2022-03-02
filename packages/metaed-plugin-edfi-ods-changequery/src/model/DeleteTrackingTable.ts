import { Column } from '@edfi/metaed-plugin-edfi-ods-relational';
import { ChangeDataColumn } from './ChangeDataColumn';
import { HasTableName } from './HasName';

export interface DeleteTrackingTable extends HasTableName {
  schema: string;
  columns: Column[];
  primaryKeyName: string;
  primaryKeyColumns: Column[];
  isStyle5dot4: boolean;
  isDescriptorTable: boolean;
  isIgnored: boolean;
  changeDataColumns: ChangeDataColumn[];
  omitDiscriminator: boolean;
}

export function newDeleteTrackingTable(): DeleteTrackingTable {
  return {
    schema: '',
    tableName: '',
    columns: [],
    primaryKeyName: '',
    primaryKeyColumns: [],
    isStyle5dot4: false,
    isDescriptorTable: false,
    isIgnored: false,
    changeDataColumns: [],
    omitDiscriminator: false,
  };
}
