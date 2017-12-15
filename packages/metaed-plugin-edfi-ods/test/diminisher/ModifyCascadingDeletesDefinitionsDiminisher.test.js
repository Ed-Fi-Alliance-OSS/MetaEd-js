// @flow
import R from 'ramda';
import { newMetaEdEnvironment } from 'metaed-core';
import type { MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../src/diminisher/ModifyCascadingDeletesDefinitionsDiminisher';
import { enhance as initializeEdFiOdsEntityRepository } from '../../src/model/EdFiOdsEntityRepository';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { pluginEnvironment } from '../../src/enhancer/EnhancerHelper';
import type { ForeignKey } from '../../src/model/database/ForeignKey';
import type { Table } from '../../src/model/database/Table';

describe('when ModifyCascadingDeletesDefinitionsDiminisher diminishes matching table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const assessmentCategoryDescriptor: string = 'AssessmentCategoryDescriptor';
  const descriptor: string = 'Descriptor';

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: assessmentCategoryDescriptor,
      foreignKeys: [
        Object.assign(newForeignKey(), {
          foreignTableName: descriptor,
          withDeleteCascade: true,
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should modify with delete cascade', () => {
    const foreignKey: ForeignKey = R.head((metaEd.plugin.get('edfiOds'): any).entity.table.get(assessmentCategoryDescriptor).foreignKeys);
    expect(foreignKey.foreignTableName).toBe(descriptor);
    expect(foreignKey.withDeleteCascade).toBe(false);
  });
});

describe('when ModifyCascadingDeletesDefinitionsDiminisher diminishes non matching table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const tableName: string = 'TableName';
  const foreignTableName: string = 'ForeignTableName';

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: tableName,
      foreignKeys: [
        Object.assign(newForeignKey(), {
          foreignTableName,
          withDeleteCascade: true,
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should not modify with delete cascade', () => {
    const foreignKey: ForeignKey = R.head((metaEd.plugin.get('edfiOds'): any).entity.table.get(tableName).foreignKeys);
    expect(foreignKey.foreignTableName).toBe(foreignTableName);
    expect(foreignKey.withDeleteCascade).toBe(true);
  });
});
