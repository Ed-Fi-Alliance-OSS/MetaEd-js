// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
    expect(table.columns[0].description).toMatchInlineSnapshot(`"Key for School Year"`);
    expect(table.columns[0].propertyPath).toMatchInlineSnapshot(`""`);
  });

  it('should have school year description column', (): void => {
    const table = tableEntities(metaEd, namespace).get(schoolYearType) as any;
    const column = table.columns.filter((x) => x.columnId === 'SchoolYearDescription')[0];
    expect(column).toBeDefined();
    expect(column.maxLength).toBe('50');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).toMatchInlineSnapshot(`"The description for the SchoolYear type."`);
    expect(column.propertyPath).toMatchInlineSnapshot(`""`);
  });

  it('should have current school year column', (): void => {
    const table = tableEntities(metaEd, namespace).get(schoolYearType) as any;
    const column = table.columns.filter((x) => x.columnId === 'CurrentSchoolYear')[0];
    expect(column).toBeDefined();
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).toMatchInlineSnapshot(`"The code for the current school year."`);
    expect(column.propertyPath).toMatchInlineSnapshot(`""`);
  });
});
