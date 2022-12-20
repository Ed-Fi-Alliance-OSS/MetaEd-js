import * as R from 'ramda';
import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/diminisher/RemoveStartTimeFromPkOfInterventionMeetingTimeDiminisher';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newColumn } from '../../src/model/database/Column';
import { newTable } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { Column } from '../../src/model/database/Column';
import { Table } from '../../src/model/database/Table';

describe('when RemoveStartTimeFromPkOfInterventionMeetingTimeDiminisher diminishes InterventionMeetingTime table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const interventionMeetingTime = 'InterventionMeetingTime';

  beforeAll(() => {
    const startTime = 'StartTime';
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: interventionMeetingTime,
      columns: [{ ...newColumn(), columnId: startTime, isPartOfPrimaryKey: true, isNullable: true }],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should modify StartTime column to be non-primary key and non-nullable', (): void => {
    const column: Column = R.head((tableEntities(metaEd, namespace).get(interventionMeetingTime) as Table).columns);
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
  });
});

describe('when RemoveStartTimeFromPkOfInterventionMeetingTimeDiminisher diminishes non matching table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const tableName = 'TableName';

  beforeAll(() => {
    const columnName = 'ColumnName';
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: tableName,
      columns: [{ ...newColumn(), columnId: columnName, isPartOfPrimaryKey: true, isNullable: true }],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should not modify column', (): void => {
    const column: Column = R.head((tableEntities(metaEd, namespace).get(tableName) as Table).columns);
    expect(column.isPartOfPrimaryKey).toBe(true);
    expect(column.isNullable).toBe(true);
  });
});
