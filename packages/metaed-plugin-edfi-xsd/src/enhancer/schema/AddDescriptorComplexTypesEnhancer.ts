// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, Descriptor, SemVer } from '@edfi/metaed-core';
import { NoMapTypeEnumeration, versionSatisfies, V3OrGreater, getAllEntitiesOfType } from '@edfi/metaed-core';
import { ComplexType } from '../../model/schema/ComplexType';
import { newComplexType } from '../../model/schema/ComplexType';
import { newAnnotation } from '../../model/schema/Annotation';
import { newElement } from '../../model/schema/Element';
import { createSchemaComplexTypeItems } from './XsdElementFromPropertyCreator';
import { typeGroupDescriptor, baseTypeDescriptor } from './AddComplexTypesBaseEnhancer';
import { ComplexTypeItem } from '../../model/schema/ComplexTypeItem';

const enhancerName = 'AddDescriptorComplexTypesEnhancer';
const targetVersions: SemVer = V3OrGreater;

function createComplexType(descriptor: Descriptor): ComplexType[] {
  const complexType = {
    ...newComplexType(),
    annotation: { ...newAnnotation(), documentation: descriptor.documentation, typeGroup: typeGroupDescriptor },
    baseType: baseTypeDescriptor,
    name: descriptor.data.edfiXsd.xsdDescriptorNameWithExtension,
  };

  complexType.items.push(...createSchemaComplexTypeItems(descriptor.data.edfiXsd.xsdProperties()));
  if (descriptor.mapTypeEnumeration !== NoMapTypeEnumeration) {
    complexType.items.push({
      ...newElement(),
      name: descriptor.mapTypeEnumeration.metaEdName,
      type: descriptor.mapTypeEnumeration.data.edfiXsd.xsdEnumerationNameWithExtension,
      annotation: { ...newAnnotation(), documentation: `The mapping to a known ${descriptor.metaEdName} enumeration type.` },
      minOccurs: descriptor.isMapTypeOptional ? '0' : '',
    } as ComplexTypeItem);
  }
  return [complexType];
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };

  (getAllEntitiesOfType(metaEd, 'descriptor') as Descriptor[]).forEach((descriptor: Descriptor) => {
    descriptor.data.edfiXsd.xsdComplexTypes = createComplexType(descriptor);
  });

  return {
    enhancerName,
    success: true,
  };
}
