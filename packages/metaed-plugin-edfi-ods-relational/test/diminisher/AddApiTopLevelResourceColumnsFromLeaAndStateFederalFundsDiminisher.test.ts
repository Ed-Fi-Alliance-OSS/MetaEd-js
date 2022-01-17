import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/diminisher/AddApiTopLevelResourceColumnsFromLeaAndStateFederalFundsDiminisher';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newTable } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { Table } from '../../src/model/database/Table';

describe('when AddApiTopLevelResourceColumnsFromLeaAndStateFederalFundsDiminisher diminishes local/state education agency federal fund tables', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const localEducationAgencyFederalFunds = 'LocalEducationAgencyLocalEducationAgencyFederalFunds';
  const stateEducationAgencyFederalFunds = 'StateEducationAgencyStateEducationAgencyFederalFunds';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    const tablesForCoreNamespace: Map<string, Table> = tableEntities(metaEd, namespace);

    const localTable: Table = { ...newTable(), tableId: localEducationAgencyFederalFunds };
    tablesForCoreNamespace.set(localTable.tableId, localTable);

    const stateTable: Table = { ...newTable(), tableId: stateEducationAgencyFederalFunds };
    tablesForCoreNamespace.set(stateTable.tableId, stateTable);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should have local table with includeLastModifiedDateAndIdColumn set to true', (): void => {
    const table: Table | undefined = tableEntities(metaEd, namespace).get(localEducationAgencyFederalFunds);
    expect(table).toBeDefined();
    if (table == null) throw new Error();
    expect(table.includeLastModifiedDateAndIdColumn).toBe(true);
  });

  it('should have state table with includeLastModifiedDateAndIdColumn set to true', (): void => {
    const table: Table | undefined = tableEntities(metaEd, namespace).get(stateEducationAgencyFederalFunds);
    expect(table).toBeDefined();
    if (table == null) throw new Error();
    expect(table.includeLastModifiedDateAndIdColumn).toBe(true);
  });
});
