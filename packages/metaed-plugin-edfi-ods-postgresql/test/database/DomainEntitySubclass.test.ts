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
} from '@edfi/metaed-core';
import { enhanceGenerateAndExecuteSql, rollbackAndEnd } from './DatabaseTestBase';

jest.setTimeout(40000);

describe('when core domain entity subclass has identity rename property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const domainEntityName = 'DomainEntityName';
  const domainEntityTableName = domainEntityName.toLowerCase();
  const domainEntitySubclassName = 'DomainEntitySubclassName';
  const domainEntitySubclassTableName = domainEntitySubclassName.toLowerCase();
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyColumnName1 = integerPropertyName1.toLowerCase();
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyColumnName2 = integerPropertyName2.toLowerCase();

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, `${namespaceName}.${domainEntityName}`)
      .withDocumentation('Documentation')
      .withIntegerIdentityRename(integerPropertyName2, integerPropertyName1, 'Documentation')
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));
  });

  it('should have domain entity table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName);
    expect(table).toBeDefined();

    await rollbackAndEnd();
  });

  it('should have standard resource columns', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntityTableName);

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

  it('should have domain entity subclass column', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName);
    const referenceColumn = table.columns.get(integerPropertyColumnName2);
    expect(referenceColumn.notNull).toBe(true);
    await rollbackAndEnd();
  });

  it('should have correct primary key', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(1);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(integerPropertyColumnName2);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(domainEntitySubclassTableName);

    expect(table.m2oRelations).toHaveLength(1);

    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(domainEntityTableName);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(integerPropertyColumnName2);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(integerPropertyColumnName1);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

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
});
