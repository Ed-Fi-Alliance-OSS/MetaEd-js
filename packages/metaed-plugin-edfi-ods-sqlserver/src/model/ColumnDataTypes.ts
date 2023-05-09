export interface ColumnData {
  unknown: string;
  bigint: string;
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
  bigint: '[BIGINT]',
  boolean: '[BIT]',
  currency: '[MONEY]',
  date: '[DATE]',
  datetime: '[DATETIME2](7)',
  decimal: (precision, scale) => `[DECIMAL](${precision}, ${scale})`,
  duration: '[NVARCHAR](30)',
  integer: '[INT]',
  percent: '[DECIMAL](5, 4)',
  short: '[SMALLINT]',
  string: (length) => `[NVARCHAR](${length})`,
  time: '[TIME](7)',
  year: '[SMALLINT]',
};
