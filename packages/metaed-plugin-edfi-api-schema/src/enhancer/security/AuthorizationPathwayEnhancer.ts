// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, TopLevelEntity } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import { AuthorizationPathway } from '../../model/api-schema/AuthorizationPathway';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const edfiStudentSchoolAssociation: TopLevelEntity | undefined = metaEd.namespace
    .get('EdFi')
    ?.entity.association.get('StudentSchoolAssociation');
  // Flag StudentSchoolAssociation as defining the StudentSchoolAssociationAuthorization pathway
  // and being in the ContactStudentSchoolAuthorization pathway
  if (edfiStudentSchoolAssociation) {
    const { authorizationPathways } = edfiStudentSchoolAssociation.data.edfiApiSchema as EntityApiSchemaData;
    authorizationPathways.push('StudentSchoolAssociationAuthorization' as AuthorizationPathway);
    authorizationPathways.push('ContactStudentSchoolAuthorization' as AuthorizationPathway);
  }

  const edfiStudentContactAssociation: TopLevelEntity | undefined = metaEd.namespace
    .get('EdFi')
    ?.entity.association.get('StudentContactAssociation');
  // Flag StudentContactAssociation as defining the ContactStudentSchoolAuthorization pathway.
  if (edfiStudentContactAssociation) {
    const { authorizationPathways } = edfiStudentContactAssociation.data.edfiApiSchema as EntityApiSchemaData;
    authorizationPathways.push('ContactStudentSchoolAuthorization' as AuthorizationPathway);
  }

  return {
    enhancerName: 'AuthorizationPathwayEnhancer',
    success: true,
  };
}
