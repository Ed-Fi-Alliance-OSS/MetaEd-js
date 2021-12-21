export interface ColumnData {
  unknown: string;
  boolean: string;
  currency: string;
  date: string;
  datetime: string;
  decimal: (precision: string, scale: string) => string;
  duration: string;
  integer: string;
  percent: string;
  short: string;
  string: (length: string) => string;
  time: string;
  year: string;
}

export const ColumnDataTypes: ColumnData = {
  unknown: '',
  boolean: 'BOOLEAN',
  currency: 'MONEY',
  date: 'DATE',
  datetime: 'TIMESTAMP',
  decimal: (precision, scale) => `DECIMAL(${precision}, ${scale})`,
  duration: 'VARCHAR(30)',
  integer: 'INT',
  percent: 'DECIMAL(5, 4)',
  short: 'SMALLINT',
  string: (length) => `VARCHAR(${length})`,
  time: 'TIME',
  year: 'SMALLINT',
};
