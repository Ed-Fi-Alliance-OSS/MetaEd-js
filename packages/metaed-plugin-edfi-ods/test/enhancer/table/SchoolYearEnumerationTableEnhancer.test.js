// @flow
import R from 'ramda';
import {
  addEntity,
  newMetaEdEnvironment,
  newNamespaceInfo,
  newSchoolYearEnumeration,
} from 'metaed-core';
import type { MetaEdEnvironment, SchoolYearEnumeration } from 'metaed-core';
import { enhance } from '../../../src/enhancer/table/SchoolYearEnumerationTableEnhancer';
import { enhance as initializeEdFiOdsEntityRepository } from '../../../src/model/EdFiOdsEntityRepository';

describe('when SchoolYearEnumerationTableEnhancer enhances schoolYearEnumeration', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespaceName';
  const schoolYear: string = 'SchoolYear';
  const schoolYearType: string = `${schoolYear}Type`;
  const schoolYearEnumerationDocumentation: string = 'SchoolYearEnumerationDocumentation';

  beforeAll(() => {
    const schoolYearEnumeration: SchoolYearEnumeration = Object.assign(newSchoolYearEnumeration(), {
      metaEdName: schoolYear,
      documentation: schoolYearEnumerationDocumentation,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace: namespaceName,
      }),
      data: {
        edfiOds: {
          ods_Tables: [],
        },
      },
    });

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, schoolYearEnumeration);
    enhance(metaEd);
  });

  it('should create table', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(schoolYearType): any);
    expect(table).toBeDefined();
    expect(table.name).toBe(schoolYearType);
    expect(table.schema).toBe(namespaceName);
    expect(table.description).toBe(schoolYearEnumerationDocumentation);
    expect(table.includeCreateDateColumn).toBe(true);
    expect(table.includeLastModifiedDateAndIdColumn).toBe(true);
  });

  it('should have three columns', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(schoolYearType): any);
    expect(table.columns).toHaveLength(3);
  });

  it('should have one primary key', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(schoolYearType): any);
    expect(R.head(table.columns).name).toBe(schoolYear);
    expect(R.head(table.columns).isPartOfPrimaryKey).toBe(true);
    expect(R.head(table.columns).isNullable).toBe(false);
    expect(R.last(table.columns).description).not.toBe('');
  });

  it('should have school year description column', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(schoolYearType): any);
    const column = R.head(table.columns.filter(x => x.name === 'SchoolYearDescription'));
    expect(column).toBeDefined();
    expect(column.length).toBe('50');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });

  it('should have current school year column', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(schoolYearType): any);
    const column = R.head(table.columns.filter(x => x.name === 'CurrentSchoolYear'));
    expect(column).toBeDefined();
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });
});
