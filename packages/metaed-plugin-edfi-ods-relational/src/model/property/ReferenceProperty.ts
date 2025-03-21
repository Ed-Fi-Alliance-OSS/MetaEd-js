// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, EntityProperty, MetaEdEnvironment } from '@edfi/metaed-core';
import { getPropertiesOfType } from '@edfi/metaed-core';

export interface ReferencePropertyEdfiOds {
  odsDeleteCascadePrimaryKey: boolean;
  odsCausesCyclicUpdateCascade: boolean;
  odsIsReferenceToSuperclass: boolean;
  odsIsReferenceToExtensionParent: boolean;
}

// Enhancer for object setup
const enhancerName = 'ReferencePropertySetupEnhancer';

export function addReferencePropertyEdfiOdsTo(property: EntityProperty) {
  if (property.data.edfiOdsRelational == null) property.data.edfiOdsRelational = {};

  Object.assign(property.data.edfiOdsRelational, {
    odsDeleteCascadePrimaryKey: false,
    odsCausesCyclicUpdateCascade: false,
    odsIsReferenceToSuperclass: false,
    odsIsReferenceToExtensionParent: false,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getPropertiesOfType(metaEd.propertyIndex, 'association', 'domainEntity').forEach((property: EntityProperty) => {
    addReferencePropertyEdfiOdsTo(property);
  });

  return {
    enhancerName,
    success: true,
  };
}

export const isOdsReferenceProperty = (property: EntityProperty): boolean =>
  ['association', 'domainEntity'].includes(property.type);

export const isOdsMergeableProperty = (property: EntityProperty): boolean =>
  ['association', 'domainEntity', 'sharedDecimal', 'sharedInteger', 'sharedShort', 'sharedString'].includes(property.type);
