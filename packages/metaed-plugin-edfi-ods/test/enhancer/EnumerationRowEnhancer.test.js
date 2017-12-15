// @flow
import {
  addEntity,
  newEnumeration,
  newEnumerationItem,
  newMetaEdEnvironment,
  newNamespaceInfo,
} from 'metaed-core';
import type {
  Enumeration,
  EnumerationItem,
  MetaEdEnvironment,
} from 'metaed-core';
import { enhance } from '../../src/enhancer/EnumerationRowEnhancer';
import { enhance as initializeEdFiOdsEntityRepository } from '../../src/model/EdFiOdsEntityRepository';
import type { EnumerationRow } from '../../src/model/database/EnumerationRow';

describe('when EnumerationRowEnhancer enhances enumeration', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const itemDocumentation1: string = 'ItemDocumentation1';
  const itemDocumentation2: string = 'ItemDocumentation2';
  const shortDescription1: string = 'ShortDescription1';
  const shortDescription2: string = 'ShortDescription2';

  beforeAll(() => {
    const entity: Enumeration = Object.assign(newEnumeration(), {
      metaEdName: entityName,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace,
      }),
      data: {
        edfiOds: {
          ods_TableName: entityName,
        },
      },
    });
    const item1: EnumerationItem = Object.assign(newEnumerationItem(), {
      documentation: itemDocumentation1,
      shortDescription: shortDescription1,
    });
    const item2: EnumerationItem = Object.assign(newEnumerationItem(), {
      documentation: itemDocumentation2,
      shortDescription: shortDescription2,
    });
    entity.enumerationItems.push(item1);
    entity.enumerationItems.push(item2);

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entity);
    enhance(metaEd);
  });

  it('should create two rows', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.row.size).toBe(2);
    expect((metaEd.plugin.get('edfiOds'): any).entity.row.get(`${entityName}Type${shortDescription1}`)).toBeDefined();
    expect((metaEd.plugin.get('edfiOds'): any).entity.row.get(`${entityName}Type${shortDescription2}`)).toBeDefined();
  });

  it('should have correct first enumeration row', () => {
    const row: EnumerationRow = (metaEd.plugin.get('edfiOds'): any).entity.row.get(`${entityName}Type${shortDescription1}`);
    expect(row.type).toBe('enumerationRow');
    expect(row.name).toBe(`${entityName}Type`);
    expect(row.namespace).toBe(namespace);
    expect(row.schemaName).toBe(namespace);
    expect(row.tableName).toBe(`${entityName}Type`);
    expect(row.documentation).toBe(itemDocumentation1);
    expect(row.codeValue).toBe('');
    expect(row.description).toBe(shortDescription1);
    expect(row.shortDescription).toBe(shortDescription1);
  });

  it('should have correct second enumeration row', () => {
    const row: EnumerationRow = (metaEd.plugin.get('edfiOds'): any).entity.row.get(`${entityName}Type${shortDescription2}`);
    expect(row.type).toBe('enumerationRow');
    expect(row.name).toBe(`${entityName}Type`);
    expect(row.namespace).toBe(namespace);
    expect(row.schemaName).toBe(namespace);
    expect(row.tableName).toBe(`${entityName}Type`);
    expect(row.documentation).toBe(itemDocumentation2);
    expect(row.codeValue).toBe('');
    expect(row.description).toBe(shortDescription2);
    expect(row.shortDescription).toBe(shortDescription2);
  });
});

describe('when EnumerationRowEnhancer enhances enumeration with name that ends with \'Type\'', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const itemDocumentation1: string = 'ItemDocumentation1';
  const itemDocumentation2: string = 'ItemDocumentation2';
  const shortDescription1: string = 'ShortDescription1';
  const shortDescription2: string = 'ShortDescription2';

  beforeAll(() => {
    const entity: Enumeration = Object.assign(newEnumeration(), {
      metaEdName: `${entityName}Type`,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace,
      }),
      data: {
        edfiOds: {
          ods_TableName: `${entityName}Type`,
        },
      },
    });
    const item1: EnumerationItem = Object.assign(newEnumerationItem(), {
      documentation: itemDocumentation1,
      shortDescription: shortDescription1,
    });
    const item2: EnumerationItem = Object.assign(newEnumerationItem(), {
      documentation: itemDocumentation2,
      shortDescription: shortDescription2,
    });
    entity.enumerationItems.push(item1);
    entity.enumerationItems.push(item2);

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entity);
    enhance(metaEd);
  });

  it('should create two rows', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.row.size).toBe(2);
    expect((metaEd.plugin.get('edfiOds'): any).entity.row.get(`${entityName}Type${shortDescription1}`)).toBeDefined();
    expect((metaEd.plugin.get('edfiOds'): any).entity.row.get(`${entityName}Type${shortDescription2}`)).toBeDefined();
  });

  it('should have correct first enumeration row', () => {
    const row: EnumerationRow = (metaEd.plugin.get('edfiOds'): any).entity.row.get(`${entityName}Type${shortDescription1}`);
    expect(row.type).toBe('enumerationRow');
    expect(row.name).toBe(`${entityName}Type`);
    expect(row.namespace).toBe(namespace);
    expect(row.schemaName).toBe(namespace);
    expect(row.tableName).toBe(`${entityName}Type`);
    expect(row.documentation).toBe(itemDocumentation1);
    expect(row.codeValue).toBe('');
    expect(row.description).toBe(shortDescription1);
    expect(row.shortDescription).toBe(shortDescription1);
  });

  it('should have correct second enumeration row', () => {
    const row: EnumerationRow = (metaEd.plugin.get('edfiOds'): any).entity.row.get(`${entityName}Type${shortDescription2}`);
    expect(row.type).toBe('enumerationRow');
    expect(row.name).toBe(`${entityName}Type`);
    expect(row.namespace).toBe(namespace);
    expect(row.schemaName).toBe(namespace);
    expect(row.tableName).toBe(`${entityName}Type`);
    expect(row.documentation).toBe(itemDocumentation2);
    expect(row.codeValue).toBe('');
    expect(row.description).toBe(shortDescription2);
    expect(row.shortDescription).toBe(shortDescription2);
  });
});
