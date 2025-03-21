// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, EntityProperty, TopLevelEntity, CommonProperty } from '@edfi/metaed-core';
import { getAllTopLevelEntitiesForNamespaces } from '@edfi/metaed-core';
import { NoComplexType } from './schema/ComplexType';
import { ComplexType } from './schema/ComplexType';

export interface TopLevelEntityEdfiXsd {
  xsdComplexTypes: ComplexType[];
  xsdReferenceType: ComplexType;
  xsdIdentityType: ComplexType;
  xsdLookupType: ComplexType;
  xsdIdentityProperties: EntityProperty[];
  xsdHasQueryableField: boolean;
  xsdProperties: () => EntityProperty[];
  xsdHasExtensionOverrideProperties: () => boolean;
}

const enhancerName = 'TopLevelEntitySetupEnhancer';

function xsdProperties(topLevelEntity: TopLevelEntity): () => EntityProperty[] {
  return (): EntityProperty[] => topLevelEntity.properties;
}

function xsdHasExtensionOverrideProperties(topLevelEntity: TopLevelEntity): () => boolean {
  return (): boolean =>
    topLevelEntity.properties.filter((p) => p.type === 'common').some((p) => (p as CommonProperty).isExtensionOverride);
}

export function addTopLevelEntityEdfiXsdTo(topLevelEntity: TopLevelEntity) {
  if (topLevelEntity.data.edfiXsd == null) topLevelEntity.data.edfiXsd = {};

  Object.assign(topLevelEntity.data.edfiXsd, {
    xsdComplexTypes: [],
    xsdReferenceType: NoComplexType,
    xsdIdentityType: NoComplexType,
    xsdLookupType: NoComplexType,
    xsdIdentityProperties: [],
    xsdHasQueryableField: false,
    xsdProperties: xsdProperties(topLevelEntity),
    xsdHasExtensionOverrideProperties: xsdHasExtensionOverrideProperties(topLevelEntity),
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllTopLevelEntitiesForNamespaces(Array.from(metaEd.namespace.values())).forEach((entity: TopLevelEntity) => {
    addTopLevelEntityEdfiXsdTo(entity);
  });

  return {
    enhancerName,
    success: true,
  };
}
