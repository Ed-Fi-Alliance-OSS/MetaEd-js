import { HasName } from './HasName';

export interface ElementsRow extends HasName {
  type: string;
  parentType: string;
  cardinality: string;
  description: string;
}

export const elementsSchema = [
  {
    column: 'Name',
    type: String,
    width: 20,
    value: (row: ElementsRow) => row.name,
  },
  {
    column: 'Type',
    type: String,
    width: 20,
    value: (row: ElementsRow) => row.type,
  },
  {
    column: 'Parent Type',
    type: String,
    width: 20,
    value: (row: ElementsRow) => row.parentType,
  },
  {
    column: 'Cardinality',
    type: String,
    width: 20,
    value: (row: ElementsRow) => row.cardinality,
  },
  {
    column: 'Description',
    type: String,
    width: 100,
    value: (row: ElementsRow) => row.description,
  },
];

export const elementsWorksheetName = 'Elements';
