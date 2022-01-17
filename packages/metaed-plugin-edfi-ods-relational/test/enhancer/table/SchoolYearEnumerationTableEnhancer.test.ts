import { addEntityForNamespace, newMetaEdEnvironment, newNamespace, newSchoolYearEnumeration } from '@edfi/metaed-core';
import { MetaEdEnvironment, SchoolYearEnumeration, Namespace } from '@edfi/metaed-core';
import { tableEntities } from '../../../src/enhancer/EnhancerHelper';
import { enhance } from '../../../src/enhancer/table/SchoolYearEnumerationTableEnhancer';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../../src/model/EdFiOdsRelationalEntityRepository';

describe('when SchoolYearEnumerationTableEnhancer enhances schoolYearEnumeration', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const schoolYear = 'SchoolYear';
  const schoolYearType = `${schoolYear}Type`;
  const schoolYearEnumerationDocumentation = 'SchoolYearEnumerationDocumentation';

  beforeAll(() => {
    const schoolYearEnumeration: SchoolYearEnumeration = Object.assign(newSchoolYearEnumeration(), {
      metaEdName: schoolYear,
      documentation: schoolYearEnumerationDocumentation,
      namespace,
      data: {
        edfiOdsRelational: {
          odsTables: [],
        },
      },
    });

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    addEntityForNamespace(schoolYearEnumeration);
    enhance(metaEd);
  });

  it('should create table', (): void => {
    const table = tableEntities(metaEd, namespace).get(schoolYearType) as any;
    expect(table).toBeDefined();
    expect(table.tableId).toBe(schoolYearType);
    expect(table.schema).toBe('edfi');
    expect(table.description).toBe(schoolYearEnumerationDocumentation);
    expect(table.includeCreateDateColumn).toBe(true);
    expect(table.includeLastModifiedDateAndIdColumn).toBe(true);
  });

  it('should have three columns', (): void => {
    const table = tableEntities(metaEd, namespace).get(schoolYearType) as any;
    expect(table.columns).toHaveLength(3);
  });

  it('should have one primary key', (): void => {
    const table = tableEntities(metaEd, namespace).get(schoolYearType) as any;
    expect(table.columns[0].columnId).toBe(schoolYear);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
    expect(table.columns[0].isNullable).toBe(false);
    expect(table.columns[table.columns.length - 1].description).not.toBe('');
  });

  it('should have school year description column', (): void => {
    const table = tableEntities(metaEd, namespace).get(schoolYearType) as any;
    const column = table.columns.filter((x) => x.columnId === 'SchoolYearDescription')[0];
    expect(column).toBeDefined();
    expect(column.length).toBe('50');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });

  it('should have current school year column', (): void => {
    const table = tableEntities(metaEd, namespace).get(schoolYearType) as any;
    const column = table.columns.filter((x) => x.columnId === 'CurrentSchoolYear')[0];
    expect(column).toBeDefined();
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });
});
