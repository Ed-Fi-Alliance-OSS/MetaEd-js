// @flow

export type Trigger = {
  schema: string;
  name: string;
  tableSchema: string;
  tableName: string;
  onInsert: boolean;
  onUpdate: boolean;
  onDelete: boolean;
  isAfter: boolean;
  body: string;
  repositoryId: string;
  namespace: string;
  metaEdType: string;
  insertUpdateDelete: Array<string>;
}

export function newTrigger(): Trigger {
  return {
    schema: '',
    name: '',
    type: 'trigger',
    tableSchema: '',
    tableName: '',
    onInsert: false,
    onUpdate: false,
    onDelete: false,
    isAfter: false,
    body: '',
    repositoryId: '', // = name
    namespace: '', // = schema
    metaEdType: '', // = type
    insertUpdateDelete: [],
  };
}

export const NoTrigger: Trigger = Object.assign({}, newTrigger(), {
  name: 'NoTrigger',
});

export function insertUpdateDelete(trigger: Trigger): Array<string> {
  const result = [];
  if (trigger.onInsert) result.push('INSERT');
  if (trigger.onUpdate) result.push('UPDATE');
  if (trigger.onDelete) result.push('DELETE');
  return result;
}
