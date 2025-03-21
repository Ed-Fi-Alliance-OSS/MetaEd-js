// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newStringSimpleType } from '../../model/schema/StringSimpleType';
import { newDecimalSimpleType } from '../../model/schema/DecimalSimpleType';
import { newAnnotation } from '../../model/schema/Annotation';
import { baseTypeDescriptorReference, typeGroupSimple } from './AddComplexTypesBaseEnhancer';

const codeValueName = 'CodeValue';
const codeValueDocumentation = 'A code or abbreviation for an element.';

export const createCodeValueSimpleType = () => ({
  ...newStringSimpleType(),
  name: codeValueName,
  annotation: { ...newAnnotation(), documentation: codeValueDocumentation, typeGroup: typeGroupSimple },
  baseType: 'xs:string',
  minLength: '1',
  maxLength: '50',
});

export const timeIntervalEdfiId = '110';
const timeIntervalName = 'TimeInterval';
const timeIntervalDocumentation = 'A period of time with fixed, well-defined limits.';

export const createTimeIntervalSimpleType = () => ({
  ...newStringSimpleType(),
  name: timeIntervalName,
  annotation: { ...newAnnotation(), documentation: timeIntervalDocumentation, typeGroup: typeGroupSimple },
  baseType: 'xs:duration',
});

export const percentEdfiId = '80';
const percentName = 'Percent';
const percentDocumentation = 'A proportion in relation to the whole (as measured in parts per one hundred).';

export const createPercentSimpleType = () => ({
  ...newDecimalSimpleType(),
  name: percentName,
  annotation: { ...newAnnotation(), documentation: percentDocumentation, typeGroup: typeGroupSimple },
  baseType: 'xs:decimal',
  minValue: '0',
  maxValue: '1',
  decimalPlaces: '4',
  totalDigits: '5',
});

export const currencyEdfiId = '36';
const currencyName = 'Currency';
const currencyDocumentation = 'U.S. currency in dollars and cents.';

export const createCurrencySimpleType = () => ({
  ...newDecimalSimpleType(),
  name: currencyName,
  annotation: { ...newAnnotation(), documentation: currencyDocumentation, typeGroup: typeGroupSimple },
  baseType: 'xs:decimal',
});

const descriptorReferenceName: string = baseTypeDescriptorReference;
const descriptorReferenceDocumentation = 'Provides references for descriptors represented by the full URI format.';

export const createDescriptorReferenceSimpleType = () => ({
  ...newStringSimpleType(),
  name: descriptorReferenceName,
  annotation: { ...newAnnotation(), documentation: descriptorReferenceDocumentation, typeGroup: typeGroupSimple },
  baseType: 'xs:string',
  minLength: '1',
  maxLength: '255',
});
