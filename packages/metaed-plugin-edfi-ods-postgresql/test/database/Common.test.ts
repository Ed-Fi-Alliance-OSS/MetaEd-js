import { Db, Action, PrimaryKey } from 'pg-structure';
import {
  MetaEdEnvironment,
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  CommonBuilder,
} from '@edfi/metaed-core';
import { enhanceGenerateAndExecuteSql, rollbackAndEnd } from './DatabaseTestBase';

jest.setTimeout(40000);

describe('when common is a required property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const commonName = 'CommonName';
  const commonTableName = commonName.toLowerCase();
  const contextName = 'ContextName';
  const contextColumnName = contextName.toLowerCase();
  const domainEntityName = 'DomainEntityName';
  const domainEntityTableName = domainEntityName.toLowerCase();
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyColumnName2 = integerPropertyName2.toLowerCase();
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyColumnName3 = integerPropertyName3.toLowerCase();
  const integerPropertyName4 = 'IntegerPropertyName4';
  const integerPropertyColumnName4 = integerPropertyName4.toLowerCase();
  const integerPropertyName5 = 'IntegerPropertyName5';
  const integerPropertyColumnName5 = integerPropertyName5.toLowerCase();

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName1, 'Documentation', false, false)
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false, null, null, contextName)
      .withIntegerProperty(integerPropertyName3, 'Documentation', true, false)
      .withIntegerProperty(integerPropertyName4, 'Documentation', false, true)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName5, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));
  });

  it('should have domain entity table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have join table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have common properties', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);

    const optionalColumn = table.columns.get(integerPropertyColumnName1);
    expect(optionalColumn.notNull).toBe(false);

    const contextColumn = table.columns.get(contextColumnName + integerPropertyColumnName2);
    expect(contextColumn.notNull).toBe(false);

    const requiredColumn = table.columns.get(integerPropertyColumnName3);
    expect(requiredColumn.notNull).toBe(true);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);

    expect(table.m2oRelations).toHaveLength(1);

    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(domainEntityTableName);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName5);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName5);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });

  it('should have create date resource column', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);

    const createDateColumn = table.columns.get('createdate');
    expect(createDateColumn.notNull).toBe(true);
    expect(createDateColumn.type.name).toBe('timestamp without time zone');
    expect(createDateColumn.default).toBe('CURRENT_TIMESTAMP');

    await rollbackAndEnd();
  });

  it('should not have id and last modified date resource columns', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);
    expect(() => table.columns.get('id')).toThrow();
    expect(() => table.columns.get('lastmodifieddate')).toThrow();
  });

  it('should have join table for collection property', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas
      .get(schemaName)
      .tables.get(domainEntityTableName + commonTableName + integerPropertyColumnName4);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have correct primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas
      .get(schemaName)
      .tables.get(domainEntityTableName + commonTableName + integerPropertyColumnName4);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(2);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName4);
    expect((table.primaryKey as PrimaryKey).columns[1].name).toBe(integerPropertyColumnName5);

    await rollbackAndEnd();
  });

  it('should have collection property', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas
      .get(schemaName)
      .tables.get(domainEntityTableName + commonTableName + integerPropertyColumnName4);

    const collectionColumn = table.columns.get(integerPropertyColumnName4);
    expect(collectionColumn.notNull).toBe(true);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas
      .get(schemaName)
      .tables.get(domainEntityTableName + commonTableName + integerPropertyColumnName4);

    expect(table.m2oRelations).toHaveLength(1);

    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(domainEntityTableName + commonTableName);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName5);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName5);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });

  it('should have create date resource column', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas
      .get(schemaName)
      .tables.get(domainEntityTableName + commonTableName + integerPropertyColumnName4);

    const createDateColumn = table.columns.get('createdate');
    expect(createDateColumn.notNull).toBe(true);
    expect(createDateColumn.type.name).toBe('timestamp without time zone');
    expect(createDateColumn.default).toBe('CURRENT_TIMESTAMP');

    await rollbackAndEnd();
  });

  it('should not have id and last modified date resource columns', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas
      .get(schemaName)
      .tables.get(domainEntityTableName + commonTableName + integerPropertyColumnName4);

    expect(() => table.columns.get('id')).toThrow();
    expect(() => table.columns.get('lastmodifieddate')).toThrow();

    await rollbackAndEnd();
  });
});

describe('when common is a required property role name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const commonName = 'CommonName';
  const commonTableName = commonName.toLowerCase();
  const contextName1 = 'ContextName1';
  const contextColumnName1 = contextName1.toLowerCase();
  const contextName2 = 'ContextName2';
  const contextColumnName2 = contextName2.toLowerCase();
  const domainEntityName = 'DomainEntityName';
  const domainEntityTableName = domainEntityName.toLowerCase();
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyColumnName2 = integerPropertyName2.toLowerCase();
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyColumnName3 = integerPropertyName3.toLowerCase();
  const integerPropertyName4 = 'IntegerPropertyName4';
  const integerPropertyColumnName4 = integerPropertyName4.toLowerCase();
  const integerPropertyName5 = 'IntegerPropertyName5';
  const integerPropertyColumnName5 = integerPropertyName5.toLowerCase();

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName1, 'Documentation', false, false)
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false, null, null, contextName1)
      .withIntegerProperty(integerPropertyName3, 'Documentation', true, false)
      .withIntegerProperty(integerPropertyName4, 'Documentation', false, true)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName5, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', true, false, contextName2)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));
  });

  it('should have domain entity table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have join table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + contextColumnName2 + commonTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have common properties', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + contextColumnName2 + commonTableName);

    const optionalColumn = table.columns.get(integerPropertyColumnName1);
    expect(optionalColumn.notNull).toBe(false);

    const contextColumn = table.columns.get(contextColumnName1 + integerPropertyColumnName2);
    expect(contextColumn.notNull).toBe(false);

    const requiredColumn = table.columns.get(integerPropertyColumnName3);
    expect(requiredColumn.notNull).toBe(true);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + contextColumnName2 + commonTableName);

    expect(table.m2oRelations).toHaveLength(1);

    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(domainEntityTableName);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName5);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName5);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });

  it('should have create date resource column', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + contextColumnName2 + commonTableName);

    const createDateColumn = table.columns.get('createdate');
    expect(createDateColumn.notNull).toBe(true);
    expect(createDateColumn.type.name).toBe('timestamp without time zone');
    expect(createDateColumn.default).toBe('CURRENT_TIMESTAMP');

    await rollbackAndEnd();
  });

  it('should not have id and last modified date resource columns', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + contextColumnName2 + commonTableName);
    expect(() => table.columns.get('id')).toThrow();
    expect(() => table.columns.get('lastmodifieddate')).toThrow();
  });

  it('should have join table for collection property', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas
      .get(schemaName)
      .tables.get(domainEntityTableName + contextColumnName2 + commonTableName + integerPropertyColumnName4);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have correct primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas
      .get(schemaName)
      .tables.get(domainEntityTableName + contextColumnName2 + commonTableName + integerPropertyColumnName4);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(2);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName4);
    expect((table.primaryKey as PrimaryKey).columns[1].name).toBe(integerPropertyColumnName5);

    await rollbackAndEnd();
  });

  it('should have collection property', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas
      .get(schemaName)
      .tables.get(domainEntityTableName + contextColumnName2 + commonTableName + integerPropertyColumnName4);

    const collectionColumn = table.columns.get(integerPropertyColumnName4);
    expect(collectionColumn.notNull).toBe(true);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas
      .get(schemaName)
      .tables.get(domainEntityTableName + contextColumnName2 + commonTableName + integerPropertyColumnName4);

    expect(table.m2oRelations).toHaveLength(1);

    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(domainEntityTableName + contextColumnName2 + commonTableName);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName5);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName5);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });

  it('should have create date resource column', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas
      .get(schemaName)
      .tables.get(domainEntityTableName + contextColumnName2 + commonTableName + integerPropertyColumnName4);

    const createDateColumn = table.columns.get('createdate');
    expect(createDateColumn.notNull).toBe(true);
    expect(createDateColumn.type.name).toBe('timestamp without time zone');
    expect(createDateColumn.default).toBe('CURRENT_TIMESTAMP');

    await rollbackAndEnd();
  });

  it('should not have id and last modified date resource columns', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas
      .get(schemaName)
      .tables.get(domainEntityTableName + contextColumnName2 + commonTableName + integerPropertyColumnName4);

    expect(() => table.columns.get('id')).toThrow();
    expect(() => table.columns.get('lastmodifieddate')).toThrow();

    await rollbackAndEnd();
  });
});

describe('when common is an optional property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const commonName = 'CommonName';
  const commonTableName = commonName.toLowerCase();
  const domainEntityName = 'DomainEntityName';
  const domainEntityTableName = domainEntityName.toLowerCase();
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyColumnName2 = integerPropertyName2.toLowerCase();

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName1, 'Documentation', false, false)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', false, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));
  });

  it('should have domain entity table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have join table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have correct primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(1);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName2);

    await rollbackAndEnd();
  });

  it('should have common property', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);

    const optionalColumn = table.columns.get(integerPropertyColumnName1);
    expect(optionalColumn.notNull).toBe(false);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);

    expect(table.m2oRelations).toHaveLength(1);

    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(domainEntityTableName);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName2);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName2);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });
});

describe('when common is a required collection property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const commonName = 'CommonName';
  const commonTableName = commonName.toLowerCase();
  const domainEntityName = 'DomainEntityName';
  const domainEntityTableName = domainEntityName.toLowerCase();
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyColumnName2 = integerPropertyName2.toLowerCase();
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyColumnName3 = integerPropertyName3.toLowerCase();

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));
  });

  it('should have domain entity table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have join table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have common properties', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);

    const identityColumn = table.columns.get(integerPropertyColumnName1);
    expect(identityColumn.notNull).toBe(true);

    const optionalColumn = table.columns.get(integerPropertyColumnName2);
    expect(optionalColumn.notNull).toBe(false);

    await rollbackAndEnd();
  });

  it('should have correct primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(2);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName1);
    expect((table.primaryKey as PrimaryKey).columns[1].name).toBe(integerPropertyColumnName3);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);

    expect(table.m2oRelations).toHaveLength(1);

    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(domainEntityTableName);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName3);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName3);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });
});

describe('when common is an optional collection property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const commonName = 'CommonName';
  const commonTableName = commonName.toLowerCase();
  const domainEntityName = 'DomainEntityName';
  const domainEntityTableName = domainEntityName.toLowerCase();
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyColumnName2 = integerPropertyName2.toLowerCase();
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyColumnName3 = integerPropertyName3.toLowerCase();

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', false, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));
  });

  it('should have domain entity table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have join table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have common properties', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);

    const identityColumn = table.columns.get(integerPropertyColumnName1);
    expect(identityColumn.notNull).toBe(true);

    const optionalColumn = table.columns.get(integerPropertyColumnName2);
    expect(optionalColumn.notNull).toBe(false);

    await rollbackAndEnd();
  });

  it('should have correct primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(2);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName1);
    expect((table.primaryKey as PrimaryKey).columns[1].name).toBe(integerPropertyColumnName3);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);

    expect(table.m2oRelations).toHaveLength(1);

    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(domainEntityTableName);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName3);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName3);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });
});

describe('when common is a required property with primary key', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const commonName = 'CommonName';
  const commonTableName = commonName.toLowerCase();
  const domainEntityName = 'DomainEntityName';
  const domainEntityTableName = domainEntityName.toLowerCase();
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyColumnName2 = integerPropertyName2.toLowerCase();
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyColumnName3 = integerPropertyName3.toLowerCase();

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));
  });

  it('should have domain entity table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have join table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have common properties', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);

    const identityColumn = table.columns.get(integerPropertyColumnName1);
    expect(identityColumn.notNull).toBe(true);

    const optionalColumn = table.columns.get(integerPropertyColumnName2);
    expect(optionalColumn.notNull).toBe(false);

    await rollbackAndEnd();
  });

  it('should have correct primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(2);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName1);
    expect((table.primaryKey as PrimaryKey).columns[1].name).toBe(integerPropertyColumnName3);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName + commonTableName);

    expect(table.m2oRelations).toHaveLength(1);

    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(domainEntityTableName);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName3);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName3);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });
});

describe('when common has a domain entity property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const commonName = 'CommonName';
  const commonTableName = commonName.toLowerCase();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityTableName1 = domainEntityName1.toLowerCase();
  const domainEntityName2 = 'DomainEntityName2';
  const domainEntityTableName2 = domainEntityName2.toLowerCase();
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyColumnName2 = integerPropertyName2.toLowerCase();

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withDomainEntityProperty(domainEntityName1, 'Documentation', true, false)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));
  });

  it('should have domain entity table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName2);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have join table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName2 + commonTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have domain entity property', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName2 + commonTableName);

    const identityColumn = table.columns.get(integerPropertyColumnName1);
    expect(identityColumn.notNull).toBe(true);

    await rollbackAndEnd();
  });

  it('should have correct primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName2 + commonTableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(1);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName2);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName2 + commonTableName);

    expect(table.m2oRelations).toHaveLength(2);

    const relation1 = table.m2oRelations[1];
    expect(relation1.targetTable.name).toBe(domainEntityTableName2);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName2);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName2);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    const relation2 = table.m2oRelations[0];
    expect(relation2.targetTable.name).toBe(domainEntityTableName1);
    expect(relation2.foreignKey.columns).toHaveLength(1);
    expect(relation2.foreignKey.columns[0].name).toBe(integerPropertyColumnName1);
    expect(relation2.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation2.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName1);
    expect(relation2.foreignKey.onDelete).toBe(Action.NoAction);

    await rollbackAndEnd();
  });
});

describe('when common has a collection domain entity property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const commonName = 'CommonName';
  const commonTableName = commonName.toLowerCase();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityTableName1 = domainEntityName1.toLowerCase();
  const domainEntityName2 = 'DomainEntityName2';
  const domainEntityTableName2 = domainEntityName2.toLowerCase();
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyColumnName2 = integerPropertyName2.toLowerCase();

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withDomainEntityProperty(domainEntityName1, 'Documentation', true, true)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));
  });

  it('should have domain entity table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName2);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have join table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName2 + commonTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have correct primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName2 + commonTableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(1);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName2);

    await rollbackAndEnd();
  });

  it('should have collection table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName2 + commonTableName + domainEntityTableName1);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have domain entity property', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName2 + commonTableName + domainEntityTableName1);

    const identityColumn = table.columns.get(integerPropertyColumnName1);
    expect(identityColumn.notNull).toBe(true);

    await rollbackAndEnd();
  });

  it('should have correct primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName2 + commonTableName + domainEntityTableName1);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(2);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName1);
    expect((table.primaryKey as PrimaryKey).columns[1].name).toBe(integerPropertyColumnName2);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName2 + commonTableName + domainEntityTableName1);

    expect(table.m2oRelations).toHaveLength(2);

    const relation1 = table.m2oRelations[1];
    expect(relation1.targetTable.name).toBe(domainEntityTableName2 + commonTableName);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName2);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName2);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    const relation2 = table.m2oRelations[0];
    expect(relation2.targetTable.name).toBe(domainEntityTableName1);
    expect(relation2.foreignKey.columns).toHaveLength(1);
    expect(relation2.foreignKey.columns[0].name).toBe(integerPropertyColumnName1);
    expect(relation2.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation2.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName1);
    expect(relation2.foreignKey.onDelete).toBe(Action.NoAction);

    await rollbackAndEnd();
  });
});

describe('when common has a common property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const commonName1 = 'CommonName1';
  const commonTableName1 = commonName1.toLowerCase();
  const commonName2 = 'CommonName2';
  const commonTableName2 = commonName2.toLowerCase();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityTableName1 = domainEntityName1.toLowerCase();
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyColumnName2 = integerPropertyName2.toLowerCase();
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyColumnName3 = integerPropertyName3.toLowerCase();

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName1)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName1, 'Documentation', true, false)
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false)
      .withEndCommon()

      .withStartCommon(commonName2)
      .withDocumentation('Documentation')
      .withCommonProperty(commonName1, 'Documentation', true, true)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withCommonProperty(commonName2, 'Documentation', false, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));
  });

  it('should have domain entity table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have join table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1 + commonTableName2);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have correct primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1 + commonTableName2);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(1);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName3);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1 + commonTableName2);

    expect(table.m2oRelations).toHaveLength(1);

    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(domainEntityTableName1);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName3);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName3);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });

  it('should have join table for nested common', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1 + commonTableName2 + commonTableName1);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have nested common properties', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1 + commonTableName2 + commonTableName1);

    const requiredColumn = table.columns.get(integerPropertyColumnName1);
    expect(requiredColumn.notNull).toBe(true);

    const optionalColumn = table.columns.get(integerPropertyColumnName2);
    expect(optionalColumn.notNull).toBe(false);

    await rollbackAndEnd();
  });

  it('should have correct primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1 + commonTableName2 + commonTableName1);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(1);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName3);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1 + commonTableName2 + commonTableName1);

    expect(table.m2oRelations).toHaveLength(1);

    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(domainEntityTableName1 + commonTableName2);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName3);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName3);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });
});

describe('when common has a collection common property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const commonName1 = 'CommonName1';
  const commonTableName1 = commonName1.toLowerCase();
  const commonName2 = 'CommonName2';
  const commonTableName2 = commonName2.toLowerCase();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityTableName1 = domainEntityName1.toLowerCase();
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyColumnName2 = integerPropertyName2.toLowerCase();
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyColumnName3 = integerPropertyName3.toLowerCase();

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false)
      .withEndCommon()

      .withStartCommon(commonName2)
      .withDocumentation('Documentation')
      .withCommonProperty(commonName1, 'Documentation', true, true)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withCommonProperty(commonName2, 'Documentation', false, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));
  });

  it('should have domain entity table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have join table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1 + commonTableName2);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have correct primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1 + commonTableName2);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(1);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName3);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1 + commonTableName2);

    expect(table.m2oRelations).toHaveLength(1);

    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(domainEntityTableName1);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName3);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName3);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });

  it('should have join table for nested common', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1 + commonTableName2 + commonTableName1);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have nested common properties', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1 + commonTableName2 + commonTableName1);

    const requiredColumn = table.columns.get(integerPropertyColumnName1);
    expect(requiredColumn.notNull).toBe(true);

    const optionalColumn = table.columns.get(integerPropertyColumnName2);
    expect(optionalColumn.notNull).toBe(false);

    await rollbackAndEnd();
  });

  it('should have correct primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1 + commonTableName2 + commonTableName1);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(2);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName1);
    expect((table.primaryKey as PrimaryKey).columns[1].name).toBe(integerPropertyColumnName3);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1 + commonTableName2 + commonTableName1);

    expect(table.m2oRelations).toHaveLength(1);

    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(domainEntityTableName1 + commonTableName2);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName3);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName3);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });
});

describe('when common has an inline common property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const commonName1 = 'CommonName1';
  const commonTableName1 = commonName1.toLowerCase();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityTableName1 = domainEntityName1.toLowerCase();
  const inlineCommonName = 'InlineCommonName';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyColumnName2 = integerPropertyName2.toLowerCase();
  const integerPropertyName3 = 'IntegerPropertyName3';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartInlineCommon(inlineCommonName)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName1, 'Documentation', true, false)
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false)
      .withEndInlineCommon()

      .withStartCommon(commonName1)
      .withDocumentation('Documentation')
      .withInlineCommonProperty(inlineCommonName, 'Documentation', false, false)
      .withEndCommon()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withCommonProperty(commonName1, 'Documentation', true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));
  });

  it('should have join table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1 + commonTableName1);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have inline common properties', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1 + commonTableName1);

    const requiredColumn = table.columns.get(integerPropertyColumnName1);
    expect(requiredColumn.notNull).toBe(false);

    const optionalColumn = table.columns.get(integerPropertyColumnName2);
    expect(optionalColumn.notNull).toBe(false);

    await rollbackAndEnd();
  });
});

describe('when common has name that starts with another entities name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const commonName1 = 'EntityNameCommonName';
  const commonTableName1 = commonName1.toLowerCase();
  const domainEntityName1 = 'EntityName';
  const domainEntityTableName1 = domainEntityName1.toLowerCase();
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withCommonProperty(commonName1, 'Documentation', true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));
  });

  it('should have domain entity table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have join table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(commonTableName1);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });
});

describe('when common has name that overlaps with another entities name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const commonName = 'OverlapCommonName';
  const domainEntityName = 'EntityNameOverlap';
  const domainEntityTableName = domainEntityName.toLowerCase();
  const overlappedName = 'EntityNameOverlapCommonName';
  const overlappedTableName = overlappedName.toLowerCase();
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));
  });

  it('should have domain entity table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have join table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(overlappedTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });
});

describe('when common has overlapping property names with another entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const commonName1 = 'CommonName1';
  const commonTableName1 = commonName1.toLowerCase();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityTableName1 = domainEntityName1.toLowerCase();
  const domainEntityName2 = 'DomainEntityName2';
  const domainEntityTableName2 = domainEntityName2.toLowerCase();
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyColumnName2 = integerPropertyName2.toLowerCase();
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyColumnName3 = integerPropertyName3.toLowerCase();

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon(commonName1)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(domainEntityName2, 'Documentation')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withCommonProperty(commonName1, 'Documentation', true, true)
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));
  });

  it('should have domain entity table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have join table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1 + commonTableName1);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have correct primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1 + commonTableName1);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(3);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName1);
    expect((table.primaryKey as PrimaryKey).columns[1].name).toBe(integerPropertyColumnName2);
    expect((table.primaryKey as PrimaryKey).columns[2].name).toBe(integerPropertyColumnName3);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName1 + commonTableName1);

    expect(table.m2oRelations).toHaveLength(2);

    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(domainEntityTableName1);
    expect(relation1.foreignKey.columns).toHaveLength(2);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.columns[1].name).toBe(integerPropertyColumnName2);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(2);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.referencedColumns[1].name).toBe(integerPropertyColumnName2);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    const relation2 = table.m2oRelations[1];
    expect(relation2.targetTable.name).toBe(domainEntityTableName2);
    expect(relation2.foreignKey.columns).toHaveLength(2);
    expect(relation2.foreignKey.columns[0].name).toBe(integerPropertyColumnName2);
    expect(relation2.foreignKey.columns[1].name).toBe(integerPropertyColumnName3);
    expect(relation2.foreignKey.referencedColumns).toHaveLength(2);
    expect(relation2.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName2);
    expect(relation2.foreignKey.referencedColumns[1].name).toBe(integerPropertyColumnName3);
    expect(relation2.foreignKey.onDelete).toBe(Action.NoAction);

    await rollbackAndEnd();
  });
});
