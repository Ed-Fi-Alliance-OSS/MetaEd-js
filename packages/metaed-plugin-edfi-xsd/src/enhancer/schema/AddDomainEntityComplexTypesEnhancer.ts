// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, DomainEntity } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import {
  typeGroupDomainEntity,
  baseTypeTopLevelEntity,
  createDefaultComplexType,
  createIdentityType,
  createReferenceType,
} from './AddComplexTypesBaseEnhancer';

const enhancerName = 'AddDomainEntityComplexTypesEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'domainEntity') as DomainEntity[]).forEach((domainEntity: DomainEntity) => {
    domainEntity.data.edfiXsd.xsdComplexTypes = createDefaultComplexType(
      domainEntity,
      typeGroupDomainEntity,
      baseTypeTopLevelEntity,
      domainEntity.isAbstract,
    );
    domainEntity.data.edfiXsd.xsdIdentityType = createIdentityType(domainEntity);
    domainEntity.data.edfiXsd.xsdReferenceType = createReferenceType(domainEntity);
  });

  return {
    enhancerName,
    success: true,
  };
}
