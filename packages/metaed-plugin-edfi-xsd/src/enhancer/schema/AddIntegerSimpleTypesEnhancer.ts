// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, IntegerType } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { SimpleTypeBaseEdfiXsd } from '../../model/SimpleTypeBase';
import { ModelBaseEdfiXsd } from '../../model/ModelBase';
import { NoSimpleType } from '../../model/schema/SimpleType';
import { SimpleType } from '../../model/schema/SimpleType';
import { newIntegerSimpleType } from '../../model/schema/IntegerSimpleType';
import { newAnnotation } from '../../model/schema/Annotation';
import { typeGroupSimple } from './AddComplexTypesBaseEnhancer';

const enhancerName = 'AddIntegerSimpleTypesEnhancer';

function determineBaseTypeFor(integerType: IntegerType): string {
  if (integerType.isShort) return 'xs:short';
  if (integerType.hasBigHint) return 'xs:long';
  return 'xs:int';
}

function createSchemaSimpleType(integerType: IntegerType): SimpleType {
  if (integerType.generatedSimpleType && integerType.minValue === '' && integerType.maxValue === '') {
    return NoSimpleType;
  }

  return {
    ...newIntegerSimpleType(),
    name: (integerType.data.edfiXsd as ModelBaseEdfiXsd).xsdMetaEdNameWithExtension(),
    annotation: { ...newAnnotation(), documentation: integerType.documentation, typeGroup: typeGroupSimple },
    baseType: determineBaseTypeFor(integerType),
    minValue: integerType.minValue,
    maxValue: integerType.maxValue,
  } as SimpleType;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'integerType') as IntegerType[]).forEach((integerType: IntegerType) => {
    (integerType.data.edfiXsd as SimpleTypeBaseEdfiXsd).xsdSimpleType = createSchemaSimpleType(integerType);
  });

  return {
    enhancerName,
    success: true,
  };
}
