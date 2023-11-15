import { MetaEdEnvironment, Namespace, newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import {
  initializeEdFiOdsRelationalEntityRepository,
  newColumn,
  newTable,
  tableEntities,
  Table,
  ColumnType,
  StringColumn,
} from '@edfi/metaed-plugin-edfi-ods-relational';
import { enhance } from '../../src/enhancer/TemplateSpecificTablePropertyEnhancer';
import { enhance as tableSetupEnhancer } from '../../src/model/Table';
import { enhance as sqlServerColumnNamingEnhancer } from '../../src/enhancer/SqlServerColumnNamingEnhancer';

describe('when a table has a string longer than 4000 bytes', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const tableName = 'TableName';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: tableName,
      schema: namespace.namespaceName,
      columns: [
        {
          ...newColumn(),
          type: 'string' as ColumnType,
          maxLength: '4000',
          columnId: 'NormalString',
        } as StringColumn,
        {
          ...newColumn(),
          type: 'string' as ColumnType,
          maxLength: '4500',
          columnId: 'MAXString',
        } as StringColumn,
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '3.2.0-c';
    tableSetupEnhancer(metaEd);
    sqlServerColumnNamingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should keep length for strings 4000 bytes or less numeric', (): void => {
    const { columns } = tableEntities(metaEd, namespace).get(tableName) as Table;
    const longColumn = columns.find((x) => x.columnId === 'NormalString') as StringColumn;
    expect(longColumn.data.edfiOdsSqlServer.dataType).toEqual('[NVARCHAR](4000)');
  });

  it('should convert strings longer than 4000 bytes to NVARCHAR(MAX)', (): void => {
    const { columns } = tableEntities(metaEd, namespace).get(tableName) as Table;
    const longColumn = columns.find((x) => x.columnId === 'MAXString') as StringColumn;
    expect(longColumn.data.edfiOdsSqlServer.dataType).toEqual('[NVARCHAR](MAX)');
  });
});
