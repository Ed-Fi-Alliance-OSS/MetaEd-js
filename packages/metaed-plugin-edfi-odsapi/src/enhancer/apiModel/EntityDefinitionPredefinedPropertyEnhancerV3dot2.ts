// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Namespace, PluginEnvironment, SemVer } from '@edfi/metaed-core';
import { versionSatisfies } from '@edfi/metaed-core';
import { Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { ApiProperty } from '../../model/apiModel/ApiProperty';
import { DbType } from '../../model/apiModel/DbType';
import { EntityDefinition } from '../../model/apiModel/EntityDefinition';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { tableFor } from './EnhancerHelper';

const enhancerName = 'EntityDefinitionPredefinedPropertyEnhancerV3';
const targetVersions: SemVer = '<3.3.0';

function predefinedPropertiesFrom(
  targetTechnologyVersion: SemVer,
  { includeCreateDateColumn, includeLastModifiedDateAndIdColumn }: Table,
): ApiProperty[] {
  const result: ApiProperty[] = [];

  const datetime: DbType = versionSatisfies(targetTechnologyVersion, '>=3.1.1') ? 'DateTime2' : 'DateTime';

  if (includeCreateDateColumn) {
    result.push({
      propertyName: 'CreateDate',
      propertyType: {
        dbType: datetime,
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

  if (includeLastModifiedDateAndIdColumn) {
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
        dbType: datetime,
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

  return result;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  if (!versionSatisfies(targetTechnologyVersion, targetVersions)) return { enhancerName, success: true };

  metaEd.namespace.forEach((namespace: Namespace) => {
    const { entityDefinitions } = (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).domainModelDefinition;

    entityDefinitions.forEach((entityDefinition: EntityDefinition) => {
      const table = tableFor(metaEd, namespace, entityDefinition.name);
      if (table == null) return;

      entityDefinition.locallyDefinedProperties.push(...predefinedPropertiesFrom(targetTechnologyVersion, table));
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
