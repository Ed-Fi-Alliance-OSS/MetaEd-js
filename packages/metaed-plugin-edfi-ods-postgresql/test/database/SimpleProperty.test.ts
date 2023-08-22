import { Column, Db, Table } from 'pg-structure';
import {
  DomainEntityBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  MetaEdEnvironment,
  newMetaEdEnvironment,
} from '@edfi/metaed-core';
import { enhanceGenerateAndExecuteSql, rollbackAndEnd } from './DatabaseTestBase';

jest.setTimeout(40000);

// TODO: Most simple property tests are missing. METAED-1432 covers porting missing tests from SQL Server.

describe('when entity has integer property with big hint', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const domainEntityName = 'DomainEntityName';
  const integerDocumentation = 'IntegerDocumentation';
  const integerPropertyName = 'IntegerName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IdentityPropertyName', 'Documentation')
      .withIntegerProperty(integerPropertyName, integerDocumentation, false, false, null, null, null, null, false, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));
  });

  it('should have entity table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(namespaceName.toLowerCase()).tables.get(domainEntityName.toLowerCase());
    expect(table).toBeDefined();

    await rollbackAndEnd();
  });

  it('should have correct column datatype', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table: Table = db.schemas.get(namespaceName.toLowerCase()).tables.get(domainEntityName.toLowerCase());

    const integerColumn: Column = table.columns.get(integerPropertyName.toLowerCase());
    expect(integerColumn.type.name).toBe('bigint');

    await rollbackAndEnd();
  });
});
