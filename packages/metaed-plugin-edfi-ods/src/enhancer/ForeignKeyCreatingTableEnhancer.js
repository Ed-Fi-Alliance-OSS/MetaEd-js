// @flow
import R from 'ramda';
import { asReferentialProperty } from 'metaed-core';
import type { EnhancerResult, EntityProperty, MergedProperty, MetaEdEnvironment } from 'metaed-core';
import { getAllColumns, getPrimaryKeys, addForeignKey } from '../model/database/Table';
import { newColumnNamePair } from '../model/database/ColumnNamePair';
import { newForeignKey, addColumnNamePair } from '../model/database/ForeignKey';
import { pluginEnvironment } from './EnhancerHelper';
import { isOdsReferenceProperty } from '../model/property/ReferenceProperty';
import type { Column } from '../model/database/Column';
import type { ForeignKey } from '../model/database/ForeignKey';
import type { Table } from '../model/database/Table';

// Get grouped properties and columns for the foreign keys
// Generate foreign keys, add columns based on primary keys of the tables
// Set cascades based on previous calculations
// Add foreign key to the table
const enhancerName: string = 'ForeignKeyCreatingTableEnhancer';

export type PropertyColumnPair = { property: EntityProperty, columns: Array<Column> }

export function getReferencePropertiesAndAssociatedColumns(table: Table): Array<PropertyColumnPair> {
  return R.compose(
    R.map((pair: PropertyColumnPair) => ({ property: R.head(pair).property, columns: R.chain(x => x.columns)(pair) })),
    R.values,
    R.groupBy((pair: PropertyColumnPair) => pair.property.withContext + pair.property.metaEdName),
    R.chain((column: Column) =>
      R.compose(
        R.map((property: EntityProperty) => ({ property, columns: [column] })),
        R.filter((property: EntityProperty) => isOdsReferenceProperty(property) && !R.propOr(false, 'isWeak')(property)),
      )(column.sourceEntityProperties),
    ),
    getAllColumns,
  )(table);
}

export function getMatchingColumnFromSourceEntityProperties(columnToMatch: Column, columns: Array<Column>): ?Column {
  const matchingColumns: Array<Column> = columns.filter(
    (column: Column) => R.not(R.isEmpty(R.intersection(columnToMatch.sourceEntityProperties, column.sourceEntityProperties))),
  );
  if (matchingColumns.length === 1) return R.head(matchingColumns);

  const nameMatch: ?Column = matchingColumns.find((column: Column) => column.name === columnToMatch.name);
  if (nameMatch != null) return nameMatch;

  const contextMatch: ?Column = matchingColumns.find(
      (column: Column) => column.mergedReferenceContexts.includes(columnToMatch.referenceContext),
    );
  return contextMatch;
}

export function getMergePropertyColumn(table: Table, column: Column, property: EntityProperty): ?Column {
  let result: ?Column;
  asReferentialProperty(property).mergedProperties.forEach((mergedProperty: MergedProperty) => {
    if (mergedProperty.mergeProperty != null
      && !column.sourceEntityProperties.includes(mergedProperty.mergeProperty)
      && !column.mergedReferenceContexts.some(
        (context: string) => context.startsWith(R.tail(mergedProperty.mergePropertyPath).join('')),
      )) return;

    const expandedTargetProperties: Array<EntityProperty> = [];
    if (mergedProperty.targetProperty != null) {
      if (isOdsReferenceProperty(mergedProperty.targetProperty)) {
        expandedTargetProperties.push(...R.chain((x: Column) => x.sourceEntityProperties)(
          R.compose(
            R.uniq,
            getPrimaryKeys,
            // $FlowIgnore - targetProperty could be null/undefined
          )(asReferentialProperty(mergedProperty.targetProperty).referencedEntity.data.edfiOds.ods_EntityTable),
        ));
      } else {
        expandedTargetProperties.push(mergedProperty.targetProperty);
      }
    }

    const targetProperty: EntityProperty = expandedTargetProperties.length === 1
      ? R.head(expandedTargetProperties)
      : R.head(expandedTargetProperties.filter((x: EntityProperty) => column.sourceEntityProperties.includes(x)));

    let targetPropertyPath: string = R.join('')(mergedProperty.targetPropertyPath);
    if (property.parentEntity.type !== 'choice' && table.name !== property.parentEntity.data.edfiOds.ods_TableName) {
      // If dealing with a property from a parent table for a join table primary key, add the parent entity name to make paths match
      targetPropertyPath = property.parentEntity.data.edfiOds.ods_TableName + targetPropertyPath;
    }
    result = getAllColumns(table).find((x: Column) => x.sourceEntityProperties.includes(targetProperty)
      // startsWith() used because we can merge references in the middle of a reference context, but the start will always match
      && x.mergedReferenceContexts.some((context: string) => context.startsWith(targetPropertyPath)),
    );
  });
  return result;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const edfiOdsPlugin = pluginEnvironment(metaEd);
  if (edfiOdsPlugin == null) return { enhancerName, success: false };

  edfiOdsPlugin.entity.table.forEach((parentTable: Table) => {
    const parentTablePropertyColumnPairs: Array<PropertyColumnPair> = getReferencePropertiesAndAssociatedColumns(parentTable);
    parentTablePropertyColumnPairs.forEach((parentTablePairs: PropertyColumnPair) => {
      const foreignTable: Table = edfiOdsPlugin.entity.table.get(parentTablePairs.property.metaEdName);
      const foreignKey: ForeignKey = Object.assign(newForeignKey(), {
        foreignTableName: foreignTable.name,
        foreignTableSchema: foreignTable.schema,
      });

      getPrimaryKeys(foreignTable).forEach((foreignTablePk: Column) => {
        const matchingColumn: ?Column = getMatchingColumnFromSourceEntityProperties(foreignTablePk, parentTablePairs.columns);
        const parentTableColumn: ?Column = matchingColumn != null
          ? matchingColumn
          : getMergePropertyColumn(parentTable, foreignTablePk, parentTablePairs.property);
        if (parentTableColumn == null) { throw new Error(`Could not find matching foreign key columns for parent property ${parentTable.schema}.${parentTable.name}.${parentTablePairs.property.metaEdName} and referenced field ${foreignTable.schema}.${foreignTable.name}.${foreignTablePk.name}`); }

        addColumnNamePair(foreignKey, Object.assign(newColumnNamePair(), {
          parentTableColumnName: parentTableColumn.name,
          foreignTableColumnName: foreignTablePk.name,
        }));
      });

      const isReference = parentTablePairs.property != null
      && isOdsReferenceProperty(parentTablePairs.property);

      foreignKey.withDeleteCascade = isReference
        && parentTablePairs.property.data.edfiOds.ods_DeleteCascadePrimaryKey;

      foreignKey.withUpdateCascade = isReference
        && asReferentialProperty(parentTablePairs.property).referencedEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates
        && !parentTablePairs.property.data.edfiOds.ods_CausesCyclicUpdateCascade;

      addForeignKey(parentTable, foreignKey);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
