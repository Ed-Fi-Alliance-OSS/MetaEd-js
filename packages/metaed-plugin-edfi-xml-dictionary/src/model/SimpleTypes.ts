import { HasName } from './HasName';

export interface SimpleTypesRow extends HasName {
  restrictions: string;
  description: string;
}

export const simpleTypesSchema = [
  {
    column: 'Name',
    type: String,
    width: 20,
    value: (row: SimpleTypesRow) => row.name,
  },
  {
    column: 'Restrictions',
    type: String,
    width: 20,
    value: (row: SimpleTypesRow) => row.restrictions,
  },
  {
    column: 'Description',
    type: String,
    width: 100,
    value: (row: SimpleTypesRow) => row.description,
  },
];

export const simpleTypesWorksheetName = 'Simple Types';
