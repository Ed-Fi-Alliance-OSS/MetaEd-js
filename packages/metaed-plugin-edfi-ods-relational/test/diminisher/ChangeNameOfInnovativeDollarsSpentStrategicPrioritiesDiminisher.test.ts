import * as R from 'ramda';
import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/diminisher/ChangeNameOfInnovativeDollarsSpentStrategicPrioritiesDiminisher';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newColumn } from '../../src/model/database/Column';
import { newTable } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { Column } from '../../src/model/database/Column';
import { Table } from '../../src/model/database/Table';

describe('when ChangeNameOfInnovativeDollarsSpentStrategicPrioritiesDiminisher diminishes LocalEducationAgencyFederalFunds table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const innovativeDollarsSpentOnStrategicPriorities = 'InnovativeDollarsSpentOnStrategicPriorities';
  const localEducationAgencyFederalFunds = 'LocalEducationAgencyLocalEducationAgencyFederalFunds';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const innovativeDollarsSpentStrategicPriorities = 'InnovativeDollarsSpentStrategicPriorities';
    const table: Table = {
      ...newTable(),
      tableId: localEducationAgencyFederalFunds,
      columns: [{ ...newColumn(), columnId: innovativeDollarsSpentStrategicPriorities }],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should rename InnovativeDollarsSpentStrategicPriorities column to InnovativeDollarsSpentOnStrategicPriorities', (): void => {
    const column: Column = R.head((tableEntities(metaEd, namespace).get(localEducationAgencyFederalFunds) as Table).columns);
    expect(column.columnId).toBe(innovativeDollarsSpentOnStrategicPriorities);
  });
});

describe('when ChangeNameOfInnovativeDollarsSpentStrategicPrioritiesDiminisher diminishes LocalEducationAgencyFederalFunds table with existing InnovativeDollarsSpentOnStrategicPriorities column', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const innovativeDollarsSpentOnStrategicPriorities = 'InnovativeDollarsSpentOnStrategicPriorities';
  const localEducationAgencyFederalFunds = 'LocalEducationAgencyFederalFunds';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: localEducationAgencyFederalFunds,
      columns: [{ ...newColumn(), columnId: innovativeDollarsSpentOnStrategicPriorities }],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should have InnovativeDollarsSpentOnStrategicPriorities column', (): void => {
    const column: Column = R.head((tableEntities(metaEd, namespace).get(localEducationAgencyFederalFunds) as Table).columns);
    expect(column.columnId).toBe(innovativeDollarsSpentOnStrategicPriorities);
  });
});
