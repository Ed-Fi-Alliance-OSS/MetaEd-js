import { newMetaEdEnvironment, newNamespace, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/diminisher/ModifyStringColumnLengthDiminisher';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newTable, Table } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { newColumn, StringColumn } from '../../src/model/database/Column';

describe('when ModifyColumnDataTypesDiminisher diminishes string lengths for matching table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const educationContentAuthor = 'EducationContentAuthor';
  const author = 'Author';
  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: educationContentAuthor,
      columns: [
        {
          ...newColumn(),
          columnId: author,
          length: '123',
          type: 'string',
        } as StringColumn,
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should modify data type for matching columns', (): void => {
    const { columns } = tableEntities(metaEd, namespace).get(educationContentAuthor) as Table;
    expect(columns).toHaveLength(1);
    expect(columns[0].columnId).toBe(author);
    expect(columns[0].type).toBe('string');
    expect((columns[0] as StringColumn).length).toBe('225');
  });
});

describe('when ModifyColumnDataTypesDiminisher diminishes non matching table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const tableId = 'TableId';
  const columnId = 'ColumnId';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId,
      columns: [
        {
          ...newColumn(),
          columnId,
          length: '123',
          type: 'string',
        } as StringColumn,
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should not modify column datatype or length', (): void => {
    const { columns } = tableEntities(metaEd, namespace).get(tableId) as Table;
    expect(columns).toHaveLength(1);
    expect(columns[0].columnId).toBe(columnId);
    expect(columns[0].type).toBe('string');
    expect((columns[0] as StringColumn).length).toBe('123');
  });
});
