import { Db, PrimaryKey, Action } from 'pg-structure';
import {
  MetaEdEnvironment,
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DescriptorBuilder,
} from '@edfi/metaed-core';
import { enhanceGenerateAndExecuteSql, rollbackAndEnd } from './DatabaseTestBase';

jest.setTimeout(40000);

describe('when descriptor is defined', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const baseDescriptorTableName = 'descriptor';
  const descriptorName = 'DescriptorName';

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(descriptorName)
      .withDocumentation('Documentation')
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));
  });

  it('should have base descriptor table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(baseDescriptorTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have table documentation', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(baseDescriptorTableName);
    expect(table.comment).toBe('This is the base entity for the descriptor pattern.');
    await rollbackAndEnd();
  });

  it('should have standard descriptor columns', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(baseDescriptorTableName);

    const descriptorIdColumn = table.columns.get('descriptorid');
    expect(descriptorIdColumn.notNull).toBe(true);
    expect(descriptorIdColumn.type.name).toBe('integer');
    expect(descriptorIdColumn.isPrimaryKey).toBe(true);
    expect(descriptorIdColumn.comment).toBe(
      'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.',
    );

    const namespaceColumn = table.columns.get('namespace');
    expect(namespaceColumn.notNull).toBe(true);
    expect(namespaceColumn.type.name).toBe('character varying');
    expect(namespaceColumn.length).toBe(255);
    expect(namespaceColumn.comment).toBe(
      'A globally unique namespace that identifies this descriptor set. Author is strongly encouraged to use the Universal Resource Identifier (http, ftp, file, etc.) for the source of the descriptor definition. Best practice is for this source to be the descriptor file itself, so that it can be machine-readable and be fetched in real-time, if necessary.',
    );

    const codeValueColumn = table.columns.get('codevalue');
    expect(codeValueColumn.notNull).toBe(true);
    expect(codeValueColumn.type.name).toBe('character varying');
    expect(codeValueColumn.length).toBe(50);
    expect(codeValueColumn.comment).toBe('A code or abbreviation that is used to refer to the descriptor.');

    const shortDescriptionColumn = table.columns.get('shortdescription');
    expect(shortDescriptionColumn.notNull).toBe(true);
    expect(shortDescriptionColumn.type.name).toBe('character varying');
    expect(shortDescriptionColumn.length).toBe(75);
    expect(shortDescriptionColumn.comment).toBe('A shortened description for the descriptor.');

    const descriptionColumn = table.columns.get('description');
    expect(descriptionColumn.notNull).toBe(false);
    expect(descriptionColumn.type.name).toBe('character varying');
    expect(descriptionColumn.length).toBe(1024);
    expect(descriptionColumn.comment).toBe('The description of the descriptor.');

    const priorDescriptorIdColumn = table.columns.get('priordescriptorid');
    expect(priorDescriptorIdColumn.notNull).toBe(false);
    expect(priorDescriptorIdColumn.type.name).toBe('integer');
    expect(priorDescriptorIdColumn.comment).toBe(
      'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.',
    );

    const effectiveBeginDateColumn = table.columns.get('effectivebegindate');
    expect(effectiveBeginDateColumn.notNull).toBe(false);
    expect(effectiveBeginDateColumn.type.name).toBe('date');
    expect(effectiveBeginDateColumn.comment).toBe(
      'The beginning date of the period when the descriptor is in effect. If omitted, the default is immediate effectiveness.',
    );

    const effectiveEndDateColumn = table.columns.get('effectiveenddate');
    expect(effectiveEndDateColumn.notNull).toBe(false);
    expect(effectiveEndDateColumn.type.name).toBe('date');
    expect(effectiveEndDateColumn.comment).toBe('The end date of the period when the descriptor is in effect.');
  });

  it('should have correct primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(baseDescriptorTableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(1);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe('descriptorid');

    await rollbackAndEnd();
  });

  it('should have alternate keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(baseDescriptorTableName);
    expect(table.uniqueConstraints.length).toBe(1);
    expect(table.uniqueConstraints[0].columns[0].name).toBe('codevalue');
    expect(table.uniqueConstraints[0].columns[1].name).toBe('namespace');
    await rollbackAndEnd();
  });

  it('should have standard resource columns', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(baseDescriptorTableName);

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

describe('when descriptor does not have a map type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const baseDescriptorTableName = 'descriptor';
  const descriptorDocumentation = `This is the documentation\nfor the descriptor with 'some' ""special"" --characters--.`;
  const descriptorName = 'DescriptorName';
  const descriptorTableName: string = descriptorName.toLowerCase() + baseDescriptorTableName;
  const descriptorIdColumnName = `${descriptorTableName}id`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(descriptorName)
      .withDocumentation(descriptorDocumentation)
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));
  });

  it('should have descriptor table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(descriptorTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have table documentation', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(descriptorTableName);
    expect(table.comment).toBe(descriptorDocumentation.replace(/""/g, '"'));
    await rollbackAndEnd();
  });

  it('should have descriptor id column', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(descriptorTableName);
    const descriptorIdColumn = table.columns.get(descriptorIdColumnName);
    expect(descriptorIdColumn.notNull).toBe(true);
    expect(descriptorIdColumn.type.name).toBe('integer');
    expect(descriptorIdColumn.isPrimaryKey).toBe(true);
    expect(descriptorIdColumn.comment).toBe(
      'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.',
    );

    await rollbackAndEnd();
  });

  it('should have correct primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(descriptorTableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(1);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(descriptorIdColumnName);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(descriptorTableName);

    expect(table.m2oRelations).toHaveLength(1);

    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(baseDescriptorTableName);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(descriptorIdColumnName);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(`${baseDescriptorTableName}id`);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });

  it('should not have map type table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    expect(() => db.schemas.get(schemaName).tables.get(`${descriptorName}Type`)).toThrow();
  });

  it('should not have map type foreign key column', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(descriptorTableName);

    expect(() => table.columns.get(`${baseDescriptorTableName}TypeId`)).toThrow();
  });
});

describe('when descriptor name has type suffix', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const schemaName = namespaceName.toLowerCase();
  const baseDescriptorTableName = 'descriptor';
  const descriptorDocumentation = 'DescriptorDocumentation';
  const descriptorName = 'DescriptorNameType';
  const descriptorTableName: string = descriptorName.toLowerCase() + baseDescriptorTableName;
  const descriptorIdColumnName = `${descriptorTableName}id`;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor(descriptorName)
      .withDocumentation(descriptorDocumentation)
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));
  });

  it('should have descriptor table', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(descriptorTableName);
    expect(table).toBeDefined();
    await rollbackAndEnd();
  });

  it('should have descriptor id column', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(descriptorTableName);
    const descriptorIdColumn = table.columns.get(descriptorIdColumnName);
    expect(descriptorIdColumn.notNull).toBe(true);
    await rollbackAndEnd();
  });

  it('should have correct primary keys', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(descriptorTableName);
    expect((table.primaryKey as PrimaryKey).columns).toHaveLength(1);
    expect((table.primaryKey as PrimaryKey).columns[0].name).toBe(descriptorIdColumnName);

    await rollbackAndEnd();
  });

  it('should have correct foreign key relationship', async () => {
    const db: Db = (await enhanceGenerateAndExecuteSql(metaEd)) as Db;
    const table = db.schemas.get(schemaName).tables.get(descriptorTableName);

    expect(table.m2oRelations).toHaveLength(1);

    const relation1 = table.m2oRelations[0];
    expect(relation1.targetTable.name).toBe(baseDescriptorTableName);
    expect(relation1.foreignKey.columns).toHaveLength(1);
    expect(relation1.foreignKey.columns[0].name).toBe(descriptorIdColumnName);
    expect(relation1.foreignKey.referencedColumns).toHaveLength(1);
    expect(relation1.foreignKey.referencedColumns[0].name).toBe(`${baseDescriptorTableName}id`);
    expect(relation1.foreignKey.onDelete).toBe(Action.Cascade);

    await rollbackAndEnd();
  });
});
