// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, Descriptor, SemVer } from '@edfi/metaed-core';
import { versionSatisfies, V3OrGreater, getAllEntitiesOfType } from '@edfi/metaed-core';
import { newAnnotation } from '../../model/schema/Annotation';
import { newStringSimpleType } from '../../model/schema/StringSimpleType';
import { StringSimpleType } from '../../model/schema/StringSimpleType';
import { typeGroupDescriptorExtendedReference, baseTypeDescriptorReference } from './AddComplexTypesBaseEnhancer';

const enhancerName = 'AddDescriptorExtendedReferenceTypesEnhancer';
const targetVersions: SemVer = V3OrGreater;

function createExtendedReferenceType(descriptor: Descriptor): StringSimpleType {
  const extendedReferenceType = {
    ...newStringSimpleType(),
    annotation: {
      ...newAnnotation(),
      documentation: descriptor.documentation,
      typeGroup: typeGroupDescriptorExtendedReference,
    },
    baseType: baseTypeDescriptorReference,
    name: `${descriptor.data.edfiXsd.xsdDescriptorNameWithExtension}ReferenceType`,
  };

  return extendedReferenceType;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };

  (getAllEntitiesOfType(metaEd, 'descriptor') as Descriptor[]).forEach((descriptor: Descriptor) => {
    descriptor.data.edfiXsd.xsdDescriptorExtendedReferenceType = createExtendedReferenceType(descriptor);
  });

  return {
    enhancerName,
    success: true,
  };
}
