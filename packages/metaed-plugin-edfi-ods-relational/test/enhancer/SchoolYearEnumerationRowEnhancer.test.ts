// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  addEntityForNamespace,
  newSchoolYearEnumeration,
  newEnumerationItem,
  newMetaEdEnvironment,
  newNamespace,
} from '@edfi/metaed-core';
import { EnumerationItem, MetaEdEnvironment, SchoolYearEnumeration, Namespace } from '@edfi/metaed-core';
import { rowEntities } from '../../src/enhancer/EnhancerHelper';
import { enhance } from '../../src/enhancer/SchoolYearEnumerationRowEnhancer';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';

describe('when SchoolYearEnumerationRowEnhancer enhances enumeration', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const entityName = 'EntityName';
  const itemDocumentation1 = 'ItemDocumentation1';
  const itemDocumentation2 = 'ItemDocumentation2';
  const shortDescription1 = '2017-2018';
  const shortDescription2 = '2018-2019';

  beforeAll(() => {
    const entity: SchoolYearEnumeration = Object.assign(newSchoolYearEnumeration(), {
      metaEdName: entityName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsTableId: entityName,
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

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    addEntityForNamespace(entity);
    enhance(metaEd);
  });

  it('should create two rows', (): void => {
    expect(rowEntities(metaEd, namespace).size).toBe(2);
    expect(rowEntities(metaEd, namespace).get(`2018${shortDescription1}`)).toBeDefined();
    expect(rowEntities(metaEd, namespace).get(`2019${shortDescription2}`)).toBeDefined();
  });

  it('should have correct first enumeration row', (): void => {
    const row: any = rowEntities(metaEd, namespace).get(`2018${shortDescription1}`);
    expect(row.type).toBe('schoolYearEnumerationRow');
    expect(row.name).toBe('2018');
    expect(row.namespace).toBe('EdFi');
    expect(row.schemaName).toBe('edfi');
    expect(row.tableName).toBe('SchoolYearType');
    expect(row.documentation).toBe(itemDocumentation1);
    expect(row.schoolYear).toBe(2018);
    expect(row.schoolYearDescription).toBe(shortDescription1);
  });

  it('should have correct second enumeration row', (): void => {
    const row: any = rowEntities(metaEd, namespace).get(`2019${shortDescription2}`);
    expect(row.type).toBe('schoolYearEnumerationRow');
    expect(row.name).toBe('2019');
    expect(row.namespace).toBe('EdFi');
    expect(row.schemaName).toBe('edfi');
    expect(row.tableName).toBe('SchoolYearType');
    expect(row.documentation).toBe(itemDocumentation2);
    expect(row.schoolYear).toBe(2019);
    expect(row.schoolYearDescription).toBe(shortDescription2);
  });
});
