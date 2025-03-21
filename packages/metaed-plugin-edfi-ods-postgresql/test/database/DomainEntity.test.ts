// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Db, Action, PrimaryKey } from 'pg-structure';
import {
  MetaEdEnvironment,
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  DomainEntitySubclassBuilder,
  CommonBuilder,
  DescriptorBuilder,
  newPluginEnvironment,
} from '@edfi/metaed-core';
import { enhanceGenerateAndExecuteSql, rollbackAndEnd } from './DatabaseTestBase';

jest.setTimeout(40000);

describe('when creating domain entity based on abstract entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const abstractEntityName = 'AbstractEntityName';
  const abstractEntityTableName = abstractEntityName.toLowerCase();
  const domainEntitySubclassName = 'DomainEntitySubclassName';
  const domainEntitySubclassTableName = domainEntitySubclassName.toLowerCase();
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyColumnName2 = integerPropertyName2.toLowerCase();
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyColumnName3 = integerPropertyName3.toLowerCase();

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartAbstractEntity(abstractEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false)
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, abstractEntityName)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName3, 'Documentation', false, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));
  });

  it('should have abstract entity table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(abstractEntityTableName);
    expect(table).toBeDefined();

    await rollbackAndEnd();
  });

  it('should have correct columns', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(abstractEntityTableName);

    const identityColumn = table.columns.get(integerPropertyColumnName1);
    expect(identityColumn.notNull).toBe(true);
    expect(identityColumn.type.name).toBe('integer');

    const optionalColumn = table.columns.get(integerPropertyColumnName2);
    expect(optionalColumn.notNull).toBe(false);
    expect(optionalColumn.type.name).toBe('integer');

    await rollbackAndEnd();
  });

  it('should have correct primary key', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(abstractEntityTableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(1);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName1);

    await rollbackAndEnd();
  });

  it('should have standard resource columns', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(abstractEntityTableName);

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

  it('should have subclass table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName);
    expect(table).toBeDefined();

    await rollbackAndEnd();
  });

  it('should have correct subclass columns', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName);

    const referenceColumn = table.columns.get(integerPropertyColumnName1);
    expect(referenceColumn.notNull).toBe(true);
    expect(referenceColumn.type.name).toBe('integer');

    const optionalColumn = table.columns.get(integerPropertyColumnName3);
    expect(optionalColumn.notNull).toBe(false);
    expect(optionalColumn.type.name).toBe('integer');

    await rollbackAndEnd();
  });

  it('should not have standard resource columns', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName);
    expect(() => table.columns.get('id')).toThrow();
    expect(() => table.columns.get('lastmodifieddate')).toThrow();
    expect(() => table.columns.get('createdate')).toThrow();
    await rollbackAndEnd();
  });

  it('should have correct subclass primary key', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(1);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName1);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName);

    expect(table.m2oRelations).toHaveLength(1);

    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(abstractEntityTableName);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });
});

describe('when creating domain entity based on abstract entity with ODS/API 7.2+', (): void => {
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '5.0.0' };
  metaEd.plugin.set('edfiOdsPostgresql', { ...newPluginEnvironment(), targetTechnologyVersion: '7.2.0' });
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const abstractEntityName = 'AbstractEntityName';
  const abstractEntityTableName = abstractEntityName.toLowerCase();
  const domainEntitySubclassName = 'DomainEntitySubclassName';
  const domainEntitySubclassTableName = domainEntitySubclassName.toLowerCase();
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyColumnName2 = integerPropertyName2.toLowerCase();
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyColumnName3 = integerPropertyName3.toLowerCase();

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartAbstractEntity(abstractEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false)
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, abstractEntityName)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName3, 'Documentation', false, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));
  });

  it('should have abstract entity table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(abstractEntityTableName);
    expect(table).toBeDefined();

    await rollbackAndEnd();
  });

  it('should have correct columns', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(abstractEntityTableName);

    const identityColumn = table.columns.get(integerPropertyColumnName1);
    expect(identityColumn.notNull).toBe(true);
    expect(identityColumn.type.name).toBe('integer');

    const optionalColumn = table.columns.get(integerPropertyColumnName2);
    expect(optionalColumn.notNull).toBe(false);
    expect(optionalColumn.type.name).toBe('integer');

    await rollbackAndEnd();
  });

  it('should have correct primary key', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(abstractEntityTableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(1);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName1);

    await rollbackAndEnd();
  });

  it('should have standard resource columns', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(abstractEntityTableName);

    const idColumn = table.columns.get('id');
    expect(idColumn.notNull).toBe(true);
    expect(idColumn.type.name).toBe('uuid');
    expect(idColumn.default).toBe('gen_random_uuid()');

    // Apparently Postgresql returns either one depending on version for utc current timestamp
    const expectedUtcNowPossiblities = [
      "timezone('UTC'::text, CURRENT_TIMESTAMP)",
      "(CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text)",
    ];

    const lastModifiedDateColumn = table.columns.get('lastmodifieddate');
    expect(lastModifiedDateColumn.notNull).toBe(true);
    expect(lastModifiedDateColumn.type.name).toBe('timestamp without time zone');
    expect(expectedUtcNowPossiblities).toContain(lastModifiedDateColumn.default);

    const createDateColumn = table.columns.get('createdate');
    expect(createDateColumn.notNull).toBe(true);
    expect(createDateColumn.type.name).toBe('timestamp without time zone');
    expect(expectedUtcNowPossiblities).toContain(createDateColumn.default);

    await rollbackAndEnd();
  });

  it('should have subclass table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName);
    expect(table).toBeDefined();

    await rollbackAndEnd();
  });

  it('should have correct subclass columns', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName);

    const referenceColumn = table.columns.get(integerPropertyColumnName1);
    expect(referenceColumn.notNull).toBe(true);
    expect(referenceColumn.type.name).toBe('integer');

    const optionalColumn = table.columns.get(integerPropertyColumnName3);
    expect(optionalColumn.notNull).toBe(false);
    expect(optionalColumn.type.name).toBe('integer');

    await rollbackAndEnd();
  });

  it('should not have standard resource columns', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName);
    expect(() => table.columns.get('id')).toThrow();
    expect(() => table.columns.get('lastmodifieddate')).toThrow();
    expect(() => table.columns.get('createdate')).toThrow();
    await rollbackAndEnd();
  });

  it('should have correct subclass primary key', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(1);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName1);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName);

    expect(table.m2oRelations).toHaveLength(1);

    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(abstractEntityTableName);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });
});

describe('when creating domain entity based on abstract entity with identity rename', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const abstractEntityName = 'AbstractEntityName';
  const abstractEntityTableName = abstractEntityName.toLowerCase();
  const domainEntitySubclassName = 'DomainEntitySubclassName';
  const domainEntitySubclassTableName = domainEntitySubclassName.toLowerCase();
  const stringPropertyName = 'StringPropertyName';
  const stringPropertyColumnName = stringPropertyName.toLowerCase();
  const stringPropertyRename = 'StringPropertyRename';
  const stringPropertyRenameColumnName = stringPropertyRename.toLowerCase();
  const maxLength = 10;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartAbstractEntity(abstractEntityName)
      .withDocumentation('Documentation')
      .withStringIdentity(stringPropertyName, 'Documentation', maxLength.toString())
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, abstractEntityName)
      .withDocumentation('Documentation')
      .withStringIdentityRename(stringPropertyRename, stringPropertyName, 'Documentation', maxLength.toString())
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));
  });

  it('should have abstract entity table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(abstractEntityTableName);
    expect(table).toBeDefined();

    await rollbackAndEnd();
  });

  it('should have identity column', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(abstractEntityTableName);

    const identityColumn = table.columns.get(stringPropertyColumnName);
    expect(identityColumn.notNull).toBe(true);
    expect(identityColumn.type.name).toBe('character varying');
    expect(identityColumn.length).toBe(maxLength);

    await rollbackAndEnd();
  });

  it('should have correct primary key', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(abstractEntityTableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(1);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(stringPropertyColumnName);

    await rollbackAndEnd();
  });

  it('should have subclass table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName);
    expect(table).toBeDefined();

    await rollbackAndEnd();
  });

  it('should have identity rename column', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName);

    const identityRenameColumn = table.columns.get(stringPropertyRenameColumnName);
    expect(identityRenameColumn.notNull).toBe(true);
    expect(identityRenameColumn.type.name).toBe('character varying');
    expect(identityRenameColumn.length).toBe(maxLength);

    await rollbackAndEnd();
  });

  it('should have correct subclass primary key', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(1);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(stringPropertyRenameColumnName);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName);

    expect(table.m2oRelations).toHaveLength(1);

    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(abstractEntityTableName);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(stringPropertyRenameColumnName);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(stringPropertyColumnName);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });
});

describe('when domain entity based on abstract entity both have collection properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const abstractEntityName = 'AbstractEntityName';
  const abstractEntityTableName = abstractEntityName.toLowerCase();
  const domainEntitySubclassName = 'DomainEntitySubclassName';
  const domainEntitySubclassTableName = domainEntitySubclassName.toLowerCase();
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyColumnName2 = integerPropertyName2.toLowerCase();
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyColumnName3 = integerPropertyName3.toLowerCase();
  const commonName = 'CommonName';
  const commonTableName = commonName.toLowerCase();
  const descriptorName = 'DescriptorName';
  const descriptorTableName = descriptorName.toLowerCase();
  const descriptorColumnName = `${descriptorName.toLowerCase()}descriptorid`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(descriptorName)
      .withDocumentation('Documentation')
      .withEndDescriptor()

      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withIntegerProperty(integerPropertyName2, 'Documentation', false, false)
      .withEndCommon()

      .withStartAbstractEntity(abstractEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withCommonProperty(commonName, 'Documentation', false, true)
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, abstractEntityName)
      .withDocumentation('Documentation')
      .withDescriptorProperty(descriptorName, 'Documentation', false, true)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));
  });

  it('should have common collection table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(abstractEntityTableName + commonTableName);
    expect(table).toBeDefined();

    await rollbackAndEnd();
  });

  it('should have correct columns', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(abstractEntityTableName + commonTableName);

    const identityColumn = table.columns.get(integerPropertyColumnName1);
    expect(identityColumn.notNull).toBe(true);
    expect(identityColumn.type.name).toBe('integer');

    const optionalColumn = table.columns.get(integerPropertyColumnName2);
    expect(optionalColumn.notNull).toBe(false);
    expect(optionalColumn.type.name).toBe('integer');

    await rollbackAndEnd();
  });

  it('should have correct primary key', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(abstractEntityTableName + commonTableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(2);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName1);
    expect((table.primaryKey as PrimaryKey).columns[1].name).toBe(integerPropertyColumnName3);

    await rollbackAndEnd();
  });

  it('should have descriptor collection table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName + descriptorTableName);
    expect(table).toBeDefined();

    await rollbackAndEnd();
  });

  it('should have identity rename column', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName + descriptorTableName);

    const descriptorColumn = table.columns.get(descriptorColumnName);
    expect(descriptorColumn.notNull).toBe(true);
    expect(descriptorColumn.type.name).toBe('integer');

    const identityColumn = table.columns.get(integerPropertyColumnName3);
    expect(identityColumn.notNull).toBe(true);
    expect(identityColumn.type.name).toBe('integer');

    await rollbackAndEnd();
  });

  it('should have correct primary key', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName + descriptorTableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(2);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(descriptorColumnName);
    expect((table.primaryKey as PrimaryKey).columns[1].name).toBe(integerPropertyColumnName3);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship to common table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(abstractEntityTableName + commonTableName);

    expect(table.m2oRelations).toHaveLength(1);

    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(abstractEntityTableName);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName3);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName3);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship to descriptor table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName + descriptorTableName);

    expect(table.m2oRelations).toHaveLength(2);

    // skip checking 1st FK to base descriptor table

    const relation1 = table.m2oRelations[1];
    expect(relation1.targetTable.name).toBe(domainEntitySubclassTableName);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName3);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName3);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });
});
