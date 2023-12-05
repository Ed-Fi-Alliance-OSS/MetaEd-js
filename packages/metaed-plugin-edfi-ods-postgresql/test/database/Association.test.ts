import { Db, Action, PrimaryKey } from 'pg-structure';
import {
  MetaEdEnvironment,
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  AssociationBuilder,
  EnumerationBuilder,
  Namespace,
} from '@edfi/metaed-core';
import { enhanceGenerateAndExecuteSql, rollbackAndEnd } from './DatabaseTestBase';

jest.setTimeout(40000);

describe('when association references two different domain entities', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const associationName = 'AssociationName';
  const tableName = associationName.toLowerCase();
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []));
  });

  it('should have association table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(tableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(tableName);

    expect(table.m2oRelations).toHaveLength(2);
    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(domainEntityTableName1);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.onDelete).toBe(Action.NoAction);

    const relation2 = table.m2oRelations[1];
    expect(relation2.targetTable.name).toBe(domainEntityTableName2);
    expect(relation2.foreignKey.columns).toHaveLength(1);
    expect(relation2.foreignKey.columns[0].name).toBe(integerPropertyColumnName2);
    expect(relation2.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation2.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName2);
    expect(relation2.foreignKey.onDelete).toBe(Action.NoAction);

    await rollbackAndEnd();
  });
});

describe('when association references the same domain entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const contextName = 'ContextName';
  const contextNameLower = contextName.toLowerCase();
  const associationName = 'AssociationName';
  const tableName = associationName.toLowerCase();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityTableName1 = domainEntityName1.toLowerCase();
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation(associationName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty(domainEntityName1, 'Documentation')
      .withAssociationDomainEntityProperty(domainEntityName1, 'Documentation', contextName)
      .withEndAssociation()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []));
  });

  it('should have association table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(tableName);
    expect(table).toBeDefined();

    await rollbackAndEnd();
  });

  it('should have domain entity primary keys as association primary key', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(tableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(2);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(contextNameLower + integerPropertyColumnName1);
    expect((table.primaryKey as PrimaryKey).columns[1].name).toBe(integerPropertyColumnName1);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(tableName);

    expect(table.m2oRelations).toHaveLength(2);
    const relation1 = table.m2oRelations[1];
    expect(relation1.targetTable.name).toBe(domainEntityTableName1);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.onDelete).toBe(Action.NoAction);

    const relation2 = table.m2oRelations[0];
    expect(relation2.targetTable.name).toBe(domainEntityTableName1);
    expect(relation2.foreignKey.columns).toHaveLength(1);
    expect(relation2.foreignKey.columns[0].name).toBe(contextNameLower + integerPropertyColumnName1);
    expect(relation2.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation2.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName1);
    expect(relation2.foreignKey.onDelete).toBe(Action.NoAction);

    await rollbackAndEnd();
  });
});

describe('when association has additional primary key simple properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const associationName = 'AssociationName';
  const tableName = associationName.toLowerCase();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const domainEntityName3 = 'DomainEntityName3';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyColumnName2 = integerPropertyName2.toLowerCase();
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyColumnName3 = integerPropertyName3.toLowerCase();
  const datePropertyName1 = 'DatePropertyName1';
  const datePropertyColumnName1 = datePropertyName1.toLowerCase();
  const datePropertyName2 = 'DatePropertyName2';
  const datePropertyColumnName2 = datePropertyName2.toLowerCase();
  const booleanPropertyName = 'BooleanPropertyName';
  const booleanPropertyColumnName = booleanPropertyName.toLowerCase();

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

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation(associationName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'Documentation')
      .withAssociationDomainEntityProperty(domainEntityName3, 'Documentation')
      .withDateIdentity(datePropertyName1, 'Documentation')
      .withDateProperty(datePropertyName2, 'Documentation', false, false)
      .withBooleanProperty(booleanPropertyName, 'Documentation', false, false)
      .withEndAssociation()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []));
  });

  it('should have association table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(tableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(tableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(4);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(datePropertyColumnName1);
    expect((table.primaryKey as PrimaryKey).columns[1].name).toBe(integerPropertyColumnName1);
    expect((table.primaryKey as PrimaryKey).columns[2].name).toBe(integerPropertyColumnName2);
    expect((table.primaryKey as PrimaryKey).columns[3].name).toBe(integerPropertyColumnName3);

    await rollbackAndEnd();
  });

  it('should have properties', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(tableName);
    expect(table.columns[4].name).toBe(datePropertyColumnName2);
    expect(table.columns[5].name).toBe(booleanPropertyColumnName);

    await rollbackAndEnd();
  });
});

describe('when association has additional primary key reference properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const associationName = 'AssociationName';
  const tableName = associationName.toLowerCase();
  const contextName = 'ContextName';
  const contextColumnName = contextName.toLowerCase();
  const enumerationName = 'EnumerationName';
  const enumerationColumnName = enumerationName.toLowerCase();
  const enumerationItemName = 'EnumerationItemName';
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityTableName1 = domainEntityName1.toLowerCase();
  const domainEntityName2 = 'DomainEntityName2';
  const domainEntityName3 = 'DomainEntityName3';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyColumnName2 = integerPropertyName2.toLowerCase();
  const stringPropertyName = 'StringPropertyName';
  const stringPropertyColumnName = stringPropertyName.toLowerCase();
  const datePropertyName1 = 'DatePropertyName1';
  const datePropertyColumnName1 = datePropertyName1.toLowerCase();

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartEnumeration(enumerationName)
      .withDocumentation('Documentation')
      .withEnumerationItem(enumerationItemName, 'Documentation')
      .withEndEnumeration()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withStringIdentity(stringPropertyName, 'Documentation', '60')
      .withEnumerationIdentity(enumerationName, 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation(associationName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'Documentation')
      .withAssociationDomainEntityProperty(domainEntityName3, 'Documentation', contextName)
      .withDateIdentity(datePropertyName1, 'Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withEndAssociation()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []));
  });

  it('should have primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(tableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(6);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(`${contextColumnName + enumerationColumnName}typeid`);
    expect((table.primaryKey as PrimaryKey).columns[1].name).toBe(contextColumnName + integerPropertyColumnName1);
    expect((table.primaryKey as PrimaryKey).columns[2].name).toBe(contextColumnName + stringPropertyColumnName);
    expect((table.primaryKey as PrimaryKey).columns[3].name).toBe(datePropertyColumnName1);
    expect((table.primaryKey as PrimaryKey).columns[4].name).toBe(integerPropertyColumnName1);
    expect((table.primaryKey as PrimaryKey).columns[5].name).toBe(integerPropertyColumnName2);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(tableName);

    expect(table.m2oRelations).toHaveLength(3);

    // test the first one
    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(domainEntityTableName1);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.onDelete).toBe(Action.NoAction);

    await rollbackAndEnd();
  });
});

describe('when association has overlapping primary key properties with domain entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const associationName = 'AssociationName';
  const tableName = associationName.toLowerCase();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const domainEntityTableName2 = domainEntityName2.toLowerCase();
  const domainEntityName3 = 'DomainEntityName3';
  const domainEntityTableName3 = domainEntityName3.toLowerCase();
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
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation(associationName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'Documentation')
      .withAssociationDomainEntityProperty(domainEntityName3, 'Documentation')
      .withEndAssociation()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []));
  });

  it('should have primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(tableName);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName1);
    expect((table.primaryKey as PrimaryKey).columns[1].name).toBe(integerPropertyColumnName2);
    expect((table.primaryKey as PrimaryKey).columns[2].name).toBe(integerPropertyColumnName3);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(tableName);

    expect(table.m2oRelations).toHaveLength(2);
    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(domainEntityTableName2);
    expect(relation1.foreignKey.columns).toHaveLength(2);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.columns[1].name).toBe(integerPropertyColumnName2);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(2);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.referencedColumns[1].name).toBe(integerPropertyColumnName2);
    expect(relation1.foreignKey.onDelete).toBe(Action.NoAction);

    const relation2 = table.m2oRelations[1];
    expect(relation2.targetTable.name).toBe(domainEntityTableName3);
    expect(relation2.foreignKey.columns).toHaveLength(2);
    expect(relation2.foreignKey.columns[0].name).toBe(integerPropertyColumnName1);
    expect(relation2.foreignKey.columns[1].name).toBe(integerPropertyColumnName3);
    expect(relation2.foreignKey.referencedColumns).toHaveLength(2);
    expect(relation2.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName1);
    expect(relation2.foreignKey.referencedColumns[1].name).toBe(integerPropertyColumnName3);
    expect(relation2.foreignKey.onDelete).toBe(Action.NoAction);

    await rollbackAndEnd();
  });
});

describe('when extension association references core domain entities', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const extension = 'Extension';
  const extensionSchemaName = extension.toLowerCase();
  const associationName = 'AssociationName';
  const tableName = associationName.toLowerCase();
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

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartAssociation(associationName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty(`${namespaceName}.${domainEntityName1}`, 'Documentation')
      .withAssociationDomainEntityProperty(`${namespaceName}.${domainEntityName2}`, 'Documentation')
      .withEndAssociation()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(namespaceName);
    if (coreNamespace == null) throw new Error();
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);
  });

  it('should have association table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(extensionSchemaName).tables.get(tableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(extensionSchemaName).tables.get(tableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(2);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName1);
    expect((table.primaryKey as PrimaryKey).columns[1].name).toBe(integerPropertyColumnName2);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(extensionSchemaName).tables.get(tableName);

    expect(table.m2oRelations).toHaveLength(2);
    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.fullName).toBe(`${schemaName}.${domainEntityTableName1}`);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.onDelete).toBe(Action.NoAction);

    const relation2 = table.m2oRelations[1];
    expect(relation2.targetTable.fullName).toBe(`${schemaName}.${domainEntityTableName2}`);
    expect(relation2.foreignKey.columns).toHaveLength(1);
    expect(relation2.foreignKey.columns[0].name).toBe(integerPropertyColumnName2);
    expect(relation2.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation2.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName2);
    expect(relation2.foreignKey.onDelete).toBe(Action.NoAction);

    await rollbackAndEnd();
  });

  it('should have standard resource columns', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(extensionSchemaName).tables.get(tableName);

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
});

describe('when extension association references extension domain entities', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const extension = 'Extension';
  const extensionSchemaName = extension.toLowerCase();
  const associationName = 'AssociationName';
  const tableName = associationName.toLowerCase();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const domainEntityTableName2 = domainEntityName2.toLowerCase();
  const domainEntityName3 = 'DomainEntityName3';
  const domainEntityTableName3 = domainEntityName3.toLowerCase();
  const integerPropertyName1 = 'IntegerPropertyName1';
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
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation(associationName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'Documentation')
      .withAssociationDomainEntityProperty(domainEntityName3, 'Documentation')
      .withEndAssociation()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []));
  });

  it('should have association table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(extensionSchemaName).tables.get(tableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(extensionSchemaName).tables.get(tableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(2);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName2);
    expect((table.primaryKey as PrimaryKey).columns[1].name).toBe(integerPropertyColumnName3);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(extensionSchemaName).tables.get(tableName);

    expect(table.m2oRelations).toHaveLength(2);
    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.fullName).toBe(`${extensionSchemaName}.${domainEntityTableName2}`);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName2);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName2);
    expect(relation1.foreignKey.onDelete).toBe(Action.NoAction);

    const relation2 = table.m2oRelations[1];
    expect(relation2.targetTable.fullName).toBe(`${extensionSchemaName}.${domainEntityTableName3}`);
    expect(relation2.foreignKey.columns).toHaveLength(1);
    expect(relation2.foreignKey.columns[0].name).toBe(integerPropertyColumnName3);
    expect(relation2.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation2.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName3);
    expect(relation2.foreignKey.onDelete).toBe(Action.NoAction);

    await rollbackAndEnd();
  });

  it('should have standard resource columns', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(extensionSchemaName).tables.get(tableName);

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
});
