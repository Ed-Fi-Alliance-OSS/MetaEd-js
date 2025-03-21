// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Namespace, PluginEnvironment, SemVer } from '@edfi/metaed-core';
import { versionSatisfies } from '@edfi/metaed-core';
import { Column, ForeignKey, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { ApiProperty } from '../../model/apiModel/ApiProperty';
import { AssociationDefinition } from '../../model/apiModel/AssociationDefinition';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { buildApiProperty } from './BuildApiProperty';
import { allTablesInNamespacesBySchema, foreignKeyFor } from './EnhancerHelper';

const enhancerName = 'AssociationDefinitionPrimaryEntityPropertyEnhancerV3';
const targetVersions: SemVer = '<3.3.0';

// "primary" entity is actually the foreign table, "properties" are columns
function primaryEntityPropertiesFrom(
  foreignKey: ForeignKey,
  schemasTables: Map<string, Map<string, Table>>,
  { isIdentifying }: AssociationDefinition,
): ApiProperty[] {
  const foreignSchemaTableMap: Map<string, Table> | undefined = schemasTables.get(foreignKey.foreignTableSchema);
  if (foreignSchemaTableMap == null)
    throw new Error(`BuildAssociationDefinitions: could not find table schema '${foreignKey.foreignTableSchema}'.`);

  const foreignTable: Table | undefined = foreignSchemaTableMap.get(foreignKey.foreignTableId);
  if (foreignTable == null)
    throw new Error(`BuildAssociationDefinitions: could not find table '${foreignKey.foreignTableId}'.`);

  // maintain foreign key column order
  return foreignKey.data.edfiOdsSqlServer.foreignTableColumnNames
    .map((columnName: string) => foreignTable.columns.filter((c) => c.data.edfiOdsSqlServer.columnName === columnName))
    .map((columnArray: Column[]) => columnArray[0])
    .map((column: Column) => ({ ...buildApiProperty(column, '3.2.0'), isIdentifying }));
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

      associationDefinition.primaryEntityProperties.push(
        ...primaryEntityPropertiesFrom(foreignKey, schemasTables, associationDefinition),
      );
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
