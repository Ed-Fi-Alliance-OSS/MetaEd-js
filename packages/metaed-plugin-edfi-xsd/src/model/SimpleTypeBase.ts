// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, DecimalType, IntegerType, StringType } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { SimpleType } from './schema/SimpleType';
import { NoSimpleType } from './schema/SimpleType';

export interface SimpleTypeBaseEdfiXsd {
  xsdSimpleType: SimpleType;
}

export type SimpleTypeBase = DecimalType | IntegerType | StringType;

const enhancerName = 'SimpleTypeBaseSetupEnhancer';

export function addSimpleTypeBaseEdfiXsdTo(simpleTypeBase: SimpleTypeBase) {
  if (simpleTypeBase.data.edfiXsd == null) simpleTypeBase.data.edfiXsd = {};

  Object.assign(simpleTypeBase.data.edfiXsd, {
    xsdSimpleType: NoSimpleType,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'decimalType', 'integerType', 'stringType') as SimpleTypeBase[]).forEach(
    (entity: SimpleTypeBase) => {
      addSimpleTypeBaseEdfiXsdTo(entity);
    },
  );

  return {
    enhancerName,
    success: true,
  };
}
