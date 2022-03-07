import { ForeignKey } from '@edfi/metaed-plugin-edfi-ods-relational';
import { ChangeDataColumn } from './ChangeDataColumn';

export interface DeleteTrackingTrigger {
  triggerSchema: string;
  triggerName: string;
  targetTableSchema: string;
  targetTableName: string;
  deleteTrackingTableSchema: string;
  deleteTrackingTableName: string;
  primaryKeyColumnNames: string[];
  targetTableIsSubclass: boolean;
  foreignKeyToSuperclass: ForeignKey | null;
  isDescriptorTable: boolean;
  isStyle5dot4: boolean;
  changeDataColumns: ChangeDataColumn[];
  isIgnored: boolean;
  omitDiscriminator: boolean;
}

export function newDeleteTrackingTrigger(): DeleteTrackingTrigger {
  return {
    triggerSchema: '',
    triggerName: '',
    targetTableSchema: '',
    targetTableName: '',
    deleteTrackingTableSchema: '',
    deleteTrackingTableName: '',
    primaryKeyColumnNames: [],
    targetTableIsSubclass: false,
    foreignKeyToSuperclass: null,
    isDescriptorTable: false,
    isStyle5dot4: false,
    changeDataColumns: [],
    isIgnored: false,
    omitDiscriminator: false,
  };
}
