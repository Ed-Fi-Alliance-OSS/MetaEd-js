// @flow
import type { ModelBase } from './ModelBase';
import type { Enumeration } from './Enumeration';
import { newEnumeration } from './Enumeration';

export type SchoolYearEnumeration = Enumeration;

export function newSchoolYearEnumeration(): SchoolYearEnumeration {
  return {
    ...newEnumeration(),
    type: 'schoolYearEnumeration',
    typeHumanizedName: 'School Year Enumeration',
  };
}

export const asSchoolYearEnumeration = (x: ModelBase): SchoolYearEnumeration => ((x: any): SchoolYearEnumeration);
