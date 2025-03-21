// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { EnumerationBaseEdfiXsd } from '../model/EnumerationBase';

const enhancerName = 'EnumerationBasePropertiesEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'enumeration', 'mapTypeEnumeration', 'schoolYearEnumeration').forEach((enumerationBase) => {
    const enumerationName = enumerationBase.metaEdName.endsWith('Type')
      ? enumerationBase.metaEdName
      : `${enumerationBase.metaEdName}Type`;

    const enumerationBaseXsdData = enumerationBase.data.edfiXsd as EnumerationBaseEdfiXsd;
    enumerationBaseXsdData.xsdEnumerationName = enumerationName;
    enumerationBaseXsdData.xsdEnumerationNameWithExtension = enumerationBase.namespace.projectExtension
      ? `${enumerationBase.namespace.projectExtension}-${enumerationBaseXsdData.xsdEnumerationName}`
      : enumerationBaseXsdData.xsdEnumerationName;
  });

  return {
    enhancerName,
    success: true,
  };
}
