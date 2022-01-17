import R from 'ramda';
import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/diminisher/AssessmentContentStandardTableDiminisher';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newColumn } from '../../src/model/database/Column';
import { newColumnPair } from '../../src/model/database/ColumnPair';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { Column } from '../../src/model/database/Column';
import { ForeignKey } from '../../src/model/database/ForeignKey';
import { Table } from '../../src/model/database/Table';

describe('when AssessmentContentStandardTableDiminisher diminishes AssessmentContentStandard table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const assessment = 'Assessment';
  const assessmentContentStandard = 'AssessmentContentStandard';
  const assessmentVersion = 'AssessmentVersion';
  const version = 'Version';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: assessmentContentStandard,
      columns: [{ ...newColumn(), columnId: version }],
      foreignKeys: [
        {
          ...newForeignKey(),
          foreignTableId: assessment,
          columnPairs: [{ ...newColumnPair(), parentTableColumnId: version, foreignTableColumnId: version }],
        },
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should add AssessmentVersion column', (): void => {
    const { columns } = tableEntities(metaEd, namespace).get(assessmentContentStandard) as Table;
    expect(columns).toHaveLength(2);
    expect(columns[0].columnId).toBe(version);
    expect(columns[columns.length - 1].columnId).toBe(assessmentVersion);
  });

  it('should modify assessment column to be nullable non primary key', (): void => {
    const column: Column = R.head((tableEntities(metaEd, namespace).get(assessmentContentStandard) as Table).columns);
    expect(column.columnId).toBe(version);
    expect(column.isNullable).toBe(true);
    expect(column.isPartOfPrimaryKey).toBe(false);
  });

  it('should have correct foreign key relationship', (): void => {
    const foreignKey: ForeignKey = R.head(
      (tableEntities(metaEd, namespace).get(assessmentContentStandard) as Table).foreignKeys,
    );
    expect(foreignKey.foreignTableId).toBe(assessment);
    expect(foreignKey.columnPairs[0].parentTableColumnId).toBe(assessmentVersion);
    expect(foreignKey.columnPairs[0].foreignTableColumnId).toBe(version);
  });
});

describe('when AssessmentContentStandardTableDiminisher diminishes AssessmentContentStandardAuthor table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const assessmentContentStandard = 'AssessmentContentStandard';
  const assessmentContentStandardAuthor = 'AssessmentContentStandardAuthor';
  const assessmentVersion = 'AssessmentVersion';
  const version = 'Version';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: assessmentContentStandardAuthor,
      columns: [{ ...newColumn(), columnId: version }],
      foreignKeys: [
        {
          ...newForeignKey(),
          foreignTableId: assessmentContentStandard,
          columnPairs: [{ ...newColumnPair(), parentTableColumnId: version, foreignTableColumnId: version }],
        },
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should rename Version column to AssessmentVersion', (): void => {
    const { columns } = tableEntities(metaEd, namespace).get(assessmentContentStandardAuthor) as Table;
    expect(columns).toHaveLength(1);
    expect(columns[0].columnId).toBe(assessmentVersion);
  });

  it('should have correct foreign key relationship', (): void => {
    const foreignKey: ForeignKey = R.head(
      (tableEntities(metaEd, namespace).get(assessmentContentStandardAuthor) as Table).foreignKeys,
    );
    expect(foreignKey.foreignTableId).toBe(assessmentContentStandard);
    expect(foreignKey.columnPairs[0].parentTableColumnId).toBe(assessmentVersion);
    expect(foreignKey.columnPairs[0].foreignTableColumnId).toBe(assessmentVersion);
  });
});

describe('when AssessmentContentStandardTableDiminisher diminishes AssessmentContentStandard table with existing AssessmentVersion column', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const assessment = 'Assessment';
  const assessmentContentStandard = 'AssessmentContentStandard';
  const assessmentVersion = 'AssessmentVersion';
  const version = 'Version';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: assessmentContentStandard,
      columns: [{ ...newColumn(), columnId: assessmentVersion }],
      foreignKeys: [
        {
          ...newForeignKey(),
          foreignTableId: assessment,
          columnPairs: [{ ...newColumnPair(), parentTableColumnId: version, foreignTableColumnId: version }],
        },
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should not add additional columns', (): void => {
    const { columns } = tableEntities(metaEd, namespace).get(assessmentContentStandard) as Table;
    expect(columns).toHaveLength(1);
    expect(columns[0].columnId).toBe(assessmentVersion);
  });

  it('should have unmodified foreign key relationship', (): void => {
    const foreignKey: ForeignKey = R.head(
      (tableEntities(metaEd, namespace).get(assessmentContentStandard) as Table).foreignKeys,
    );
    expect(foreignKey.foreignTableId).toBe(assessment);
    expect(foreignKey.columnPairs[0].parentTableColumnId).toBe(version);
    expect(foreignKey.columnPairs[0].foreignTableColumnId).toBe(version);
  });
});

describe('when AssessmentContentStandardTableDiminisher diminishes AssessmentContentStandardAuthor table with existing AssessmentVersion column', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const assessmentContentStandard = 'AssessmentContentStandard';
  const assessmentContentStandardAuthor = 'AssessmentContentStandardAuthor';
  const assessmentVersion = 'AssessmentVersion';
  const version = 'Version';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: assessmentContentStandardAuthor,
      columns: [{ ...newColumn(), columnId: assessmentVersion }],
      foreignKeys: [
        {
          ...newForeignKey(),
          foreignTableId: assessmentContentStandard,
          columnPairs: [{ ...newColumnPair(), parentTableColumnId: version, foreignTableColumnId: version }],
        },
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should have AssessmentVersion column', (): void => {
    const { columns } = tableEntities(metaEd, namespace).get(assessmentContentStandardAuthor) as Table;
    expect(columns).toHaveLength(1);
    expect(columns[0].columnId).toBe(assessmentVersion);
  });

  it('should have unmodified foreign key relationship', (): void => {
    const foreignKey: ForeignKey = R.head(
      (tableEntities(metaEd, namespace).get(assessmentContentStandardAuthor) as Table).foreignKeys,
    );
    expect(foreignKey.foreignTableId).toBe(assessmentContentStandard);
    expect(foreignKey.columnPairs[0].parentTableColumnId).toBe(version);
    expect(foreignKey.columnPairs[0].foreignTableColumnId).toBe(version);
  });
});
