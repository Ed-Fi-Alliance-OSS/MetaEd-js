// @flow
import R from 'ramda';
import { newMetaEdEnvironment } from 'metaed-core';
import type { MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../src/diminisher/ModifyColumnDataTypesDiminisher';
import { enhance as initializeEdFiOdsEntityRepository } from '../../src/model/EdFiOdsEntityRepository';
import { newDateColumn, newStringColumn } from '../../src/model/database/Column';
import { newTable } from '../../src/model/database/Table';
import { pluginEnvironment } from '../../src/enhancer/EnhancerHelper';
import type { Column } from '../../src/model/database/Column';
import type { Table } from '../../src/model/database/Table';

describe('when ModifyColumnDataTypesDiminisher diminishes data types for matching table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const studentIndicator: string = 'StudentIndicator';
  const beginDate: string = 'BeginDate';
  const endDate: string = 'EndDate';

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: studentIndicator,
      columns: [
        Object.assign(newDateColumn(), {
          name: beginDate,
        }),
        Object.assign(newDateColumn(), {
          name: endDate,
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should modify data type for matching columns', () => {
    const columns: Array<Column> = (metaEd.plugin.get('edfiOds'): any).entity.table.get(studentIndicator).columns;
    expect(columns).toHaveLength(2);
    expect(R.head(columns).name).toBe(beginDate);
    expect(R.head(columns).dataType).toBe('[DATETIME]');
    expect(R.last(columns).name).toBe(endDate);
    expect(R.last(columns).dataType).toBe('[DATETIME]');
  });
});

describe('when ModifyColumnDataTypesDiminisher diminishes string lengths for matching table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const educationContentAuthor: string = 'EducationContentAuthor';
  const author: string = 'Author';
  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: educationContentAuthor,
      columns: [
        Object.assign(newStringColumn('123'), {
          name: author,
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should modify data type for matching columns', () => {
    const columns: Array<Column> = (metaEd.plugin.get('edfiOds'): any).entity.table.get(educationContentAuthor).columns;
    expect(columns).toHaveLength(1);
    expect(R.head(columns).name).toBe(author);
    expect(R.head(columns).length).toBe('225');
    expect(R.head(columns).dataType).toBe('[NVARCHAR](225)');
  });
});

describe('when ModifyColumnDataTypesDiminisher diminishes non matching table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const tableName: string = 'TableName';
  const columnName: string = 'ColumnName';

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: tableName,
      columns: [
        Object.assign(newStringColumn('123'), {
          name: columnName,
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should not modify column datatype or length', () => {
    const columns: Array<Column> = (metaEd.plugin.get('edfiOds'): any).entity.table.get(tableName).columns;
    expect(columns).toHaveLength(1);
    expect(R.head(columns).name).toBe(columnName);
    expect(R.head(columns).length).toBe('123');
    expect(R.head(columns).dataType).toBe('[NVARCHAR](123)');
  });
});
