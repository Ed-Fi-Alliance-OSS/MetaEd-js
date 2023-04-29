import { Enumeration, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { addEntityForNamespace, newEnumeration, newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { tableEntities } from '../../../src/enhancer/EnhancerHelper';
import { enhance } from '../../../src/enhancer/table/EnumerationTableEnhancer';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../../src/model/EdFiOdsRelationalEntityRepository';

describe('when EnumerationTableEnhancer enhances enumeration', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const enumerationName = 'EnumerationName';
  const enumerationNameType = `${enumerationName}Type`;
  const enumerationDocumentation = 'EnumerationDocumentation';

  beforeAll(() => {
    const enumeration: Enumeration = Object.assign(newEnumeration(), {
      metaEdName: enumerationName,
      documentation: enumerationDocumentation,
      namespace,
      data: {
        edfiOdsRelational: {
          odsTables: [],
        },
      },
    });

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    addEntityForNamespace(enumeration);
    enhance(metaEd);
  });

  it('should create table', (): void => {
    const table = tableEntities(metaEd, namespace).get(enumerationNameType) as any;
    expect(table).toBeDefined();
    expect(table.tableId).toBe(enumerationNameType);
    expect(table.schema).toBe('edfi');
    expect(table.description).toBe(enumerationDocumentation);
  });

  it('should have four columns', (): void => {
    const table = tableEntities(metaEd, namespace).get(enumerationNameType) as any;
    expect(table.columns).toHaveLength(4);
  });

  it('should have one primary key', (): void => {
    const table = tableEntities(metaEd, namespace).get(enumerationNameType) as any;
    expect(table.columns[0].columnId).toBe(`${enumerationNameType}Id`);
    expect(table.columns[0].isIdentityDatabaseType).toBe(true);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
    expect(table.columns[0].isNullable).toBe(false);
    expect(table.columns[table.columns.length - 1].description).not.toBe('');
  });

  it('should have code value column', (): void => {
    const table = tableEntities(metaEd, namespace).get(enumerationNameType) as any;
    const column = table.columns.filter((x) => x.columnId === 'CodeValue')[0];
    expect(column).toBeDefined();
    expect(column.maxLength).toBe('50');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });

  it('should have description column', (): void => {
    const table = tableEntities(metaEd, namespace).get(enumerationNameType) as any;
    const column = table.columns.filter((x) => x.columnId === 'Description')[0];
    expect(column).toBeDefined();
    expect(column.maxLength).toBe('1024');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });

  it('should have short description column', (): void => {
    const table = tableEntities(metaEd, namespace).get(enumerationNameType) as any;
    const column = table.columns.filter((x) => x.columnId === 'ShortDescription')[0];
    expect(column).toBeDefined();
    expect(column.maxLength).toBe('450');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });
});

describe("when EnumerationTableEnhancer enhances enumeration name ending with 'Type'", () => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const enumerationNameType = 'EnumerationNameType';
  const enumerationDocumentation = 'EnumerationDocumentation';

  beforeAll(() => {
    const enumeration: Enumeration = Object.assign(newEnumeration(), {
      metaEdName: enumerationNameType,
      documentation: enumerationDocumentation,
      namespace,
      data: {
        edfiOdsRelational: {
          odsTables: [],
        },
      },
    });

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    addEntityForNamespace(enumeration);
    enhance(metaEd);
  });

  it('should create table', (): void => {
    const table = tableEntities(metaEd, namespace).get(enumerationNameType) as any;
    expect(table).toBeDefined();
    expect(table.tableId).toBe(enumerationNameType);
    expect(table.schema).toBe('edfi');
    expect(table.description).toBe(enumerationDocumentation);
  });

  it('should have four columns', (): void => {
    const table = tableEntities(metaEd, namespace).get(enumerationNameType) as any;
    expect(table.columns).toHaveLength(4);
  });

  it('should have one primary key', (): void => {
    const table = tableEntities(metaEd, namespace).get(enumerationNameType) as any;
    expect(table.columns[0].columnId).toBe(`${enumerationNameType}Id`);
    expect(table.columns[0].isIdentityDatabaseType).toBe(true);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
    expect(table.columns[0].isNullable).toBe(false);
    expect(table.columns[table.columns.length - 1].description).not.toBe('');
  });

  it('should have code value column', (): void => {
    const table = tableEntities(metaEd, namespace).get(enumerationNameType) as any;
    const column = table.columns.filter((x) => x.columnId === 'CodeValue')[0];
    expect(column).toBeDefined();
    expect(column.maxLength).toBe('50');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });

  it('should have description column', (): void => {
    const table = tableEntities(metaEd, namespace).get(enumerationNameType) as any;
    const column = table.columns.filter((x) => x.columnId === 'Description')[0];
    expect(column).toBeDefined();
    expect(column.maxLength).toBe('1024');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });

  it('should have short description column', (): void => {
    const table = tableEntities(metaEd, namespace).get(enumerationNameType) as any;
    const column = table.columns.filter((x) => x.columnId === 'ShortDescription')[0];
    expect(column).toBeDefined();
    expect(column.maxLength).toBe('450');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });
});
