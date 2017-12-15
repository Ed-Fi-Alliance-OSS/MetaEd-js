// @flow
import { newMetaEdEnvironment } from 'metaed-core';
import type { MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../src/diminisher/AddApiTopLevelResourceColumnsFromLeaAndStateFederalFundsDiminisher';
import { enhance as initializeEdFiOdsEntityRepository } from '../../src/model/EdFiOdsEntityRepository';
import { newTable } from '../../src/model/database/Table';
import { pluginEnvironment } from '../../src/enhancer/EnhancerHelper';
import type { Table } from '../../src/model/database/Table';

describe('when AddApiTopLevelResourceColumnsFromLeaAndStateFederalFundsDiminisher diminishes local/state education agency federal fund tables', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const localEducationAgencyFederalFunds: string = 'LocalEducationAgencyFederalFunds';
  const stateEducationAgencyFederalFunds: string = 'StateEducationAgencyFederalFunds';

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const localTable: Table = Object.assign(newTable(), {
      name: localEducationAgencyFederalFunds,
    });
    pluginEnvironment(metaEd).entity.table.set(localTable.name, localTable);

    const stateTable: Table = Object.assign(newTable(), {
      name: stateEducationAgencyFederalFunds,
    });
    pluginEnvironment(metaEd).entity.table.set(stateTable.name, stateTable);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should have local table with includeLastModifiedDateAndIdColumn set to true', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(localEducationAgencyFederalFunds);
    expect(table).toBeDefined();
    expect(table.includeLastModifiedDateAndIdColumn).toBe(true);
  });

  it('should have state table with includeLastModifiedDateAndIdColumn set to true', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(stateEducationAgencyFederalFunds);
    expect(table).toBeDefined();
    expect(table.includeLastModifiedDateAndIdColumn).toBe(true);
  });
});
