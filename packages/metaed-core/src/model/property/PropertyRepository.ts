// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { AssociationProperty } from './AssociationProperty';
import { BooleanProperty } from './BooleanProperty';
import { ChoiceProperty } from './ChoiceProperty';
import { CommonProperty } from './CommonProperty';
import { CurrencyProperty } from './CurrencyProperty';
import { DateProperty } from './DateProperty';
import { DatetimeProperty } from './DatetimeProperty';
import { DecimalProperty } from './DecimalProperty';
import { DescriptorProperty } from './DescriptorProperty';
import { DomainEntityProperty } from './DomainEntityProperty';
import { DurationProperty } from './DurationProperty';
import { EnumerationProperty } from './EnumerationProperty';
import { InlineCommonProperty } from './InlineCommonProperty';
import { IntegerProperty } from './IntegerProperty';
import { PercentProperty } from './PercentProperty';
import { SchoolYearEnumerationProperty } from './SchoolYearEnumerationProperty';
import { SharedDecimalProperty } from './SharedDecimalProperty';
import { SharedIntegerProperty } from './SharedIntegerProperty';
import { SharedShortProperty } from './SharedShortProperty';
import { SharedStringProperty } from './SharedStringProperty';
import { ShortProperty } from './ShortProperty';
import { StringProperty } from './StringProperty';
import { TimeProperty } from './TimeProperty';
import { YearProperty } from './YearProperty';
import { PropertyType } from './PropertyType';
import { EntityProperty } from './EntityProperty';
import { allPropertyTypes } from './PropertyType';
import { Namespace } from '../Namespace';

/**
 *
 */
export class PropertyIndex {
  association: AssociationProperty[];

  boolean: BooleanProperty[];

  choice: ChoiceProperty[];

  common: CommonProperty[];

  currency: CurrencyProperty[];

  date: DatetimeProperty[];

  datetime: DateProperty[];

  decimal: DecimalProperty[];

  descriptor: DescriptorProperty[];

  domainEntity: DomainEntityProperty[];

  duration: DurationProperty[];

  enumeration: EnumerationProperty[];

  inlineCommon: InlineCommonProperty[];

  integer: IntegerProperty[];

  percent: PercentProperty[];

  schoolYearEnumeration: SchoolYearEnumerationProperty[];

  sharedDecimal: SharedDecimalProperty[];

  sharedInteger: SharedIntegerProperty[];

  sharedShort: SharedShortProperty[];

  sharedString: SharedStringProperty[];

  short: ShortProperty[];

  string: StringProperty[];

  time: TimeProperty[];

  year: YearProperty[];
}

/**
 *
 */
export function newPropertyIndex(): PropertyIndex {
  return {
    ...new PropertyIndex(),
    association: [],
    boolean: [],
    choice: [],
    common: [],
    currency: [],
    date: [],
    datetime: [],
    decimal: [],
    descriptor: [],
    domainEntity: [],
    duration: [],
    enumeration: [],
    inlineCommon: [],
    integer: [],
    percent: [],
    schoolYearEnumeration: [],
    sharedDecimal: [],
    sharedInteger: [],
    sharedShort: [],
    sharedString: [],
    short: [],
    string: [],
    time: [],
    year: [],
  };
}

/**
 *
 */
export function getPropertiesOfType(propertyIndex: PropertyIndex, ...propertyTypes: PropertyType[]): EntityProperty[] {
  const result: EntityProperty[] = [];
  propertyTypes.forEach((propertyType) => result.push(...propertyIndex[propertyType]));
  return result;
}

/**
 *
 */
export function getPropertiesOfTypeForNamespaces(
  propertyIndex: PropertyIndex,
  namespaces: Namespace[],
  ...propertyTypes: PropertyType[]
): EntityProperty[] {
  const result: EntityProperty[] = [];

  propertyTypes.forEach((propertyType) => {
    const propertiesInNamespaces = propertyIndex[propertyType].filter((property: EntityProperty) =>
      namespaces.includes(property.namespace),
    );
    result.push(...propertiesInNamespaces);
  });
  return result;
}

/**
 *
 */
export function getAllProperties(propertyIndex: PropertyIndex): EntityProperty[] {
  return getPropertiesOfType(propertyIndex, ...allPropertyTypes);
}

/**
 *
 */
export function getAllPropertiesForNamespaces(propertyIndex: PropertyIndex, namespaces: Namespace[]): EntityProperty[] {
  return getPropertiesOfTypeForNamespaces(propertyIndex, namespaces, ...allPropertyTypes);
}

/**
 *
 */
export function addProperty(propertyIndex: PropertyIndex, property: EntityProperty) {
  propertyIndex[property.type].push(property);
}
