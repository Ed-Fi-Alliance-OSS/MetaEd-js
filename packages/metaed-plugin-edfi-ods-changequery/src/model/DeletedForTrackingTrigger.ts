import { ForeignKey } from '@edfi/metaed-plugin-edfi-ods-relational';
import { HasTriggerName } from './HasName';

export interface DeleteTrackingTrigger extends HasTriggerName {
  triggerSchema: string;
  targetTableSchema: string;
  targetTableName: string;
  deleteTrackingTableSchema: string;
  deleteTrackingTableName: string;
  primaryKeyColumnNames: string[];
  targetTableIsSubclass: boolean;
  foreignKeyToSuperclass: ForeignKey | null;
}
