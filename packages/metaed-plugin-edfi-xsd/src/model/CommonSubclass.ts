// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, CommonSubclass, EntityProperty } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';

export interface CommonSubclassEdfiXsd {
  xsdProperties: () => EntityProperty[];
}

const enhancerName = 'CommonSubclassSetupEnhancer';

// note this is an override of xsdProperties in TopLevelEntity
function xsdProperties(commonSubclass: CommonSubclass): () => EntityProperty[] {
  return () => {
    if (commonSubclass.baseEntity == null) return commonSubclass.properties;
    return [...commonSubclass.properties, ...commonSubclass.baseEntity.properties];
  };
}

export function addCommonSubclassEdfiXsdTo(commonSubclass: CommonSubclass) {
  if (commonSubclass.data.edfiXsd == null) commonSubclass.data.edfiXsd = {};

  Object.assign(commonSubclass.data.edfiXsd, {
    xsdProperties: xsdProperties(commonSubclass),
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'commonSubclass') as CommonSubclass[]).forEach((commonSubclass: CommonSubclass) => {
    addCommonSubclassEdfiXsdTo(commonSubclass);
  });

  return {
    enhancerName,
    success: true,
  };
}
