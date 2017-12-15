// @flow
import R from 'ramda';
import type { MetaEdEnvironment } from 'metaed-core';
import { newMetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../src/diminisher/ModifyReverseForeignKeyIndexesDiminisher';
import { enhance as initializeEdFiOdsEntityRepository } from '../../src/model/EdFiOdsEntityRepository';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { pluginEnvironment } from '../../src/enhancer/EnhancerHelper';
import type { ForeignKey } from '../../src/model/database/ForeignKey';
import type { Table } from '../../src/model/database/Table';

describe('when ModifyReverseForeignKeyIndexesDiminisher diminishes matching table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const assessmentContentStandard: string = 'AssessmentContentStandard';
  const assessment: string = 'Assessment';

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: assessmentContentStandard,
      foreignKeys: [
        Object.assign(newForeignKey(), {
          parentTableName: assessmentContentStandard,
          foreignTableName: assessment,
          withReverseForeignKeyIndex: false,
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should modify with reverse foreign key index', () => {
    const foreignKey: ForeignKey = R.head((metaEd.plugin.get('edfiOds'): any).entity.table.get(assessmentContentStandard).foreignKeys);
    expect(foreignKey.parentTableName).toBe(assessmentContentStandard);
    expect(foreignKey.foreignTableName).toBe(assessment);
    expect(foreignKey.withReverseForeignKeyIndex).toBe(true);
  });
});

describe('when ModifyReverseForeignKeyIndexesDiminisher diminishes non matching table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentTableName: string = 'ParentTableName';
  const foreignTableName: string = 'ForeignTableName';

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: parentTableName,
      foreignKeys: [
        Object.assign(newForeignKey(), {
          parentTableName,
          foreignTableName,
          withReverseForeignKeyIndex: false,
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should not modify with reverse foreign key index', () => {
    const foreignKey: ForeignKey = R.head((metaEd.plugin.get('edfiOds'): any).entity.table.get(parentTableName).foreignKeys);
    expect(foreignKey.parentTableName).toBe(parentTableName);
    expect(foreignKey.foreignTableName).toBe(foreignTableName);
    expect(foreignKey.withReverseForeignKeyIndex).toBe(false);
  });
});
