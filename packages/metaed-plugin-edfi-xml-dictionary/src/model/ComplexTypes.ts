import { HasName } from './HasName';

export interface ComplexTypesRow extends HasName {
  description: string;
}

export const complexTypesSchema = [
  {
    column: 'Name',
    type: String,
    width: 20,
    value: (row: ComplexTypesRow) => row.name,
  },
  {
    column: 'Description',
    type: String,
    width: 100,
    value: (row: ComplexTypesRow) => row.description,
  },
];

export const complexTypesWorksheetName = 'Complex Types';
