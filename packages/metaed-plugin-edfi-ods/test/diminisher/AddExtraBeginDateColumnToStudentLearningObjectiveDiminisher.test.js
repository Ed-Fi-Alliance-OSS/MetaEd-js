// @flow
import R from 'ramda';
import { newMetaEdEnvironment } from 'metaed-core';
import type { MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../src/diminisher/AddExtraBeginDateColumnToStudentLearningObjectiveDiminisher';
import { enhance as initializeEdFiOdsEntityRepository } from '../../src/model/EdFiOdsEntityRepository';
import { newColumn } from '../../src/model/database/Column';
import { newColumnNamePair } from '../../src/model/database/ColumnNamePair';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { pluginEnvironment } from '../../src/enhancer/EnhancerHelper';
import type { ForeignKey } from '../../src/model/database/ForeignKey';
import type { Table } from '../../src/model/database/Table';

describe('when AddExtraBeginDateColumnToStudentLearningObjectiveDiminisher diminishes StudentLearningObjective table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const studentLearningObjective: string = 'StudentLearningObjective';
  const studentSectionAssociation: string = 'StudentSectionAssociation';
  const beginDate: string = 'BeginDate';
  const studentSectionAssociationBeginDate: string = studentSectionAssociation + beginDate;

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: studentLearningObjective,
      foreignKeys: [
        Object.assign(newForeignKey(), {
          foreignTableName: studentSectionAssociation,
          columnNames: [
            Object.assign(newColumnNamePair(), {
              parentTableColumnName: beginDate,
              foreignTableColumnName: beginDate,
            }),
          ],
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should add StudentSectionAssociationBeginDate column', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(studentLearningObjective);
    expect(table).toBeDefined();
    expect(R.head(table.columns).name).toBe(studentSectionAssociationBeginDate);
    expect(R.head(table.columns).isNullable).toBe(true);
  });

  it('should have correct foreign key relationship', () => {
    const foreignKey: ForeignKey = R.head((metaEd.plugin.get('edfiOds'): any).entity.table.get(studentLearningObjective).foreignKeys);
    expect(foreignKey.foreignTableName).toBe(studentSectionAssociation);
    expect(R.head(foreignKey.columnNames).parentTableColumnName).toBe(studentSectionAssociationBeginDate);
    expect(R.head(foreignKey.columnNames).foreignTableColumnName).toBe(beginDate);
  });
});

describe('when AddExtraBeginDateColumnToStudentLearningObjectiveDiminisher diminishes StudentLearningObjective table with existing studentSectionAssociationBeginDate column', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const studentLearningObjective: string = 'StudentLearningObjective';
  const studentSectionAssociation: string = 'StudentSectionAssociation';
  const beginDate: string = 'BeginDate';
  const studentSectionAssociationBeginDate: string = studentSectionAssociation + beginDate;

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: studentLearningObjective,
      columns: [
        Object.assign(newColumn(), {
          name: studentSectionAssociationBeginDate,
          isNullable: false,
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should not modify StudentSectionAssociationBeginDate column', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(studentLearningObjective);
    expect(table).toBeDefined();
    expect(table.columns).toHaveLength(1);
    expect(R.head(table.columns).name).toBe(studentSectionAssociationBeginDate);
    expect(R.head(table.columns).isNullable).toBe(false);
  });

  it('should not modify foreign keys', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(studentLearningObjective).foreignKeys).toHaveLength(0);
  });
});
