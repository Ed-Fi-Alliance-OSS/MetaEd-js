// @flow
import type { MetaEdPlugin } from 'metaed-core';
import { enhancerList } from './enhancer/EnhancerList';
import { generate as generateXsd } from './generator/XsdGenerator';
import { generate as generateSchemaAnnotation } from './generator/SchemaAnnotationGenerator';

// Entities
export type { Annotation } from './model/schema/Annotation';
export type { Attribute } from './model/schema/Attribute';
export type { ComplexType } from './model/schema/ComplexType';
export type { ComplexTypeItem } from './model/schema/ComplexTypeItem';
export type { DecimalSimpleType } from './model/schema/DecimalSimpleType';
export type { Element } from './model/schema/Element';
export type { ElementGroup } from './model/schema/ElementGroup';
export type { EnumerationSimpleType } from './model/schema/EnumerationSimpleType';
export type { EnumerationToken } from './model/schema/EnumerationToken';
export type { IntegerSimpleType } from './model/schema/IntegerSimpleType';
export type { SchemaContainer } from './model/schema/SchemaContainer';
export type { SchemaSection } from './model/schema/SchemaSection';
export type { SimpleType } from './model/schema/SimpleType';
export type { StringSimpleType } from './model/schema/StringSimpleType';
export type { NamespaceInfoEdfiXsd } from './model/NamespaceInfo';
export type { MergedInterchange } from './model/MergedInterchange';
export type { EdFiXsdEntityRepository } from './model/EdFiXsdEntityRepository';

export { newMergedInterchange } from './model/MergedInterchange';
export { addEdFiXsdEntityRepositoryTo } from './model/EdFiXsdEntityRepository';
// Factories
export { newComplexType } from './model/schema/ComplexType';
export { newAnnotation } from './model/schema/Annotation';
export { newDecimalSimpleType } from './model/schema/DecimalSimpleType';
export { newStringSimpleType } from './model/schema/StringSimpleType';
export { createCurrencySimpleType, createPercentSimpleType, createTimeIntervalSimpleType } from './enhancer/schema/BaseSimpleTypeCreator';

export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: enhancerList(),
    generator: [generateXsd, generateSchemaAnnotation],
  };
}
