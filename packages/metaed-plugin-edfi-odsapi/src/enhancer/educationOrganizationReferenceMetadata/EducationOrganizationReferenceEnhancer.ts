// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  DomainEntity,
  DomainEntitySubclass,
  EnhancerResult,
  EntityProperty,
  MetaEdEnvironment,
  Namespace,
} from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { newEducationOrganizationReference } from '../../model/educationOrganizationReferenceMetadata/EducationOrganizationReference';
import { EducationOrganizationReference } from '../../model/educationOrganizationReferenceMetadata/EducationOrganizationReference';

const enhancerName = 'EducationOrganizationReferenceEnhancer';
const educationOrganizationEntityName = 'EducationOrganization';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // If no Education Organization domain entity or if for some reason it
  // has more than one identity property, generating this metadata doesn't make any sense
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };

  const educationOrganizationAbstractEntity: DomainEntity | undefined =
    coreNamespace.entity.domainEntity.get(educationOrganizationEntityName);
  if (educationOrganizationAbstractEntity == null || educationOrganizationAbstractEntity.identityProperties.length !== 1)
    return { enhancerName, success: true };

  metaEd.namespace.forEach((namespace: Namespace) => {
    (getAllEntitiesOfType(metaEd, 'domainEntitySubclass') as DomainEntitySubclass[]).forEach(
      (subclass: DomainEntitySubclass) => {
        if (
          subclass.namespace.namespaceName !== namespace.namespaceName ||
          subclass.baseEntityName !== educationOrganizationEntityName
        )
          return;

        // Should only be one identity rename if any
        const identityProperty: EntityProperty =
          subclass.identityProperties.find((property: EntityProperty) => property.isIdentityRename) ||
          educationOrganizationAbstractEntity.identityProperties[0];

        const educationOrganizationReference: EducationOrganizationReference = {
          ...newEducationOrganizationReference(),
          name: subclass.metaEdName,
          identityPropertyName: identityProperty.data.edfiXsd.xsdName,
        };

        namespace.data.edfiOdsApi.apiEducationOrganizationReferences.push(educationOrganizationReference);
      },
    );
  });

  return {
    enhancerName,
    success: true,
  };
}
