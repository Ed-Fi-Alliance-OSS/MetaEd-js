// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Namespace, TopLevelEntity } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../../model/EntityApiSchemaData';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // Hardcoded find of data standard EducationOrganization
  const edfiEducationOrganization: TopLevelEntity | undefined = metaEd.namespace
    .get('EdFi')
    ?.entity.domainEntity.get('EducationOrganization');
  if (edfiEducationOrganization == null) {
    throw new Error(
      'EducationOrganizationHierarchyEnhancer: Fatal Error: EducationOrganization not found in EdFi Data Standard project',
    );
  }

  const allEducationOrganizations: TopLevelEntity[] = [...edfiEducationOrganization.subclassedBy, edfiEducationOrganization];

  metaEd.namespace.forEach((namespace: Namespace) => {
    namespace.data.educationOrganizationTypes = allEducationOrganizations.map((edOrg) => edOrg.metaEdName);

    namespace.data.educationOrganizationHierarchy = allEducationOrganizations.reduce((acc, edOrgType) => {
      const { allJsonPathsMapping } = edOrgType.data.edfiApiSchema as EntityApiSchemaData;
      acc[edOrgType.metaEdName] = edOrgType.properties
        .filter((p) => p.type === 'domainEntity' && p.parentEntity.baseEntity === edfiEducationOrganization)
        .reduce((pAcc, p) => {
          pAcc[p.metaEdName] = allJsonPathsMapping[p.fullPropertyName].jsonPathPropertyPairs[0].jsonPath;
          return pAcc;
        }, {});
      return acc;
    }, {});
  });
  return {
    enhancerName: 'EducationOrganizationHierarchyEnhancer',
    success: true,
  };
}
