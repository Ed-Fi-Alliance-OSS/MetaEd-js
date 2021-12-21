import Sugar from 'sugar';
import { database, scalar, firstKeyValueOf, testDatabaseName } from './DatabaseConnection';
import { DatabaseTable } from './DatabaseTable';

export interface DatabaseIndex {
  databaseTable: DatabaseTable;
  columns: string[];
}

const existsSelect = 'SELECT COUNT(1) ';
const isUniqueSelect = 'SELECT is_unique ';
const fromBody = `
  FROM sys.indexes ind
  INNER JOIN sys.index_columns ic
    ON ind.object_id = ic.object_id
    AND ind.index_id = ic.index_id
  INNER JOIN sys.columns col
    ON ic.object_id = col.object_id
    AND ic.column_id = col.column_id
  INNER JOIN sys.tables t
    ON ind.object_id = t.object_id
`;
const whereClauseFormat = `(
  t.name = '{0}'
    AND col.name = '{1}'
    AND ic.key_ordinal = '{2}'
  )`;

function whereClause(index: DatabaseIndex): string {
  const clause: string[] = index.columns.map((_column: string, x: number) =>
    Sugar.String.format(whereClauseFormat, index.databaseTable.name, index.columns[x], x + 1),
  );
  return ` WHERE ${clause.join(' OR ')}`;
}

export async function indexExists(databaseIndex: DatabaseIndex, databaseName: string = testDatabaseName): Promise<boolean> {
  const sql = existsSelect + fromBody + whereClause(databaseIndex);
  let result;
  await database(databaseName, async (db) => {
    result = await scalar(db, 'indexExists', sql);
  });
  return firstKeyValueOf(result) === databaseIndex.columns.length;
}

export async function indexIsUnique(
  databaseIndex: DatabaseIndex,
  databaseName: string = testDatabaseName,
): Promise<boolean> {
  const sql = isUniqueSelect + fromBody + whereClause(databaseIndex);
  let result: boolean | null = null;
  await database(databaseName, async (db) => {
    result = await scalar(db, 'indexIsUnique', sql);
  });
  return firstKeyValueOf(result);
}
