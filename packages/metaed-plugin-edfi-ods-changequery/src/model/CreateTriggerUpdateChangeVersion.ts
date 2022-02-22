export interface CreateTriggerUpdateChangeVersion {
  schema: string;
  tableName: string;
  triggerName: string;
  primaryKeyColumnNames: string[];
  includeKeyChanges: boolean;
}
