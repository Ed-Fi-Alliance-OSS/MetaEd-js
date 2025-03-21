// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Namespace, PluginEnvironment, SemVer } from '@edfi/metaed-core';
import { versionSatisfies } from '@edfi/metaed-core';
import { Column, ColumnPair, ForeignKey, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { ApiProperty } from '../../model/apiModel/ApiProperty';
import { AssociationDefinition } from '../../model/apiModel/AssociationDefinition';
import { PhysicalNames } from '../../model/apiModel/PhysicalNames';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { buildApiProperty } from './BuildApiProperty';
import { allTablesInNamespacesBySchema, foreignKeyFor } from './EnhancerHelper';

const enhancerName = 'AssociationDefinitionSecondaryEntityPropertyEnhancer';
const targetVersions: SemVer = '>=3.3.0';

function columnNamesFor(column: Column): { columnNames: PhysicalNames } {
  return {
    columnNames: {
      sqlServer: column.data.edfiOdsSqlServer.columnName,
      postgreSql: column.data.edfiOdsPostgresql.columnName,
    },
  };
}

// Override the typical isServerAssigned - it's true iff it's from a 1-1 or 1-1 inheritance relation and the matching
// column on the other side of the FK is server assigned.
function buildApiPropertyWithServerAssignedOverride(
  column: Column,
  foreignKey: ForeignKey,
  schemasTables: Map<string, Map<string, Table>>,
  { isIdentifying, cardinality }: AssociationDefinition,
  targetTechnologyVersion: string,
): ApiProperty {
  const result: ApiProperty = {
    ...buildApiProperty(column, targetTechnologyVersion),
    isIdentifying,
    ...columnNamesFor(column),
  };
  if (cardinality === 'OneToOne' || cardinality === 'OneToOneInheritance' || cardinality === 'OneToOneExtension') {
    const foreignSchemaTableMap: Map<string, Table> | undefined = schemasTables.get(foreignKey.foreignTableSchema);
    if (foreignSchemaTableMap == null)
      throw new Error(`BuildAssociationDefinitions: could not find table schema '${foreignKey.foreignTableSchema}'.`);

    const foreignTable: Table | undefined = foreignSchemaTableMap.get(foreignKey.foreignTableId);
    if (foreignTable == null)
      throw new Error(`BuildAssociationDefinitions: could not find table '${foreignKey.foreignTableId}'.`);

    const columnPair: ColumnPair = foreignKey.columnPairs.filter(
      (cnp: ColumnPair) => cnp.parentTableColumnId === column.columnId,
    )[0];
    const otherColumn: Column = foreignTable.columns.filter(
      (c: Column) => c.columnId === columnPair.foreignTableColumnId,
    )[0];

    return { ...result, isServerAssigned: otherColumn.isIdentityDatabaseType };
  }

  return result;
}

// "secondary" entity is actually the parent table, "properties" are columns
function secondaryEntityPropertiesFrom(
  foreignKey: ForeignKey,
  schemasTables: Map<string, Map<string, Table>>,
  associationDefinition: AssociationDefinition,
  targetTechnologyVersion: string,
): ApiProperty[] {
  const parentSchemaTableMap: Map<string, Table> | undefined = schemasTables.get(foreignKey.parentTable.schema);
  if (parentSchemaTableMap == null)
    throw new Error(`BuildAssociationDefinitions: could not find table schema '${foreignKey.parentTable.schema}'.`);

  const parentTable: Table | undefined = parentSchemaTableMap.get(foreignKey.parentTable.tableId);
  if (parentTable == null)
    throw new Error(`BuildAssociationDefinitions: could not find table '${foreignKey.parentTable.tableId}'.`);

  // maintain foreign key column order
  return foreignKey.data.edfiOdsSqlServer.parentTableColumnNames
    .map((columnName: string) => parentTable.columns.filter((c) => c.data.edfiOdsSqlServer.columnName === columnName))
    .map((columnArray: Column[]) => columnArray[0])
    .map((column: Column) =>
      buildApiPropertyWithServerAssignedOverride(
        column,
        foreignKey,
        schemasTables,
        associationDefinition,
        targetTechnologyVersion,
      ),
    );
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  if (!versionSatisfies(targetTechnologyVersion, targetVersions)) return { enhancerName, success: true };

  metaEd.namespace.forEach((namespace: Namespace) => {
    const { associationDefinitions } = (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).domainModelDefinition;
    const schemasTables: Map<string, Map<string, Table>> = allTablesInNamespacesBySchema(metaEd);

    associationDefinitions.forEach((associationDefinition: AssociationDefinition) => {
      const foreignKey = foreignKeyFor(metaEd, namespace, associationDefinition.fullName.name);
      if (foreignKey == null) return;

      associationDefinition.secondaryEntityProperties.push(
        ...secondaryEntityPropertiesFrom(foreignKey, schemasTables, associationDefinition, targetTechnologyVersion),
      );
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
