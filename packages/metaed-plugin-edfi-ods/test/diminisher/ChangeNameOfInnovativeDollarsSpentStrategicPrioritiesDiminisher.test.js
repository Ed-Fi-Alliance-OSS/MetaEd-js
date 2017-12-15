// @flow
import R from 'ramda';
import { newMetaEdEnvironment } from 'metaed-core';
import type { MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../src/diminisher/ChangeNameOfInnovativeDollarsSpentStrategicPrioritiesDiminisher';
import { enhance as initializeEdFiOdsEntityRepository } from '../../src/model/EdFiOdsEntityRepository';
import { newColumn } from '../../src/model/database/Column';
import { newTable } from '../../src/model/database/Table';
import { pluginEnvironment } from '../../src/enhancer/EnhancerHelper';
import type { Column } from '../../src/model/database/Column';
import type { Table } from '../../src/model/database/Table';

describe('when ChangeNameOfInnovativeDollarsSpentStrategicPrioritiesDiminisher diminishes LocalEducationAgencyFederalFunds table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const innovativeDollarsSpentOnStrategicPriorities: string = 'InnovativeDollarsSpentOnStrategicPriorities';
  const localEducationAgencyFederalFunds: string = 'LocalEducationAgencyFederalFunds';

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const innovativeDollarsSpentStrategicPriorities: string = 'InnovativeDollarsSpentStrategicPriorities';
    const table: Table = Object.assign(newTable(), {
      name: localEducationAgencyFederalFunds,
      columns: [
        Object.assign(newColumn(), {
          name: innovativeDollarsSpentStrategicPriorities,
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should rename InnovativeDollarsSpentStrategicPriorities column to InnovativeDollarsSpentOnStrategicPriorities', () => {
    const column: Column = R.head((metaEd.plugin.get('edfiOds'): any).entity.table.get(localEducationAgencyFederalFunds).columns);
    expect(column.name).toBe(innovativeDollarsSpentOnStrategicPriorities);
  });
});

describe('when ChangeNameOfInnovativeDollarsSpentStrategicPrioritiesDiminisher diminishes LocalEducationAgencyFederalFunds table with existing InnovativeDollarsSpentOnStrategicPriorities column', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const innovativeDollarsSpentOnStrategicPriorities: string = 'InnovativeDollarsSpentOnStrategicPriorities';
  const localEducationAgencyFederalFunds: string = 'LocalEducationAgencyFederalFunds';

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: localEducationAgencyFederalFunds,
      columns: [
        Object.assign(newColumn(), {
          name: innovativeDollarsSpentOnStrategicPriorities,
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should have InnovativeDollarsSpentOnStrategicPriorities column', () => {
    const column: Column = R.head((metaEd.plugin.get('edfiOds'): any).entity.table.get(localEducationAgencyFederalFunds).columns);
    expect(column.name).toBe(innovativeDollarsSpentOnStrategicPriorities);
  });
});
