// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Namespace, PluginEnvironment, SemVer } from '@edfi/metaed-core';
import { versionSatisfies } from '@edfi/metaed-core';
import { ForeignKey, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { tableEntities } from '@edfi/metaed-plugin-edfi-ods-relational';
import * as R from 'ramda';
import { AssociationDefinition } from '../../model/apiModel/AssociationDefinition';
import { newAssociationDefinition } from '../../model/apiModel/AssociationDefinition';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';

const enhancerName = 'AssociationDefinitionEnhancer';
const targetVersions: SemVer = '>=3.3.0 <5.2.0';

const sortByName = R.sortBy(R.pipe(R.path(['fullName', 'name']), R.toLower));

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  if (!versionSatisfies(targetTechnologyVersion, targetVersions)) return { enhancerName, success: true };

  metaEd.namespace.forEach((namespace: Namespace) => {
    const result: AssociationDefinition[] = [];

    tableEntities(metaEd, namespace).forEach((table: Table) => {
      table.foreignKeys.forEach((foreignKey: ForeignKey) => {
        result.push({
          ...newAssociationDefinition(),
          fullName: {
            schema: table.schema,
            name: foreignKey.data.edfiOdsSqlServer.foreignKeyName,
          },
          constraintNames: {
            sqlServer: foreignKey.data.edfiOdsSqlServer.foreignKeyName,
            postgreSql: foreignKey.data.edfiOdsPostgresql.foreignKeyName,
          },
          primaryEntityFullName: {
            schema: foreignKey.foreignTableSchema,
            name: foreignKey.foreignTable.data.edfiOdsSqlServer.tableName,
          },
          secondaryEntityFullName: {
            schema: foreignKey.parentTable.schema,
            name: foreignKey.parentTable.data.edfiOdsSqlServer.tableName,
          },
        });
      });
    });

    const { domainModelDefinition } = namespace.data.edfiOdsApi as NamespaceEdfiOdsApi;
    domainModelDefinition.associationDefinitions = sortByName(result);
  });

  return {
    enhancerName,
    success: true,
  };
}
