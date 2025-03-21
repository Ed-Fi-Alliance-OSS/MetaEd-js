// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Annotation, newAnnotation } from '../../src/model/schema/Annotation';
import { Attribute, newAttribute } from '../../src/model/schema/Attribute';
import { IntegerSimpleType, newIntegerSimpleType } from '../../src/model/schema/IntegerSimpleType';
import { DecimalSimpleType, newDecimalSimpleType } from '../../src/model/schema/DecimalSimpleType';
import { StringSimpleType, newStringSimpleType } from '../../src/model/schema/StringSimpleType';
import { EnumerationSimpleType, newEnumerationSimpleType } from '../../src/model/schema/EnumerationSimpleType';
import { EnumerationToken, newEnumerationToken } from '../../src/model/schema/EnumerationToken';
import { Element, newElement } from '../../src/model/schema/Element';
import { ElementGroup, newElementGroup } from '../../src/model/schema/ElementGroup';
import { ComplexType, newComplexType } from '../../src/model/schema/ComplexType';
import { SchemaSection, newSchemaSection } from '../../src/model/schema/SchemaSection';
import { SchemaContainer, newSchemaContainer } from '../../src/model/schema/SchemaContainer';

export const xs = 'http://www.w3.org/2001/XMLSchema';
export const ann = 'http://ed-fi.org/annotation';

export function createAnnotation(documentation: string, typeGroup: string = '', descriptorName: string = ''): Annotation {
  return { ...newAnnotation(), documentation, typeGroup, descriptorName };
}

export function createAttribute(name: string, type: string, documentation: string, isRequired: boolean = false): Attribute {
  return { ...newAttribute(), name, type, annotation: createAnnotation(documentation), isRequired };
}

export function createIntegerSimpleType(
  name: string,
  baseType: string,
  documentation: string,
  minValue: string = '',
  maxValue: string = '',
): IntegerSimpleType {
  return { ...newIntegerSimpleType(), name, baseType, annotation: createAnnotation(documentation), maxValue, minValue };
}

export function createDecimalSimpleType(
  name: string,
  baseType: string,
  documentation: string,
  minValue: string = '',
  maxValue: string = '',
  totalDigits: string = '',
  decimalPlaces: string = '',
): DecimalSimpleType {
  return {
    ...newDecimalSimpleType(),
    name,
    baseType,
    annotation: createAnnotation(documentation),
    maxValue,
    minValue,
    totalDigits,
    decimalPlaces,
  };
}

export function createStringSimpleType(
  name: string,
  baseType: string,
  documentation: string,
  minLength: string = '',
  maxLength: string = '',
): StringSimpleType {
  return { ...newStringSimpleType(), name, baseType, annotation: createAnnotation(documentation), maxLength, minLength };
}

export function createEnumerationSimpleType(name: string, baseType: string, documentation: string): EnumerationSimpleType {
  return { ...newEnumerationSimpleType(), name, baseType, annotation: createAnnotation(documentation) };
}

export function createEnumerationToken(value: string, documentation: string): EnumerationToken {
  return { ...newEnumerationToken(), value, annotation: createAnnotation(documentation) };
}

export function createElementComplexTypeItem(
  name: string,
  documentation: string,
  type: string,
  minOccurs: string = '',
  maxOccurs: string = '',
  maxOccursIsUnbounded: boolean = false,
): Element {
  return {
    ...newElement(),
    name,
    type,
    annotation: createAnnotation(documentation),
    minOccurs,
    maxOccurs,
    maxOccursIsUnbounded,
  };
}

export function createElementGroupComplexTypeItem(
  isChoice: boolean = false,
  minOccurs: string = '',
  maxOccurs: string = '',
  maxOccursIsUnbounded: boolean = false,
): ElementGroup {
  return { ...newElementGroup(), isChoice, minOccurs, maxOccurs, maxOccursIsUnbounded };
}

export function createComplexType(
  name: string,
  documentation: string,
  baseType: string = '',
  isAbstract: boolean = false,
): ComplexType {
  return { ...newComplexType(), name, baseType, annotation: createAnnotation(documentation), isAbstract };
}

export function createSchemaSection(documentation: string): SchemaSection {
  return { ...newSchemaSection(), sectionAnnotation: createAnnotation(documentation) };
}

export function createSchema(schemaVersion: string, documentation: string, isExtension: boolean = false): SchemaContainer {
  return { ...newSchemaContainer(), schemaVersion, schemaAnnotation: createAnnotation(documentation), isExtension };
}
