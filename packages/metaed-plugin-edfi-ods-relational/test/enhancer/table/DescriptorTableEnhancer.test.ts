// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import {
  addEntityForNamespace,
  newDescriptor,
  newIntegerProperty,
  newMapTypeEnumeration,
  newMetaEdEnvironment,
  newNamespace,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, Descriptor, IntegerProperty, MapTypeEnumeration, Namespace } from '@edfi/metaed-core';
import { tableEntities } from '../../../src/enhancer/EnhancerHelper';
import { enhance } from '../../../src/enhancer/table/DescriptorTableEnhancer';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../../src/model/EdFiOdsRelationalEntityRepository';
import { Table } from '../../../src/model/database/Table';

describe('when DescriptorTableEnhancer enhances simple descriptor', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const descriptorName = 'DescriptorName';
  const descriptorNameDescriptor = `${descriptorName}Descriptor`;
  const descriptorDocumentation = 'DescriptorDocumentation';
  const integerPropertyName = 'integerPropertyName';

  beforeAll(() => {
    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorName,
      documentation: descriptorDocumentation,
      namespace,
      data: {
        edfiOdsRelational: {
          odsTableId: descriptorNameDescriptor,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const property: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: integerPropertyName,
      documentation: 'IntegerPropertyDocumentation',
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsCollection: false,
        },
      },
    });
    descriptor.data.edfiOdsRelational.odsProperties.push(property);

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    addEntityForNamespace(descriptor);
    enhance(metaEd);
  });

  it('should create table', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table).toBeDefined();
    expect(table.tableId).toBe(descriptorNameDescriptor);
    expect(table.schema).toBe('edfi');
    expect(table.description).toBe(descriptorDocumentation);
  });

  it('should create two columns', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.columns).toHaveLength(2);
  });

  it('should have primary key', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.columns[0].columnId).toBe(`${descriptorName}DescriptorId`);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
    expect(table.columns[0].isNullable).toBe(false);
    expect(table.columns[0].description).not.toBe('');
  });

  it('should have property column', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.columns[table.columns.length - 1].columnId).toBe(integerPropertyName);
    expect(table.columns[table.columns.length - 1].isPartOfPrimaryKey).toBe(false);
    expect(table.columns[table.columns.length - 1].isNullable).toBe(false);
    expect(table.columns[table.columns.length - 1].description).not.toBe('');
  });

  it('should have foreign key to descriptor table', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.foreignKeys[0].columnPairs).toHaveLength(1);
    expect(table.foreignKeys[0].withDeleteCascade).toBe(true);

    expect(table.foreignKeys[0].parentTable.tableId).toBe(descriptorNameDescriptor);
    expect(R.head(table.foreignKeys[0].columnPairs).parentTableColumnId).toBe(`${descriptorNameDescriptor}Id`);

    expect(table.foreignKeys[0].foreignTableId).toBe('Descriptor');
    expect(R.head(table.foreignKeys[0].columnPairs).foreignTableColumnId).toBe('DescriptorId');
  });
});

describe('when DescriptorTableEnhancer enhances descriptor with required map type', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const descriptorName = 'DescriptorName';
  const descriptorNameDescriptor = `${descriptorName}Descriptor`;
  const descriptorNameType = `${descriptorName}Type`;
  const descriptorDocumentation = 'DescriptorDocumentation';
  const mapTypeEnumerationName = `${descriptorName}Map`;
  const mapTypeEnumerationDocumentation = 'MapTypeEnumerationDocumentation';

  beforeAll(() => {
    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorName,
      documentation: descriptorDocumentation,
      isMapTypeRequired: true,
      namespace,
      data: {
        edfiOdsRelational: {
          odsIsMapType: true,
          odsTableId: descriptorNameDescriptor,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const mapTypeEnumeration: MapTypeEnumeration = Object.assign(newMapTypeEnumeration(), {
      metaEdName: mapTypeEnumerationName,
      documentation: mapTypeEnumerationDocumentation,
    });
    descriptor.mapTypeEnumeration = mapTypeEnumeration;

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    addEntityForNamespace(descriptor);
    enhance(metaEd);
  });

  it('should create two tables', (): void => {
    expect(tableEntities(metaEd, namespace).size).toBe(2);
  });

  it('should have descriptor table', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table).toBeDefined();
    expect(table.tableId).toBe(descriptorNameDescriptor);
    expect(table.schema).toBe('edfi');
    expect(table.description).toBe(descriptorDocumentation);
  });

  it('should have two columns', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.columns).toHaveLength(2);
  });

  it('should have primary key', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.columns[0].columnId).toBe(`${descriptorName}DescriptorId`);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
    expect(table.columns[0].isNullable).toBe(false);
    expect(table.columns[0].description).not.toBe('');
  });

  it('should have type column', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.columns[table.columns.length - 1].columnId).toBe(`${descriptorNameType}Id`);
    expect(table.columns[table.columns.length - 1].isPartOfPrimaryKey).toBe(false);
    expect(table.columns[table.columns.length - 1].isNullable).toBe(false);
    expect(table.columns[table.columns.length - 1].description).not.toBe('');
  });

  it('should have two foreign keys', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.foreignKeys).toHaveLength(2);
  });

  it('should have foreign key to descriptor table', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.foreignKeys[0].withDeleteCascade).toBe(true);

    expect(table.foreignKeys[0].parentTable.tableId).toBe(descriptorNameDescriptor);
    expect(R.head(table.foreignKeys[0].columnPairs).parentTableColumnId).toBe(`${descriptorNameDescriptor}Id`);

    expect(table.foreignKeys[0].foreignTableId).toBe('Descriptor');
    expect(R.head(table.foreignKeys[0].columnPairs).foreignTableColumnId).toBe('DescriptorId');
  });

  it('should have foreign key to map type enumeration table', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.foreignKeys[table.foreignKeys.length - 1].columnPairs).toHaveLength(1);
    expect(table.foreignKeys[table.foreignKeys.length - 1].withDeleteCascade).toBe(false);

    expect(table.foreignKeys[table.foreignKeys.length - 1].parentTable.tableId).toBe(descriptorNameDescriptor);
    expect(R.head(table.foreignKeys[table.foreignKeys.length - 1].columnPairs).parentTableColumnId).toBe(
      `${descriptorNameType}Id`,
    );

    expect(table.foreignKeys[table.foreignKeys.length - 1].foreignTableId).toBe(descriptorNameType);
    expect(R.head(table.foreignKeys[table.foreignKeys.length - 1].columnPairs).foreignTableColumnId).toBe(
      `${descriptorNameType}Id`,
    );
  });

  it('should have map type enumeration table', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameType) as Table;
    expect(table).toBeDefined();
    expect(table.tableId).toBe(descriptorNameType);
    expect(table.schema).toBe('edfi');
    expect(table.description).toBe(mapTypeEnumerationDocumentation);
    expect(table.includeCreateDateColumn).toBe(true);
    expect(table.includeLastModifiedDateAndIdColumn).toBe(true);
  });

  it('should have four columns', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameType) as Table;
    expect(table.columns).toHaveLength(4);
  });

  it('should have one primary key', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameType) as Table;
    expect(table.columns[0].columnId).toBe(`${descriptorNameType}Id`);
    expect(table.columns[0].isIdentityDatabaseType).toBe(true);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
    expect(table.columns[0].isNullable).toBe(false);
    expect(table.columns[table.columns.length - 1].description).not.toBe('');
  });

  it('should have code value column', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameType) as Table;
    const column = R.head(table.columns.filter((x) => x.columnId === 'CodeValue'));
    expect(column).toBeDefined();
    expect(column.maxLength).toBe('50');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });

  it('should have description column', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameType) as Table;
    const column = R.head(table.columns.filter((x) => x.columnId === 'Description'));
    expect(column).toBeDefined();
    expect(column.maxLength).toBe('1024');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });

  it('should have short description column', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameType) as Table;
    const column = R.head(table.columns.filter((x) => x.columnId === 'ShortDescription'));
    expect(column).toBeDefined();
    expect(column.maxLength).toBe('450');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });
});

describe('when DescriptorTableEnhancer enhances descriptor with optional map type', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const descriptorName = 'DescriptorName';
  const descriptorNameDescriptor = `${descriptorName}Descriptor`;
  const descriptorNameType = `${descriptorName}Type`;
  const descriptorDocumentation = 'DescriptorDocumentation';
  const mapTypeEnumerationName = `${descriptorName}Map`;
  const mapTypeEnumerationDocumentation = 'MapTypeEnumerationDocumentation';

  beforeAll(() => {
    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorName,
      documentation: descriptorDocumentation,
      isMapTypeOptional: true,
      namespace,
      data: {
        edfiOdsRelational: {
          odsIsMapType: true,
          odsTableId: descriptorNameDescriptor,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const mapTypeEnumeration: MapTypeEnumeration = Object.assign(newMapTypeEnumeration(), {
      metaEdName: mapTypeEnumerationName,
      documentation: mapTypeEnumerationDocumentation,
    });
    descriptor.mapTypeEnumeration = mapTypeEnumeration;

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    addEntityForNamespace(descriptor);
    enhance(metaEd);
  });

  it('should create two tables', (): void => {
    expect(tableEntities(metaEd, namespace).size).toBe(2);
  });

  it('should have descriptor table', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table).toBeDefined();
    expect(table.tableId).toBe(descriptorNameDescriptor);
    expect(table.schema).toBe('edfi');
    expect(table.description).toBe(descriptorDocumentation);
  });

  it('should have two columns', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.columns).toHaveLength(2);
  });

  it('should have primary key', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.columns[0].columnId).toBe(`${descriptorName}DescriptorId`);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
    expect(table.columns[0].isNullable).toBe(false);
    expect(table.columns[0].description).not.toBe('');
  });

  it('should have type column', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.columns[table.columns.length - 1].columnId).toBe(`${descriptorNameType}Id`);
    expect(table.columns[table.columns.length - 1].isPartOfPrimaryKey).toBe(false);
    expect(table.columns[table.columns.length - 1].isNullable).toBe(true);
    expect(table.columns[table.columns.length - 1].description).not.toBe('');
  });

  it('should have two foreign keys', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.foreignKeys).toHaveLength(2);
  });

  it('should have foreign key to descriptor table', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.foreignKeys[0].withDeleteCascade).toBe(true);

    expect(table.foreignKeys[0].parentTable.tableId).toBe(descriptorNameDescriptor);
    expect(R.head(table.foreignKeys[0].columnPairs).parentTableColumnId).toBe(`${descriptorNameDescriptor}Id`);

    expect(table.foreignKeys[0].foreignTableId).toBe('Descriptor');
    expect(R.head(table.foreignKeys[0].columnPairs).foreignTableColumnId).toBe('DescriptorId');
  });

  it('should have foreign key to map type enumeration table', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.foreignKeys[table.foreignKeys.length - 1].columnPairs).toHaveLength(1);
    expect(table.foreignKeys[table.foreignKeys.length - 1].withDeleteCascade).toBe(false);

    expect(table.foreignKeys[table.foreignKeys.length - 1].parentTable.tableId).toBe(descriptorNameDescriptor);
    expect(R.head(table.foreignKeys[table.foreignKeys.length - 1].columnPairs).parentTableColumnId).toBe(
      `${descriptorNameType}Id`,
    );

    expect(table.foreignKeys[table.foreignKeys.length - 1].foreignTableId).toBe(descriptorNameType);
    expect(R.head(table.foreignKeys[table.foreignKeys.length - 1].columnPairs).foreignTableColumnId).toBe(
      `${descriptorNameType}Id`,
    );
  });

  it('should have map type enumeration table', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameType) as Table;
    expect(table).toBeDefined();
    expect(table.tableId).toBe(descriptorNameType);
    expect(table.schema).toBe('edfi');
    expect(table.description).toBe(mapTypeEnumerationDocumentation);
    expect(table.includeCreateDateColumn).toBe(true);
    expect(table.includeLastModifiedDateAndIdColumn).toBe(true);
  });

  it('should have four columns', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameType) as Table;
    expect(table.columns).toHaveLength(4);
  });

  it('should have one primary key', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameType) as Table;
    expect(table.columns[0].columnId).toBe(`${descriptorNameType}Id`);
    expect(table.columns[0].isIdentityDatabaseType).toBe(true);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
    expect(table.columns[0].isNullable).toBe(false);
    expect(table.columns[table.columns.length - 1].description).not.toBe('');
  });

  it('should have code value column', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameType) as Table;
    const column = R.head(table.columns.filter((x) => x.columnId === 'CodeValue'));
    expect(column).toBeDefined();
    expect(column.maxLength).toBe('50');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });

  it('should have description column', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameType) as Table;
    const column = R.head(table.columns.filter((x) => x.columnId === 'Description'));
    expect(column).toBeDefined();
    expect(column.maxLength).toBe('1024');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });

  it('should have short description column', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameType) as Table;
    const column = R.head(table.columns.filter((x) => x.columnId === 'ShortDescription'));
    expect(column).toBeDefined();
    expect(column.maxLength).toBe('450');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });
});

describe("when DescriptorTableEnhancer enhances descriptor with map type name ending with 'Type'", () => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const descriptorName = 'DescriptorName';
  const descriptorNameDescriptor = `${descriptorName}Descriptor`;
  const descriptorNameType = `${descriptorName}Type`;
  const descriptorDocumentation = 'DescriptorDocumentation';
  const mapTypeEnumerationName = `${descriptorNameType}Map`;
  const mapTypeEnumerationDocumentation = 'MapTypeEnumerationDocumentation';

  beforeAll(() => {
    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorNameType,
      documentation: descriptorDocumentation,
      isMapTypeOptional: true,
      namespace,
      data: {
        edfiOdsRelational: {
          odsIsMapType: true,
          odsTableId: descriptorNameDescriptor,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const mapTypeEnumeration: MapTypeEnumeration = Object.assign(newMapTypeEnumeration(), {
      metaEdName: mapTypeEnumerationName,
      documentation: mapTypeEnumerationDocumentation,
    });
    descriptor.mapTypeEnumeration = mapTypeEnumeration;

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    addEntityForNamespace(descriptor);
    enhance(metaEd);
  });

  it('should create two tables', (): void => {
    expect(tableEntities(metaEd, namespace).size).toBe(2);
  });

  it('should have descriptor table', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table).toBeDefined();
    expect(table.tableId).toBe(descriptorNameDescriptor);
    expect(table.schema).toBe('edfi');
    expect(table.description).toBe(descriptorDocumentation);
  });

  it('should have two columns', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.columns).toHaveLength(2);
  });

  it('should have primary key', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.columns[0].columnId).toBe(`${descriptorNameType}DescriptorId`);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
    expect(table.columns[0].isNullable).toBe(false);
    expect(table.columns[0].description).not.toBe('');
  });

  it('should have type column', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.columns[table.columns.length - 1].columnId).toBe(`${descriptorNameType}Id`);
    expect(table.columns[table.columns.length - 1].isPartOfPrimaryKey).toBe(false);
    expect(table.columns[table.columns.length - 1].isNullable).toBe(true);
    expect(table.columns[table.columns.length - 1].description).not.toBe('');
  });

  it('should have two foreign keys', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.foreignKeys).toHaveLength(2);
  });

  it('should have foreign key to descriptor table', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.foreignKeys[0].withDeleteCascade).toBe(true);

    expect(table.foreignKeys[0].parentTable.tableId).toBe(descriptorNameDescriptor);
    expect(R.head(table.foreignKeys[0].columnPairs).parentTableColumnId).toBe(`${descriptorNameDescriptor}Id`);

    expect(table.foreignKeys[0].foreignTableId).toBe('Descriptor');
    expect(R.head(table.foreignKeys[0].columnPairs).foreignTableColumnId).toBe('DescriptorId');
  });

  it('should have foreign key to map type enumeration table', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameDescriptor) as Table;
    expect(table.foreignKeys[table.foreignKeys.length - 1].columnPairs).toHaveLength(1);
    expect(table.foreignKeys[table.foreignKeys.length - 1].withDeleteCascade).toBe(false);

    expect(table.foreignKeys[table.foreignKeys.length - 1].parentTable.tableId).toBe(descriptorNameDescriptor);
    expect(R.head(table.foreignKeys[table.foreignKeys.length - 1].columnPairs).parentTableColumnId).toBe(
      `${descriptorNameType}Id`,
    );

    expect(table.foreignKeys[table.foreignKeys.length - 1].foreignTableId).toBe(descriptorNameType);
    expect(R.head(table.foreignKeys[table.foreignKeys.length - 1].columnPairs).foreignTableColumnId).toBe(
      `${descriptorNameType}Id`,
    );
  });

  it('should have map type enumeration table', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameType) as Table;
    expect(table).toBeDefined();
    expect(table.tableId).toBe(descriptorNameType);
    expect(table.schema).toBe('edfi');
    expect(table.description).toBe(mapTypeEnumerationDocumentation);
    expect(table.includeCreateDateColumn).toBe(true);
    expect(table.includeLastModifiedDateAndIdColumn).toBe(true);
  });

  it('should have four columns', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameType) as Table;
    expect(table.columns).toHaveLength(4);
  });

  it('should have one primary key', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameType) as Table;
    expect(table.columns[0].columnId).toBe(`${descriptorNameType}Id`);
    expect(table.columns[0].isIdentityDatabaseType).toBe(true);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
    expect(table.columns[0].isNullable).toBe(false);
    expect(table.columns[table.columns.length - 1].description).not.toBe('');
  });

  it('should have code value column', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameType) as Table;
    const column = R.head(table.columns.filter((x) => x.columnId === 'CodeValue'));
    expect(column).toBeDefined();
    expect(column.maxLength).toBe('50');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });

  it('should have description column', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameType) as Table;
    const column = R.head(table.columns.filter((x) => x.columnId === 'Description'));
    expect(column).toBeDefined();
    expect(column.maxLength).toBe('1024');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });

  it('should have short description column', (): void => {
    const table = tableEntities(metaEd, namespace).get(descriptorNameType) as Table;
    const column = R.head(table.columns.filter((x) => x.columnId === 'ShortDescription'));
    expect(column).toBeDefined();
    expect(column.maxLength).toBe('450');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });
});
