import { ForeignKey } from '@edfi/metaed-plugin-edfi-ods-relational';
import { ChangeDataColumn } from './ChangeDataColumn';
import { HasTriggerName } from './HasName';

export interface DeleteTrackingTrigger extends HasTriggerName {
  triggerSchema: string;
  targetTableSchema: string;
  targetTableName: string;
  targetTableNameCasePreserved: string;
  deleteTrackingTableSchema: string;
  deleteTrackingTableName: string;
  primaryKeyColumnNames: string[];
  targetTableIsSubclass: boolean;
  foreignKeyToSuperclass: ForeignKey | null;
  isDescriptorTable: boolean;
  isStyle5dot4: boolean;
  changeDataColumns: ChangeDataColumn[];
  needsDeclare: boolean;
  isIgnored: boolean;
  omitDiscriminator: boolean;
  includeNamespace: boolean;
}

export function newDeleteTrackingTrigger(): DeleteTrackingTrigger {
  return {
    triggerSchema: '',
    triggerName: '',
    targetTableSchema: '',
    targetTableName: '',
    targetTableNameCasePreserved: '',
    deleteTrackingTableSchema: '',
    deleteTrackingTableName: '',
    primaryKeyColumnNames: [],
    targetTableIsSubclass: false,
    foreignKeyToSuperclass: null,
    isDescriptorTable: false,
    isStyle5dot4: false,
    changeDataColumns: [],
    needsDeclare: false,
    isIgnored: false,
    omitDiscriminator: false,
    includeNamespace: false,
  };
}
