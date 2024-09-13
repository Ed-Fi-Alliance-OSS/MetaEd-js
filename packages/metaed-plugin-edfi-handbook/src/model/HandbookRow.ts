export interface HandbookRow {
  name: string;
  definition: string;
  umlType: string;
  typeCharacteristics: string | null;
  optionList: string | null;
  references: string | null;
  ods: string | null;
}

export const handbookSchema = [
  {
    column: 'Name',
    type: String,
    width: 20,
    value: (row: HandbookRow) => row.name,
  },
  {
    column: 'Definition',
    type: String,
    width: 40,
    value: (row: HandbookRow) => row.definition,
  },
  {
    column: 'UML Type',
    type: String,
    width: 40,
    value: (row: HandbookRow) => row.umlType,
  },
  {
    column: 'Type Characteristics',
    type: String,
    width: 100,
    value: (row: HandbookRow) => row.typeCharacteristics,
  },
  {
    column: 'Option List',
    type: String,
    width: 20,
    value: (row: HandbookRow) => row.optionList,
  },
  {
    column: 'References',
    type: String,
    width: 20,
    value: (row: HandbookRow) => row.references,
  },
  {
    column: 'ODS',
    type: String,
    width: 20,
    value: (row: HandbookRow) => row.ods,
  },
];

export const handbookWorksheetName = 'Ed-Fi Handbook';
