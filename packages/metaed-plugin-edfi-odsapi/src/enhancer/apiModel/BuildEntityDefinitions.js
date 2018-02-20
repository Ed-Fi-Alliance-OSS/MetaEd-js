// @flow
import R from 'ramda';
import { NoTopLevelEntity } from 'metaed-core';
import type { TopLevelEntity, DomainEntity } from 'metaed-core';
import type { Table, Column, ForeignKey } from 'metaed-plugin-edfi-ods';
import { buildApiProperty } from './BuildApiProperty';
import type { EntityDefinition } from '../../model/apiModel/EntityDefinition';
import type { EntityIdentifier } from '../../model/apiModel/EntityIdentifier';
import type { ApiProperty } from '../../model/apiModel/ApiProperty';

type BuildSingleEntityDefinitionOptions = { includeAlternateKeys: boolean, isAbstract: boolean };

function isUpdatable(table: Table): boolean {
  return table.parentEntity !== NoTopLevelEntity && table.parentEntity.allowPrimaryKeyUpdates;
}

// "identifiers" are the primary key columns of the table
export function identifiersFrom(
  table: Table,
  { includeAlternateKeys }: BuildSingleEntityDefinitionOptions,
): Array<EntityIdentifier> {
  const result: Array<EntityIdentifier> = [];
  result.push({
    identifierName: `${table.name}_PK`,
    identifyingPropertyNames: table.primaryKeys.map((column: Column) => column.name),
    isPrimary: true,
    isUpdatable: isUpdatable(table),
  });

  if (includeAlternateKeys) {
    result.push({
      identifierName: `${table.name}_AK`,
      identifyingPropertyNames: table.alternateKeys.map((column: Column) => column.name),
      isPrimary: false,
      isUpdatable: false,
    });
  }

  table.uniqueIndexes.forEach((column: Column) => {
    result.push({
      identifierName: `${table.name}_UX_${column.name}`,
      identifyingPropertyNames: [column.name],
      isPrimary: false,
      isUpdatable: false,
    });
  });

  if (table.includeLastModifiedDateAndIdColumn) {
    result.push({
      identifierName: `UX_${table.name}_Id`,
      identifyingPropertyNames: ['Id'],
      isPrimary: false,
      isUpdatable: isUpdatable(table),
    });
  }

  return R.sortBy(R.compose(R.toLower, R.prop('identifierName')), result);
}

// locally defined "properties" are the columns on a table minus the columns there to provide a FK reference
function locallyDefinedPropertiesFrom(table: Table): Array<ApiProperty> {
  const foreignKeyColumnNamesOnTable: Array<string> = R.chain(
    (foreignKey: ForeignKey) => foreignKey.parentTableColumnNames,
    table.foreignKeys,
  );

  const result: Array<ApiProperty> = table.columns
    .filter((column: Column) => !foreignKeyColumnNamesOnTable.includes(column.name))
    .map((column: Column) => buildApiProperty(column));

  if (table.includeCreateDateColumn) {
    result.push({
      propertyName: 'CreateDate',
      propertyType: {
        dbType: 'DateTime',
        maxLength: 0,
        precision: 0,
        scale: 0,
        isNullable: false,
      },
      description: '',
      isIdentifying: false,
      isServerAssigned: false,
    });
  }

  if (table.includeLastModifiedDateAndIdColumn) {
    result.push({
      propertyName: 'Id',
      propertyType: {
        dbType: 'Guid',
        maxLength: 0,
        precision: 0,
        scale: 0,
        isNullable: false,
      },
      description: '',
      isIdentifying: false,
      isServerAssigned: false,
    });

    result.push({
      propertyName: 'LastModifiedDate',
      propertyType: {
        dbType: 'DateTime',
        maxLength: 0,
        precision: 0,
        scale: 0,
        isNullable: false,
      },
      description: '',
      isIdentifying: false,
      isServerAssigned: false,
    });
  }

  return R.sortBy(R.compose(R.toLower, R.prop('propertyName')), result);
}

export function buildSingleEntityDefinitionFrom(
  table: Table,
  options: BuildSingleEntityDefinitionOptions,
): EntityDefinition {
  return {
    schema: table.schema,
    name: table.name,
    locallyDefinedProperties: locallyDefinedPropertiesFrom(table),
    identifiers: identifiersFrom(table, options),
    isAbstract: options.isAbstract,
    description: table.description,
  };
}

// Entity definitions are the ODS table definitions for a namespace, including columns and primary keys
export function buildEntityDefinitions(
  entities: Array<TopLevelEntity>,
  additionalEntityDefinitions: Array<EntityDefinition>,
): Array<EntityDefinition> {
  const result: Array<EntityDefinition> = [];
  entities.forEach((entity: TopLevelEntity) => {
    const odsTablesForEntity: Array<Table> = entity.data.edfiOds.ods_Tables;
    odsTablesForEntity.forEach((table: Table) => {
      result.push(
        buildSingleEntityDefinitionFrom(table, {
          // this is true only for the root table of an Abstract Entity
          isAbstract:
            entity.data.edfiOds.ods_EntityTable.name === table.name &&
            entity.type === 'domainEntity' &&
            ((entity: any): DomainEntity).isAbstract,
          includeAlternateKeys: false,
        }),
      );
    });
  });

  result.push(...additionalEntityDefinitions);
  return R.sortBy(R.compose(R.toLower, R.prop('name')), result);
}
