// @flow
import R from 'ramda';
import { newMetaEdEnvironment } from 'metaed-core';
import type { MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../src/diminisher/ForeignKeyOrderDiminisher';
import { enhance as initializeEdFiOdsEntityRepository } from '../../src/model/EdFiOdsEntityRepository';
import { newColumn } from '../../src/model/database/Column';
import { newColumnNamePair } from '../../src/model/database/ColumnNamePair';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { pluginEnvironment } from '../../src/enhancer/EnhancerHelper';
import type { Column } from '../../src/model/database/Column';
import type { ForeignKey } from '../../src/model/database/ForeignKey';
import type { Table } from '../../src/model/database/Table';

describe('when ForeignKeyOrderDiminisher diminishes matching table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'edfi';
  const parentTableName: string = 'ParentTableName';
  const gradebookEntryLearningObjective: string = 'GradebookEntryLearningObjective';
  const primaryKeyOrder: Array<string> = [
    'SchoolId',
    'ClassPeriodName',
    'ClassroomIdentificationCode',
    'GradebookEntryTitle',
    'DateAssigned',
    'Objective',
    'AcademicSubjectDescriptorId',
    'ObjectiveGradeLevelDescriptorId',
    'SchoolYear',
    'LocalCourseCode',
    'TermDescriptorId',
    'UniqueSectionCode',
    'SequenceOfCourse',
  ];
  const primaryKeyNames: Array<string> = [
    'SequenceOfCourse',
    'SchoolId',
    'UniqueSectionCode',
    'ClassPeriodName',
    'TermDescriptorId',
    'ClassroomIdentificationCode',
    'LocalCourseCode',
    'GradebookEntryTitle',
    'SchoolYear',
    'DateAssigned',
    'ObjectiveGradeLevelDescriptorId',
    'Objective',
    'AcademicSubjectDescriptorId',
  ];

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const foreignTable: Table = Object.assign(newTable(), {
      name: gradebookEntryLearningObjective,
      primaryKeys: primaryKeyOrder.map(
        (name: string) => Object.assign(newColumn(), {
          name,
          isPartOfPrimaryKey: true,
        }),
      ),
    });
    pluginEnvironment(metaEd).entity.table.set(foreignTable.name, foreignTable);

    const parentTable: Table = Object.assign(newTable(), {
      name: parentTableName,
      columns: primaryKeyNames.map((name: string) => Object.assign(newColumn(), {
        name,
      }),
      ),
      foreignKeys: [
        Object.assign(newForeignKey(), {
          foreignTableSchema: namespace,
          foreignTableName: foreignTable.name,
          columnNames: primaryKeyNames.map((name: string) => Object.assign(newColumnNamePair(), {
            parentTableColumnName: name,
            foreignTableColumnName: name,
          })),
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(parentTable.name, parentTable);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should have correct foreign key order', () => {
    const foreignKeys: Array<ForeignKey> = (metaEd.plugin.get('edfiOds'): any).entity.table.get(parentTableName).foreignKeys;
    expect(foreignKeys).toBeDefined();
    expect(R.chain((fk: ForeignKey) => fk.foreignTableColumnNames)(foreignKeys)).toEqual(primaryKeyOrder);
  });

  it('should have order parity with foreign table primary keys', () => {
    const primaryKeyNamesOnForeignTable: Array<string> = (metaEd.plugin.get('edfiOds'): any).entity.table
      .get(gradebookEntryLearningObjective)
      .primaryKeys.map((pk: Column) => pk.name);
    const foreignKeyNames: Array<string> = R.chain((fk: ForeignKey) => fk.foreignTableColumnNames)(
      (metaEd.plugin.get('edfiOds'): any).entity.table.get(parentTableName).foreignKeys,
    );
    expect(primaryKeyNamesOnForeignTable).toEqual(foreignKeyNames);
  });
});

describe('when ForeignKeyOrderDiminisher diminishes non matching table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'edfi';
  const parentTableName: string = 'ParentTableName';
  const foreignTableName: string = 'ForeignTableName';
  const primaryKeyNames: Array<string> = [
    'PrimaryKeyNameF',
    'PrimaryKeyNameA',
    'PrimaryKeyNameC',
    'PrimaryKeyNameE',
    'PrimaryKeyNameD',
    'PrimaryKeyNameB',
    'PrimaryKeyNameJ',
    'PrimaryKeyNameH',
    'PrimaryKeyNameG',
    'PrimaryKeyNameI',
  ];

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const foreignTable: Table = Object.assign(newTable(), {
      name: foreignTableName,
      primaryKeys: primaryKeyNames.map(
        (name: string) => Object.assign(newColumn(), {
          name,
          isPartOfPrimaryKey: true,
        }),
      ),
    });
    pluginEnvironment(metaEd).entity.table.set(foreignTable.name, foreignTable);

    const parentTable: Table = Object.assign(newTable(), {
      name: parentTableName,
      columns: primaryKeyNames.map((name: string) => Object.assign(newColumn(), {
        name,
      }),
      ),
      foreignKeys: [
        Object.assign(newForeignKey(), {
          foreignTableSchema: namespace,
          foreignTableName: foreignTable.name,
          columnNames: primaryKeyNames.map((name: string) => Object.assign(newColumnNamePair(), {
            parentTableColumnName: name,
            foreignTableColumnName: name,
          })),
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(parentTable.name, parentTable);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should have correct foreign key order', () => {
    const foreignKeys: Array<ForeignKey> = (metaEd.plugin.get('edfiOds'): any).entity.table.get(parentTableName).foreignKeys;
    expect(foreignKeys).toBeDefined();
    expect(R.chain((fk: ForeignKey) => fk.foreignTableColumnNames)(foreignKeys)).toEqual(primaryKeyNames);
  });

  it('should have order parity with foreign table primary keys', () => {
    const primaryKeyNamesOnForeignTable: Array<string> = (metaEd.plugin.get('edfiOds'): any).entity.table
      .get(foreignTableName)
      .primaryKeys.map((pk: Column) => pk.name);
    const foreignKeyNames: Array<string> = R.chain((fk: ForeignKey) => fk.foreignTableColumnNames)(
      (metaEd.plugin.get('edfiOds'): any).entity.table.get(parentTableName).foreignKeys,
    );
    expect(primaryKeyNamesOnForeignTable).toEqual(foreignKeyNames);
  });
});
