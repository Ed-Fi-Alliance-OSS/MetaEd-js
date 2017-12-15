// @flow

export type ColumnData = {
  boolean: string;
  currency: string;
  date: string;
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
  boolean: '[BIT]',
  currency: '[MONEY]',
  date: '[DATE]',
  decimal: (precision, scale) => `[DECIMAL](${precision}, ${scale})`,
  duration: '[NVARCHAR](30)',
  integer: '[INT]',
  percent: '[DECIMAL](5, 4)',
  short: '[SMALLINT]',
  string: (length) => `[NVARCHAR](${length})`,
  time: '[TIME](7)',
  year: '[SMALLINT]',
};
