// @flow
import R from 'ramda';
import Sugar from 'sugar';
import { getEntitiesOfType } from 'metaed-core';
import type { EnhancerResult, MetaEdEnvironment, ModelBase } from 'metaed-core';
import { getForeignKeys } from '../model/database/Table';
import { newTrigger } from '../model/database/Trigger';
import { pluginEnvironment } from './EnhancerHelper';
import type { ColumnNamePair } from '../model/database/ColumnNamePair';
import type { ForeignKey } from '../model/database/ForeignKey';
import type { Trigger } from '../model/database/Trigger';

const enhancerName: string = 'DeleteTriggerEnhancer';

const TRIGGER: string =
`    SET NOCOUNT ON

    INSERT INTO [dbo].[DeleteEvent] ([Id], [DeletionDate], [TableName], [SchemaName])
    SELECT [Id], getutcdate(), N'{0}', N'{1}'
    FROM {2}`;

const FROM_CLAUSE: string =
`[deleted] d
    INNER JOIN [{0}].[{1}] base
        ON
            {2}
;`;

function fromClauseFor(entity: ModelBase): string {
  if (!['associationSubclass', 'domainEntitySubclass'].includes(entity.type)) return '[deleted]';

  const baseEntity = R.prop('baseEntity');
  const namespace: string = baseEntity(entity).namespaceInfo.namespace;
  const tableName: string = baseEntity(entity).data.edfiOds.ods_TableName;

  const foreignKey: ForeignKey = R.head(getForeignKeys(entity.data.edfiOds.ods_EntityTable)
    .filter((fk: ForeignKey) =>
      fk.parentTableSchema === entity.namespaceInfo.namespace
        && fk.parentTableName === entity.data.edfiOds.ods_TableName
        && fk.foreignTableSchema === namespace
        && fk.foreignTableName === tableName,
    ));

  const prependAnd = R.when(R.propSatisfies(R.gt(R.__, 0), 'length'), () => '\n            AND ');
  const onClause: string = foreignKey.columnNames.reduce(
    (string: string, column: ColumnNamePair) =>
      string.concat(`${prependAnd(string)}[d].[${column.parentTableColumnName}] = [base].[${column.foreignTableColumnName}]`),
    '',
  );


  return Sugar.String.format(FROM_CLAUSE, namespace, tableName, onClause);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfType(
    metaEd.entity,
    'association',
    'associationExtension',
    'associationSubclass',
    'domainEntity',
    'domainEntityExtension',
    'domainEntitySubclass',
  ).forEach((entity: ModelBase) => {
    const trigger: Trigger = Object.assign(newTrigger(), {
      name: `${entity.data.edfiOds.ods_TableName}_TR_DeleteEvent`,
      schema: entity.namespaceInfo.namespace,
      tableName: entity.data.edfiOds.ods_TableName,
      tableSchema: entity.namespaceInfo.namespace,
      isAfter: true,
      onDelete: true,
      body: Sugar.String.format(
        TRIGGER,
        entity.data.edfiOds.ods_TableName,
        entity.namespaceInfo.namespace,
        fromClauseFor(entity),
      ),
    });

    pluginEnvironment(metaEd).entity.trigger.set(trigger.name, trigger);
  });

  return {
    enhancerName,
    success: true,
  };
}
