// @flow
import { newEnumerationRowBase } from './EnumerationRowBase';
import type { EnumerationRowBase } from './EnumerationRowBase';

export type SchoolYearEnumerationRow = {
  ...$Exact<EnumerationRowBase>;
  schoolYear: number;
  schoolYearDescription: string;
}

export function newSchoolYearEnumerationRow(): SchoolYearEnumerationRow {
  return Object.assign({}, newEnumerationRowBase(), {
    type: 'schoolYearEnumerationRow',
    schoolYear: 0,
    schoolYearDescription: '',
  });
}

export const NoSchoolYearEnumerationRow: SchoolYearEnumerationRow = Object.assign(newSchoolYearEnumerationRow(), {
  name: 'NoSchoolYearEnumerationRow',
});
