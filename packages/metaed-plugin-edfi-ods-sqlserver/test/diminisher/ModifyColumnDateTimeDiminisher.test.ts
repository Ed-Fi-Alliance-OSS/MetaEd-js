import { newMetaEdEnvironment, newNamespace, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import {
  initializeEdFiOdsRelationalEntityRepository,
  newTable,
  Table,
  tableEntities,
  newColumn,
} from '@edfi/metaed-plugin-edfi-ods-relational';
import { enhance } from '../../src/diminisher/ModifyColumnDateTimeDiminisher';

describe('when ModifyColumnDateTimeDiminisher diminishes data types for matching table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const studentIndicator = 'StudentStudentIndicator';
  const beginDate = 'BeginDate';
  const endDate = 'EndDate';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: studentIndicator,
      columns: [
        {
          ...newColumn(),
          columnId: beginDate,
        },
        {
          ...newColumn(),
          columnId: endDate,
        },
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should modify data type for matching columns', (): void => {
    const { columns } = tableEntities(metaEd, namespace).get(studentIndicator) as Table;
    expect(columns).toHaveLength(2);
    expect(columns[0].columnId).toBe(beginDate);
    expect(columns[0].data.edfiOdsSqlServer.dataType).toBe('[DATETIME]');
    expect(columns[columns.length - 1].columnId).toBe(endDate);
    expect(columns[columns.length - 1].data.edfiOdsSqlServer.dataType).toBe('[DATETIME]');
  });
});
