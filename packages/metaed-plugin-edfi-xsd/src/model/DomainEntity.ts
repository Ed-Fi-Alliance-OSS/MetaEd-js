// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, DomainEntity, EntityProperty } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';

export interface DomainEntityEdfiXsd {
  xsdProperties: () => EntityProperty[];
}

const enhancerName = 'DomainEntitySetupEnhancer';

// note this is an override of xsdProperties in TopLevelEntity
function xsdProperties(domainEntity: DomainEntity): () => EntityProperty[] {
  return () =>
    domainEntity.isAbstract ? domainEntity.properties.filter((p) => !p.isPartOfIdentity) : domainEntity.properties;
}

export function addDomainEntityEdfiXsdTo(domainEntity: DomainEntity) {
  if (domainEntity.data.edfiXsd == null) domainEntity.data.edfiXsd = {};

  Object.assign(domainEntity.data.edfiXsd, {
    xsdProperties: xsdProperties(domainEntity),
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'domainEntity') as DomainEntity[]).forEach((domainEntity: DomainEntity) => {
    addDomainEntityEdfiXsdTo(domainEntity);
  });

  return {
    enhancerName,
    success: true,
  };
}
