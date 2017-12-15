// @flow
import R from 'ramda';
import type { MetaEdEnvironment } from 'metaed-core';
import { newMetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../src/diminisher/RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_0_x';
import { enhance as initializeEdFiOdsEntityRepository } from '../../src/model/EdFiOdsEntityRepository';
import { newColumn } from '../../src/model/database/Column';
import { newColumnNamePair } from '../../src/model/database/ColumnNamePair';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { pluginEnvironment } from '../../src/enhancer/EnhancerHelper';
import type { Column } from '../../src/model/database/Column';
import type { ForeignKey } from '../../src/model/database/ForeignKey';
import type { Table } from '../../src/model/database/Table';

describe('when RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_0_x diminishes StudentCompetencyObjective table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const studentCompetencyObjective: string = 'StudentCompetencyObjective';
  const schoolId: string = 'SchoolId';
  const gradingPeriod: string = 'GradingPeriod';
  const gradingPeriodSchoolId: string = gradingPeriod + schoolId;

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: studentCompetencyObjective,
      columns: [
        Object.assign(newColumn(), {
          name: gradingPeriodSchoolId,
        }),
        Object.assign(newColumn(), {
          name: schoolId,
          isNullable: true,
          isPartOfPrimaryKey: false,
        }),
      ],
      foreignKeys: [
        Object.assign(newForeignKey(), {
          foreignTableName: gradingPeriod,
          columnNames: [
            Object.assign(newColumnNamePair(), {
              parentTableColumnName: gradingPeriodSchoolId,
              foreignTableColumnName: schoolId,
            }),
          ],
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should remove GradingPeriodSchoolId column', () => {
    const columns: Array<Column> = (metaEd.plugin.get('edfiOds'): any).entity.table.get(studentCompetencyObjective).columns;
    expect(columns).toHaveLength(1);
    expect(R.head(columns).name).not.toBe(gradingPeriodSchoolId);
  });

  it('should rename foreign key columns', () => {
    const foreignKey: ForeignKey = R.head((metaEd.plugin.get('edfiOds'): any).entity.table.get(studentCompetencyObjective).foreignKeys);
    expect(R.head(foreignKey.columnNames).parentTableColumnName).toBe(schoolId);
    expect(R.head(foreignKey.columnNames).foreignTableColumnName).toBe(schoolId);
  });

  it('should make SchoolId column a non-nullable primary key', () => {
    const column: Column = R.head((metaEd.plugin.get('edfiOds'): any).entity.table.get(studentCompetencyObjective).columns);
    expect(column.name).toBe(schoolId);
    expect(column.isNullable).toBe(false);
    expect(column.isPartOfPrimaryKey).toBe(true);
  });
});

describe('when RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_0_x diminishes StudentLearningObjective table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const studentLearningObjective: string = 'StudentLearningObjective';
  const schoolId: string = 'SchoolId';
  const gradingPeriod: string = 'GradingPeriod';
  const gradingPeriodSchoolId: string = gradingPeriod + schoolId;

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: studentLearningObjective,
      columns: [
        Object.assign(newColumn(), {
          name: gradingPeriodSchoolId,
        }),
        Object.assign(newColumn(), {
          name: schoolId,
          isNullable: true,
          isPartOfPrimaryKey: false,
        }),
      ],
      foreignKeys: [
        Object.assign(newForeignKey(), {
          foreignTableName: gradingPeriod,
          columnNames: [
            Object.assign(newColumnNamePair(), {
              parentTableColumnName: gradingPeriodSchoolId,
              foreignTableColumnName: schoolId,
            }),
          ],
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should remove GradingPeriodSchoolId column', () => {
    const columns: Array<Column> = (metaEd.plugin.get('edfiOds'): any).entity.table.get(studentLearningObjective).columns;
    expect(columns).toHaveLength(1);
    expect(R.head(columns).name).not.toBe(gradingPeriodSchoolId);
  });

  it('should rename foreign key columns', () => {
    const foreignKey: ForeignKey = R.head((metaEd.plugin.get('edfiOds'): any).entity.table.get(studentLearningObjective).foreignKeys);
    expect(R.head(foreignKey.columnNames).parentTableColumnName).toBe(schoolId);
    expect(R.head(foreignKey.columnNames).foreignTableColumnName).toBe(schoolId);
  });

  it('should make SchoolId column a non-nullable primary key', () => {
    const column: Column = R.head((metaEd.plugin.get('edfiOds'): any).entity.table.get(studentLearningObjective).columns);
    expect(column.name).toBe(schoolId);
    expect(column.isNullable).toBe(false);
    expect(column.isPartOfPrimaryKey).toBe(true);
  });
});
