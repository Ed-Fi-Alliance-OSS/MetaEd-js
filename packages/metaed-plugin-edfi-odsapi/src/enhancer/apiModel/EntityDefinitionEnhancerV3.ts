// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Namespace, PluginEnvironment, SemVer } from '@edfi/metaed-core';
import { versionSatisfies } from '@edfi/metaed-core';
import { Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { tableEntities } from '@edfi/metaed-plugin-edfi-ods-relational';
import * as R from 'ramda';
import { EntityDefinition } from '../../model/apiModel/EntityDefinition';
import { newEntityDefinition } from '../../model/apiModel/EntityDefinition';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';

const enhancerName = 'EntityDefinitionEnhancerV3';
const targetVersions: SemVer = '<3.3.0';

const sortByName = R.sortBy(R.pipe(R.prop('name'), R.toLower));

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  if (!versionSatisfies(targetTechnologyVersion, targetVersions)) return { enhancerName, success: true };

  metaEd.namespace.forEach((namespace: Namespace) => {
    const result: EntityDefinition[] = [];

    tableEntities(metaEd, namespace).forEach((table: Table) => {
      result.push({
        ...newEntityDefinition(),
        schema: table.schema,
        name: table.data.edfiOdsSqlServer.tableName,
        description: table.description,
        isDeprecated: table.isDeprecated ? true : undefined,
        deprecationReasons: table.deprecationReasons.length > 0 ? table.deprecationReasons : undefined,
      });
    });

    const { domainModelDefinition } = namespace.data.edfiOdsApi as NamespaceEdfiOdsApi;
    domainModelDefinition.entityDefinitions = sortByName(result);
  });

  return {
    enhancerName,
    success: true,
  };
}
