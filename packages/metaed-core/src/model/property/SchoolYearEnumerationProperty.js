// @flow
import type { ReferentialProperty, ReferentialPropertySourceMap } from './ReferentialProperty';
import { newReferentialProperty, newReferentialPropertySourceMap } from './ReferentialProperty';
import type { EntityProperty } from './EntityProperty';

export type SchoolYearEnumerationPropertySourceMap = ReferentialPropertySourceMap;

export function newSchoolYearEnumerationPropertySourceMap(): SchoolYearEnumerationPropertySourceMap {
  return {
    ...newReferentialPropertySourceMap(),
  };
}

export type SchoolYearEnumerationProperty = {
  sourceMap: SchoolYearEnumerationPropertySourceMap,
  ...$Exact<ReferentialProperty>,
};

export function newSchoolYearEnumerationProperty(): SchoolYearEnumerationProperty {
  return {
    ...newReferentialProperty(),
    type: 'schoolYearEnumeration',
    typeHumanizedName: 'School Year Enumeration Property',
    sourceMap: newSchoolYearEnumerationPropertySourceMap(),
  };
}

export const asSchoolYearEnumerationProperty = (x: EntityProperty): SchoolYearEnumerationProperty =>
  ((x: any): SchoolYearEnumerationProperty);
