import { Db, Action, PrimaryKey } from 'pg-structure';
import {
  MetaEdEnvironment,
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  AssociationBuilder,
  AssociationSubclassBuilder,
  Namespace,
} from '@edfi/metaed-core';
import { enhanceGenerateAndExecuteSql, rollbackAndEnd } from './DatabaseTestBase';

jest.setTimeout(40000);

describe('when association subclass has a single property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const associationName = 'AssociationName';
  const tableName = associationName.toLowerCase();
  const subclassName = 'SubclassName';
  const subclassTableName = subclassName.toLowerCase();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyColumnName2 = integerPropertyName2.toLowerCase();
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyColumnName3 = integerPropertyName3.toLowerCase();

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation(associationName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty(domainEntityName1, 'Documentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'Documentation')
      .withEndAssociation()

      .withStartAssociationSubclass(subclassName, associationName)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName3, 'Documentation', false, false)
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));
  });

  it('should have association subclass table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(subclassTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have association subclass column', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(subclassTableName);
    expect(table.columns.get(integerPropertyColumnName3)).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have domain entity primary keys as association primary key', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(subclassTableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(2);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName1);
    expect((table.primaryKey as PrimaryKey).columns[1].name).toBe(integerPropertyColumnName2);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const subclassTable = db.schemas.get(schemaName).tables.get(subclassTableName);

    expect(subclassTable.m2oRelations).toHaveLength(1);

    const relation1 = subclassTable.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(tableName);
    expect(relation1.foreignKey.columns).toHaveLength(2);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.columns[1].name).toBe(integerPropertyColumnName2);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(2);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.referencedColumns[1].name).toBe(integerPropertyColumnName2);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });

  it('should have standard resource columns on association', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(tableName);

    const idColumn = table.columns.get('id');
    expect(idColumn.notNull).toBe(true);
    expect(idColumn.type.name).toBe('uuid');
    expect(idColumn.default).toBe('gen_random_uuid()');

    const lastModifiedDateColumn = table.columns.get('lastmodifieddate');
    expect(lastModifiedDateColumn.notNull).toBe(true);
    expect(lastModifiedDateColumn.type.name).toBe('timestamp without time zone');
    expect(lastModifiedDateColumn.default).toBe('CURRENT_TIMESTAMP');

    const createDateColumn = table.columns.get('createdate');
    expect(createDateColumn.notNull).toBe(true);
    expect(createDateColumn.type.name).toBe('timestamp without time zone');
    expect(createDateColumn.default).toBe('CURRENT_TIMESTAMP');

    await rollbackAndEnd();
  });

  it('should not have standard resource columns on association subclass', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const subclassTable = db.schemas.get(schemaName).tables.get(subclassTableName);

    expect(() => subclassTable.columns.get('id')).toThrow();
    expect(() => subclassTable.columns.get('lastmodifieddate')).toThrow();
    expect(() => subclassTable.columns.get('createdate')).toThrow();

    await rollbackAndEnd();
  });
});

describe('when extension association subclasses core association', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const extension = 'Extension';
  const extensionSchemaName = extension.toLowerCase();
  const associationName = 'AssociationName';
  const tableName = associationName.toLowerCase();
  const subclassName = 'SubclassName';
  const subclassTableName = subclassName.toLowerCase();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyColumnName2 = integerPropertyName2.toLowerCase();
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyColumnName3 = integerPropertyName3.toLowerCase();

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation(associationName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty(domainEntityName1, 'Documentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'Documentation')
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartAssociationSubclass(subclassName, `${namespaceName}.${associationName}`)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName3, 'Documentation', false, false)
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(namespaceName);
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);
  });

  it('should have association subclass table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(extensionSchemaName).tables.get(subclassTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have association subclass column', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(extensionSchemaName).tables.get(subclassTableName);
    expect(table.columns.get(integerPropertyColumnName3)).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have domain entity primary keys as association primary key', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(extensionSchemaName).tables.get(subclassTableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(2);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName1);
    expect((table.primaryKey as PrimaryKey).columns[1].name).toBe(integerPropertyColumnName2);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const subclassTable = db.schemas.get(extensionSchemaName).tables.get(subclassTableName);

    expect(subclassTable.m2oRelations).toHaveLength(1);

    const relation1 = subclassTable.m2oRelations[0];
    expect(relation1.targetTable.fullName).toBe(`${schemaName}.${tableName}`);
    expect(relation1.foreignKey.columns).toHaveLength(2);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.columns[1].name).toBe(integerPropertyColumnName2);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(2);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.referencedColumns[1].name).toBe(integerPropertyColumnName2);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });

  it('should have standard resource columns on association', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(tableName);

    const idColumn = table.columns.get('id');
    expect(idColumn.notNull).toBe(true);
    expect(idColumn.type.name).toBe('uuid');
    expect(idColumn.default).toBe('gen_random_uuid()');

    const lastModifiedDateColumn = table.columns.get('lastmodifieddate');
    expect(lastModifiedDateColumn.notNull).toBe(true);
    expect(lastModifiedDateColumn.type.name).toBe('timestamp without time zone');
    expect(lastModifiedDateColumn.default).toBe('CURRENT_TIMESTAMP');

    const createDateColumn = table.columns.get('createdate');
    expect(createDateColumn.notNull).toBe(true);
    expect(createDateColumn.type.name).toBe('timestamp without time zone');
    expect(createDateColumn.default).toBe('CURRENT_TIMESTAMP');

    await rollbackAndEnd();
  });

  it('should not have standard resource columns on association subclass', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const subclassTable = db.schemas.get(extensionSchemaName).tables.get(subclassTableName);

    expect(() => subclassTable.columns.get('id')).toThrow();
    expect(() => subclassTable.columns.get('lastmodifieddate')).toThrow();
    expect(() => subclassTable.columns.get('createdate')).toThrow();

    await rollbackAndEnd();
  });
});
