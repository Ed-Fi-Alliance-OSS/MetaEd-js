// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, StringType } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { SimpleTypeBaseEdfiXsd } from '../../model/SimpleTypeBase';
import { ModelBaseEdfiXsd } from '../../model/ModelBase';
import { NoSimpleType } from '../../model/schema/SimpleType';
import { SimpleType } from '../../model/schema/SimpleType';
import { newStringSimpleType } from '../../model/schema/StringSimpleType';
import { newAnnotation } from '../../model/schema/Annotation';
import { typeGroupSimple } from './AddComplexTypesBaseEnhancer';

const enhancerName = 'AddStringSimpleTypesEnhancer';

function createSchemaSimpleType(stringType: StringType): SimpleType {
  if (stringType.generatedSimpleType && stringType.minLength === '' && stringType.maxLength === '') {
    return NoSimpleType;
  }

  return {
    ...newStringSimpleType(),
    name: (stringType.data.edfiXsd as ModelBaseEdfiXsd).xsdMetaEdNameWithExtension(),
    annotation: { ...newAnnotation(), documentation: stringType.documentation, typeGroup: typeGroupSimple },
    baseType: 'xs:string',
    minLength: stringType.minLength,
    maxLength: stringType.maxLength,
  } as SimpleType;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'stringType') as StringType[]).forEach((stringType: StringType) => {
    (stringType.data.edfiXsd as SimpleTypeBaseEdfiXsd).xsdSimpleType = createSchemaSimpleType(stringType);
  });

  return {
    enhancerName,
    success: true,
  };
}
