// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, DecimalType } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { SimpleTypeBaseEdfiXsd } from '../../model/SimpleTypeBase';
import { ModelBaseEdfiXsd } from '../../model/ModelBase';
import { NoSimpleType } from '../../model/schema/SimpleType';
import { SimpleType } from '../../model/schema/SimpleType';
import { newDecimalSimpleType } from '../../model/schema/DecimalSimpleType';
import { newAnnotation } from '../../model/schema/Annotation';
import { typeGroupSimple } from './AddComplexTypesBaseEnhancer';

const enhancerName = 'AddDecimalSimpleTypesEnhancer';

function createSchemaSimpleType(decimalType: DecimalType): SimpleType {
  if (
    decimalType.generatedSimpleType &&
    decimalType.minValue === '' &&
    decimalType.maxValue === '' &&
    decimalType.decimalPlaces === '' &&
    decimalType.totalDigits === ''
  ) {
    return NoSimpleType;
  }

  return {
    ...newDecimalSimpleType(),
    name: (decimalType.data.edfiXsd as ModelBaseEdfiXsd).xsdMetaEdNameWithExtension(),
    annotation: { ...newAnnotation(), documentation: decimalType.documentation, typeGroup: typeGroupSimple },
    baseType: 'xs:decimal',
    minValue: decimalType.minValue,
    maxValue: decimalType.maxValue,
    decimalPlaces: decimalType.decimalPlaces,
    totalDigits: decimalType.totalDigits,
  } as SimpleType;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'decimalType') as DecimalType[]).forEach((decimalType: DecimalType) => {
    (decimalType.data.edfiXsd as SimpleTypeBaseEdfiXsd).xsdSimpleType = createSchemaSimpleType(decimalType);
  });

  return {
    enhancerName,
    success: true,
  };
}
