import { ForeignKey } from '@edfi/metaed-plugin-edfi-ods-relational';

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
}
