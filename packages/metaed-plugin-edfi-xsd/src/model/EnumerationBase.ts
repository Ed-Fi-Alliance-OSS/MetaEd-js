// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  EnhancerResult,
  Enumeration,
  MapTypeEnumeration,
  SchoolYearEnumeration,
  getAllEntitiesOfType,
} from '@edfi/metaed-core';
import { EnumerationSimpleType, NoEnumerationSimpleType } from './schema/EnumerationSimpleType';

export interface EnumerationBaseEdfiXsd {
  xsdEnumerationName: string;
  xsdEnumerationNameWithExtension: string;
  xsdEnumerationSimpleType: EnumerationSimpleType;
}

export type EnumerationBase = Enumeration | MapTypeEnumeration | SchoolYearEnumeration;

const enhancerName = 'EnumerationBaseSetupEnhancer';

export function addEnumerationEdfiXsdTo(enumeration: EnumerationBase) {
  if (enumeration.data.edfiXsd == null) enumeration.data.edfiXsd = {};

  Object.assign(enumeration.data.edfiXsd, {
    xsdEnumerationName: '',
    xsdEnumerationNameWithExtension: '',
    xsdEnumerationSimpleType: NoEnumerationSimpleType,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'enumeration') as Enumeration[]).forEach((enumeration: Enumeration) => {
    addEnumerationEdfiXsdTo(enumeration);
  });

  (getAllEntitiesOfType(metaEd, 'mapTypeEnumeration') as MapTypeEnumeration[]).forEach(
    (mapTypeEnumeration: MapTypeEnumeration) => {
      addEnumerationEdfiXsdTo(mapTypeEnumeration);
    },
  );

  (getAllEntitiesOfType(metaEd, 'schoolYearEnumeration') as SchoolYearEnumeration[]).forEach(
    (schoolYearEnumeration: SchoolYearEnumeration) => {
      addEnumerationEdfiXsdTo(schoolYearEnumeration);
    },
  );

  return {
    enhancerName,
    success: true,
  };
}
