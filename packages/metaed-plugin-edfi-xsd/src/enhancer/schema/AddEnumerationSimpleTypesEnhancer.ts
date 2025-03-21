// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { EnumerationBase, EnumerationBaseEdfiXsd } from '../../model/EnumerationBase';
import { newEnumerationToken } from '../../model/schema/EnumerationToken';
import { newEnumerationSimpleType } from '../../model/schema/EnumerationSimpleType';
import { newAnnotation } from '../../model/schema/Annotation';
import { typeGroupEnumeration } from './AddComplexTypesBaseEnhancer';

const enhancerName = 'AddEnumerationSimpleTypesEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'enumeration', 'mapTypeEnumeration', 'schoolYearEnumeration').forEach((enumeration) => {
    const enumerationBase = enumeration as EnumerationBase;
    const enumerationBaseEdfiXsd = enumerationBase.data.edfiXsd as EnumerationBaseEdfiXsd;
    enumerationBaseEdfiXsd.xsdEnumerationSimpleType = {
      ...newEnumerationSimpleType(),
      name: enumerationBaseEdfiXsd.xsdEnumerationNameWithExtension,
      annotation: { ...newAnnotation(), documentation: enumerationBase.documentation, typeGroup: typeGroupEnumeration },
      baseType: 'xs:token',
      enumerationTokens: enumerationBase.enumerationItems.map((item) => ({
        ...newEnumerationToken(),
        annotation: { ...newAnnotation(), documentation: item.documentation },
        value: item.shortDescription,
      })),
    };
  });

  return {
    enhancerName,
    success: true,
  };
}
