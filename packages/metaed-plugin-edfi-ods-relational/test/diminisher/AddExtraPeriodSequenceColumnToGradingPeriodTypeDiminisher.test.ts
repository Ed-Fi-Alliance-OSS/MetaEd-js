import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { enhance } from '../../src/diminisher/AddExtraPeriodSequenceColumnToGradingPeriodTypeDiminisher';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newColumn } from '../../src/model/database/Column';
import { newTable } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { Table } from '../../src/model/database/Table';

describe('when AddExtraPeriodSequenceColumnToGradingPeriodTypeDiminisher diminishes GradingPeriodType table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const gradingPeriodType = 'GradingPeriodType';
  const periodSequence = 'PeriodSequence';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = { ...newTable(), tableId: gradingPeriodType };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should add PeriodSequence column', (): void => {
    const table: Table | undefined = tableEntities(metaEd, namespace).get(gradingPeriodType);
    expect(table).toBeDefined();
    if (table == null) throw new Error();
    expect(table.columns[0].columnId).toBe(periodSequence);
    expect(table.columns[0].isNullable).toBe(true);
  });
});

describe('when AddExtraPeriodSequenceColumnToGradingPeriodTypeDiminisher diminishes GradingPeriodType table with existing PeriodSequence column', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const gradingPeriodType = 'GradingPeriodType';
  const periodSequence = 'PeriodSequence';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: gradingPeriodType,
      columns: [{ ...newColumn(), columnId: periodSequence, isNullable: false }],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should not modify PeriodSequence column', (): void => {
    const table: Table | undefined = tableEntities(metaEd, namespace).get(gradingPeriodType);
    expect(table).toBeDefined();
    if (table == null) throw new Error();
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(periodSequence);
    expect(table.columns[0].isNullable).toBe(false);
  });
});
