import { Column } from '@edfi/metaed-plugin-edfi-ods-relational';

export interface DeleteTrackingTable {
  schema: string;
  tableName: string;
  columns: Column[];
  primaryKeyName: string;
  primaryKeyColumns: Column[];
  isStyle5dot4: boolean;
}

export function newDeleteTrackingTable(): DeleteTrackingTable {
  return {
    schema: '',
    tableName: '',
    columns: [],
    primaryKeyName: '',
    primaryKeyColumns: [],
    isStyle5dot4: false,
  };
}
