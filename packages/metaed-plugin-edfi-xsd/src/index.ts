// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { MetaEdPlugin } from '@edfi/metaed-core';
import { enhancerList } from './enhancer/EnhancerList';
import { generate as generateXsd } from './generator/XsdGenerator';
import { generate as generateSchemaAnnotation } from './generator/SchemaAnnotationGenerator';
import { generate as generateInterchange } from './generator/InterchangeGenerator';
import { validate as v3LimitedDuplicateNamesInDependencyNamespaces } from './validator/V3LimitedDuplicateNamesInDependencyNamespaces';

// Entities
export { Annotation } from './model/schema/Annotation';
export { Attribute } from './model/schema/Attribute';
export { ComplexType } from './model/schema/ComplexType';
export { ComplexTypeItem } from './model/schema/ComplexTypeItem';
export { DecimalSimpleType } from './model/schema/DecimalSimpleType';
export { EdFiXsdEntityRepository } from './model/EdFiXsdEntityRepository';
export { Element } from './model/schema/Element';
export { ElementGroup } from './model/schema/ElementGroup';
export { EnumerationSimpleType } from './model/schema/EnumerationSimpleType';
export { EnumerationToken } from './model/schema/EnumerationToken';
export { IntegerSimpleType } from './model/schema/IntegerSimpleType';
export { MergedInterchange } from './model/MergedInterchange';
export { NamespaceEdfiXsd } from './model/Namespace';
export { SchemaContainer } from './model/schema/SchemaContainer';
export { SchemaSection } from './model/schema/SchemaSection';
export { SimpleType } from './model/schema/SimpleType';
export { StringSimpleType } from './model/schema/StringSimpleType';

export { addEdFiXsdEntityRepositoryTo } from './model/EdFiXsdEntityRepository';
export { addMergedInterchangeToRepository } from './model/MergedInterchange';
export { newEdFiXsdEntityRepository } from './model/EdFiXsdEntityRepository';
export { newMergedInterchange } from './model/MergedInterchange';

// Factories
export { newAnnotation } from './model/schema/Annotation';
export { newComplexType } from './model/schema/ComplexType';
export { newDecimalSimpleType } from './model/schema/DecimalSimpleType';
export { newElement } from './model/schema/Element';
export { newElementGroup } from './model/schema/ElementGroup';
export { newSchemaContainer } from './model/schema/SchemaContainer';
export { newSchemaSection } from './model/schema/SchemaSection';
export { newSimpleType } from './model/schema/SimpleType';
export { newStringSimpleType } from './model/schema/StringSimpleType';
export {
  createCurrencySimpleType,
  createPercentSimpleType,
  createTimeIntervalSimpleType,
} from './enhancer/schema/BaseSimpleTypeCreator';
export { newEnumerationSimpleType } from './model/schema/EnumerationSimpleType';
export { newEnumerationToken } from './model/schema/EnumerationToken';

// Constants
export {
  baseTypeDescriptor,
  baseTypeDescriptorReference,
  baseTypeReference,
  baseTypeTopLevelEntity,
  descriptorReferenceTypeSuffix,
  identityTypeSuffix,
  lookupTypeSuffix,
  mapTypeSuffix,
  referenceTypeSuffix,
  restrictionSuffix,
  typeGroupAssociation,
  typeGroupBase,
  typeGroupCommon,
  typeGroupDescriptor,
  typeGroupDescriptorExtendedReference,
  typeGroupDomainEntity,
  typeGroupEnumeration,
  typeGroupExtendedReference,
  typeGroupIdentity,
  typeGroupLookup,
  typeGroupSimple,
} from './enhancer/schema/AddComplexTypesBaseEnhancer';

export { NoComplexType } from './model/schema/ComplexType';
export { NoSimpleType } from './model/schema/SimpleType';

// Generator helpers
export { hasDuplicateEntityNameInNamespace } from './generator/XsdGeneratorBase';

// Utilities
export { edfiXsdRepositoryForNamespace } from './enhancer/EnhancerHelper';

export function initialize(): MetaEdPlugin {
  return {
    validator: [v3LimitedDuplicateNamesInDependencyNamespaces],
    enhancer: enhancerList(),
    generator: [generateXsd, generateSchemaAnnotation, generateInterchange],
    shortName: 'edfiXsd',
  };
}
