// @flow
import {
  addEntity,
  newSchoolYearEnumeration,
  newEnumerationItem,
  newMetaEdEnvironment,
  newNamespaceInfo,
} from 'metaed-core';
import type {
  EnumerationItem,
  MetaEdEnvironment,
  SchoolYearEnumeration,
} from 'metaed-core';
import { enhance } from '../../src/enhancer/SchoolYearEnumerationRowEnhancer';
import { enhance as initializeEdFiOdsEntityRepository } from '../../src/model/EdFiOdsEntityRepository';
import type { SchoolYearEnumerationRow } from '../../src/model/database/SchoolYearEnumerationRow';

describe('when SchoolYearEnumerationRowEnhancer enhances enumeration', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const itemDocumentation1: string = 'ItemDocumentation1';
  const itemDocumentation2: string = 'ItemDocumentation2';
  const shortDescription1: string = '2017ShortDescription1';
  const shortDescription2: string = '2018ShortDescription2';

  beforeAll(() => {
    const entity: SchoolYearEnumeration = Object.assign(newSchoolYearEnumeration(), {
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
    expect((metaEd.plugin.get('edfiOds'): any).entity.row.get(`2017${shortDescription1}`)).toBeDefined();
    expect((metaEd.plugin.get('edfiOds'): any).entity.row.get(`2018${shortDescription2}`)).toBeDefined();
  });

  it('should have correct first enumeration row', () => {
    const row: SchoolYearEnumerationRow = (metaEd.plugin.get('edfiOds'): any).entity.row.get(`2017${shortDescription1}`);
    expect(row.type).toBe('schoolYearEnumerationRow');
    expect(row.name).toBe('2017');
    expect(row.namespace).toBe(namespace);
    expect(row.schemaName).toBe(namespace);
    expect(row.tableName).toBe('SchoolYearType');
    expect(row.documentation).toBe(itemDocumentation1);
    expect(row.schoolYear).toBe(2017);
    expect(row.schoolYearDescription).toBe(shortDescription1);
  });

  it('should have correct second enumeration row', () => {
    const row: SchoolYearEnumerationRow = (metaEd.plugin.get('edfiOds'): any).entity.row.get(`2018${shortDescription2}`);
    expect(row.type).toBe('schoolYearEnumerationRow');
    expect(row.name).toBe('2018');
    expect(row.namespace).toBe(namespace);
    expect(row.schemaName).toBe(namespace);
    expect(row.tableName).toBe('SchoolYearType');
    expect(row.documentation).toBe(itemDocumentation2);
    expect(row.schoolYear).toBe(2018);
    expect(row.schoolYearDescription).toBe(shortDescription2);
  });
});
