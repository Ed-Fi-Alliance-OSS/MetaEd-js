import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { enhance } from '../../src/diminisher/AddReportCardRoleNameFromEducationOrganizationIdOnReportCardScoAndReportCardSloDiminisher';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newColumn } from '../../src/model/database/Column';
import { newColumnPair } from '../../src/model/database/ColumnPair';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { Table } from '../../src/model/database/Table';

describe('when AddReportCardRoleNameFromEducationOrganizationIdOnReportCardScoAndReportCardSloDiminisher diminishes ReportCardStudentCompetencyObjective table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const reportCardStudentCompetencyObjective = 'ReportCardStudentCompetencyObjective';
  const educationOrganizationId = 'EducationOrganizationId';
  const reportCard = 'ReportCard';
  const reportCardEducationOrganizationId = 'ReportCardEducationOrganizationId';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: reportCardStudentCompetencyObjective,
      columns: [{ ...newColumn(), columnId: educationOrganizationId }],
      foreignKeys: [
        {
          ...newForeignKey(),
          foreignTableId: reportCard,
          columnPairs: [
            {
              ...newColumnPair(),
              parentTableColumnId: educationOrganizationId,
              foreignTableColumnId: educationOrganizationId,
            },
          ],
        },
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should rename EducationOrganizationId column to ReportCardEducationOrganizationId', (): void => {
    const {
      columns: [column],
    } = tableEntities(metaEd, namespace).get(reportCardStudentCompetencyObjective) as Table;
    expect(column.columnId).toBe(reportCardEducationOrganizationId);
  });

  it('should have correct foreign key relationship', (): void => {
    const {
      foreignKeys: [foreignKey],
    } = tableEntities(metaEd, namespace).get(reportCardStudentCompetencyObjective) as Table;
    expect(foreignKey.foreignTableId).toBe(reportCard);
    expect(foreignKey.columnPairs[0].parentTableColumnId).toBe(reportCardEducationOrganizationId);
    expect(foreignKey.columnPairs[0].foreignTableColumnId).toBe(educationOrganizationId);
  });
});

describe('when AddReportCardRoleNameFromEducationOrganizationIdOnReportCardScoAndReportCardSloDiminisher diminishes ReportCardStudentLearningObjective table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const reportCardStudentLearningObjective = 'ReportCardStudentLearningObjective';
  const educationOrganizationId = 'EducationOrganizationId';
  const reportCard = 'ReportCard';
  const reportCardEducationOrganizationId = 'ReportCardEducationOrganizationId';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: reportCardStudentLearningObjective,
      columns: [{ ...newColumn(), columnId: educationOrganizationId }],
      foreignKeys: [
        {
          ...newForeignKey(),
          foreignTableId: reportCard,
          columnPairs: [
            {
              ...newColumnPair(),
              parentTableColumnId: educationOrganizationId,
              foreignTableColumnId: educationOrganizationId,
            },
          ],
        },
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should rename EducationOrganizationId column to ReportCardEducationOrganizationId', (): void => {
    const {
      columns: [column],
    } = tableEntities(metaEd, namespace).get(reportCardStudentLearningObjective) as Table;
    expect(column.columnId).toBe(reportCardEducationOrganizationId);
  });

  it('should have correct foreign key relationship', (): void => {
    const {
      foreignKeys: [foreignKey],
    } = tableEntities(metaEd, namespace).get(reportCardStudentLearningObjective) as Table;
    expect(foreignKey.foreignTableId).toBe(reportCard);
    expect(foreignKey.columnPairs[0].parentTableColumnId).toBe(reportCardEducationOrganizationId);
    expect(foreignKey.columnPairs[0].foreignTableColumnId).toBe(educationOrganizationId);
  });
});
