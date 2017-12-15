// @flow
import R from 'ramda';
import {
  addEntity,
  newDescriptor,
  newIntegerProperty,
  newMapTypeEnumeration,
  newMetaEdEnvironment,
  newNamespaceInfo,
} from 'metaed-core';
import type { MetaEdEnvironment, Descriptor, IntegerProperty, MapTypeEnumeration } from 'metaed-core';
import { enhance } from '../../../src/enhancer/table/DescriptorTableEnhancer';
import { enhance as initializeEdFiOdsEntityRepository } from '../../../src/model/EdFiOdsEntityRepository';

describe('when DescriptorTableEnhancer enhances simple descriptor', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespaceName';
  const descriptorName: string = 'DescriptorName';
  const descriptorNameDescriptor: string = `${descriptorName}Descriptor`;
  const descriptorDocumentation: string = 'DescriptorDocumentation';
  const integerPropertyName: string = 'integerPropertyName';

  beforeAll(() => {
    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorName,
      documentation: descriptorDocumentation,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace: namespaceName,
      }),
      data: {
        edfiOds: {
          ods_TableName: descriptorNameDescriptor,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const property: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: integerPropertyName,
      documentation: 'IntegerPropertyDocumentation',
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    descriptor.data.edfiOds.ods_Properties.push(property);

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, descriptor);
    enhance(metaEd);
  });

  it('should create table', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(table).toBeDefined();
    expect(table.name).toBe(descriptorNameDescriptor);
    expect(table.schema).toBe(namespaceName);
    expect(table.description).toBe(descriptorDocumentation);
  });

  it('should create two columns', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(table.columns).toHaveLength(2);
  });

  it('should have primary key', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(R.head(table.columns).name).toBe(`${descriptorName}DescriptorId`);
    expect(R.head(table.columns).isPartOfPrimaryKey).toBe(true);
    expect(R.head(table.columns).isNullable).toBe(false);
    expect(R.head(table.columns).description).not.toBe('');
  });

  it('should have property column', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(R.last(table.columns).name).toBe(integerPropertyName);
    expect(R.last(table.columns).isPartOfPrimaryKey).toBe(false);
    expect(R.last(table.columns).isNullable).toBe(false);
    expect(R.last(table.columns).description).not.toBe('');
  });

  it('should have foreign key to descriptor table', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(R.head(table.foreignKeys).columnNames).toHaveLength(1);
    expect(R.head(table.foreignKeys).withDeleteCascade).toBe(true);

    expect(R.head(table.foreignKeys).parentTableName).toBe(descriptorNameDescriptor);
    expect(R.head(R.head(table.foreignKeys).columnNames).parentTableColumnName).toBe(`${descriptorNameDescriptor}Id`);

    expect(R.head(table.foreignKeys).foreignTableName).toBe('Descriptor');
    expect(R.head(R.head(table.foreignKeys).columnNames).foreignTableColumnName).toBe('DescriptorId');
  });
});

describe('when DescriptorTableEnhancer enhances descriptor with required map type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespaceName';
  const descriptorName: string = 'DescriptorName';
  const descriptorNameDescriptor: string = `${descriptorName}Descriptor`;
  const descriptorNameType: string = `${descriptorName}Type`;
  const descriptorDocumentation: string = 'DescriptorDocumentation';
  const mapTypeEnumerationName: string = `${descriptorName}Map`;
  const mapTypeEnumerationDocumentation: string = 'MapTypeEnumerationDocumentation';

  beforeAll(() => {
    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorName,
      documentation: descriptorDocumentation,
      isMapTypeRequired: true,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace: namespaceName,
      }),
      data: {
        edfiOds: {
          ods_IsMapType: true,
          ods_TableName: descriptorNameDescriptor,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const mapTypeEnumeration: MapTypeEnumeration = Object.assign(newMapTypeEnumeration(), {
      metaEdName: mapTypeEnumerationName,
      documentation: mapTypeEnumerationDocumentation,
    });
    descriptor.mapTypeEnumeration = mapTypeEnumeration;

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, descriptor);
    enhance(metaEd);
  });

  it('should create two tables', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(2);
  });

  it('should have descriptor table', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(table).toBeDefined();
    expect(table.name).toBe(descriptorNameDescriptor);
    expect(table.schema).toBe(namespaceName);
    expect(table.description).toBe(descriptorDocumentation);
  });

  it('should have two columns', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(table.columns).toHaveLength(2);
  });

  it('should have primary key', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(R.head(table.columns).name).toBe(`${descriptorName}DescriptorId`);
    expect(R.head(table.columns).isPartOfPrimaryKey).toBe(true);
    expect(R.head(table.columns).isNullable).toBe(false);
    expect(R.head(table.columns).description).not.toBe('');
  });

  it('should have type column', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(R.last(table.columns).name).toBe(`${descriptorNameType}Id`);
    expect(R.last(table.columns).isPartOfPrimaryKey).toBe(false);
    expect(R.last(table.columns).isNullable).toBe(false);
    expect(R.last(table.columns).description).not.toBe('');
  });

  it('should have two foreign keys', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(table.foreignKeys).toHaveLength(2);
  });

  it('should have foreign key to descriptor table', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(R.head(table.foreignKeys).withDeleteCascade).toBe(true);

    expect(R.head(table.foreignKeys).parentTableName).toBe(descriptorNameDescriptor);
    expect(R.head(R.head(table.foreignKeys).columnNames).parentTableColumnName).toBe(`${descriptorNameDescriptor}Id`);

    expect(R.head(table.foreignKeys).foreignTableName).toBe('Descriptor');
    expect(R.head(R.head(table.foreignKeys).columnNames).foreignTableColumnName).toBe('DescriptorId');
  });

  it('should have foreign key to map type enumeration table', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(R.last(table.foreignKeys).columnNames).toHaveLength(1);
    expect(R.last(table.foreignKeys).withDeleteCascade).toBe(false);

    expect(R.last(table.foreignKeys).parentTableName).toBe(descriptorNameDescriptor);
    expect(R.head(R.last(table.foreignKeys).columnNames).parentTableColumnName).toBe(`${descriptorNameType}Id`);

    expect(R.last(table.foreignKeys).foreignTableName).toBe(descriptorNameType);
    expect(R.head(R.last(table.foreignKeys).columnNames).foreignTableColumnName).toBe(`${descriptorNameType}Id`);
  });

  it('should have map type enumeration table', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameType): any);
    expect(table).toBeDefined();
    expect(table.name).toBe(descriptorNameType);
    expect(table.schema).toBe(namespaceName);
    expect(table.description).toBe(mapTypeEnumerationDocumentation);
    expect(table.includeCreateDateColumn).toBe(true);
    expect(table.includeLastModifiedDateAndIdColumn).toBe(true);
  });

  it('should have four columns', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameType): any);
    expect(table.columns).toHaveLength(4);
  });

  it('should have one primary key', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameType): any);
    expect(R.head(table.columns).name).toBe(`${descriptorNameType}Id`);
    expect(R.head(table.columns).isIdentityDatabaseType).toBe(true);
    expect(R.head(table.columns).isPartOfPrimaryKey).toBe(true);
    expect(R.head(table.columns).isNullable).toBe(false);
    expect(R.last(table.columns).description).not.toBe('');
  });

  it('should have code value column', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameType): any);
    const column = R.head(table.columns.filter(x => x.name === 'CodeValue'));
    expect(column).toBeDefined();
    expect(column.length).toBe('50');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });

  it('should have description column', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameType): any);
    const column = R.head(table.columns.filter(x => x.name === 'Description'));
    expect(column).toBeDefined();
    expect(column.length).toBe('1024');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });

  it('should have short description column', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameType): any);
    const column = R.head(table.columns.filter(x => x.name === 'ShortDescription'));
    expect(column).toBeDefined();
    expect(column.length).toBe('450');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });
});

describe('when DescriptorTableEnhancer enhances descriptor with optional map type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespaceName';
  const descriptorName: string = 'DescriptorName';
  const descriptorNameDescriptor: string = `${descriptorName}Descriptor`;
  const descriptorNameType: string = `${descriptorName}Type`;
  const descriptorDocumentation: string = 'DescriptorDocumentation';
  const mapTypeEnumerationName: string = `${descriptorName}Map`;
  const mapTypeEnumerationDocumentation: string = 'MapTypeEnumerationDocumentation';

  beforeAll(() => {
    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorName,
      documentation: descriptorDocumentation,
      isMapTypeOptional: true,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace: namespaceName,
      }),
      data: {
        edfiOds: {
          ods_IsMapType: true,
          ods_TableName: descriptorNameDescriptor,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const mapTypeEnumeration: MapTypeEnumeration = Object.assign(newMapTypeEnumeration(), {
      metaEdName: mapTypeEnumerationName,
      documentation: mapTypeEnumerationDocumentation,
    });
    descriptor.mapTypeEnumeration = mapTypeEnumeration;

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, descriptor);
    enhance(metaEd);
  });

  it('should create two tables', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(2);
  });

  it('should have descriptor table', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(table).toBeDefined();
    expect(table.name).toBe(descriptorNameDescriptor);
    expect(table.schema).toBe(namespaceName);
    expect(table.description).toBe(descriptorDocumentation);
  });

  it('should have two columns', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(table.columns).toHaveLength(2);
  });

  it('should have primary key', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(R.head(table.columns).name).toBe(`${descriptorName}DescriptorId`);
    expect(R.head(table.columns).isPartOfPrimaryKey).toBe(true);
    expect(R.head(table.columns).isNullable).toBe(false);
    expect(R.head(table.columns).description).not.toBe('');
  });

  it('should have type column', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(R.last(table.columns).name).toBe(`${descriptorNameType}Id`);
    expect(R.last(table.columns).isPartOfPrimaryKey).toBe(false);
    expect(R.last(table.columns).isNullable).toBe(true);
    expect(R.last(table.columns).description).not.toBe('');
  });

  it('should have two foreign keys', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(table.foreignKeys).toHaveLength(2);
  });

  it('should have foreign key to descriptor table', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(R.head(table.foreignKeys).withDeleteCascade).toBe(true);

    expect(R.head(table.foreignKeys).parentTableName).toBe(descriptorNameDescriptor);
    expect(R.head(R.head(table.foreignKeys).columnNames).parentTableColumnName).toBe(`${descriptorNameDescriptor}Id`);

    expect(R.head(table.foreignKeys).foreignTableName).toBe('Descriptor');
    expect(R.head(R.head(table.foreignKeys).columnNames).foreignTableColumnName).toBe('DescriptorId');
  });

  it('should have foreign key to map type enumeration table', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(R.last(table.foreignKeys).columnNames).toHaveLength(1);
    expect(R.last(table.foreignKeys).withDeleteCascade).toBe(false);

    expect(R.last(table.foreignKeys).parentTableName).toBe(descriptorNameDescriptor);
    expect(R.head(R.last(table.foreignKeys).columnNames).parentTableColumnName).toBe(`${descriptorNameType}Id`);

    expect(R.last(table.foreignKeys).foreignTableName).toBe(descriptorNameType);
    expect(R.head(R.last(table.foreignKeys).columnNames).foreignTableColumnName).toBe(`${descriptorNameType}Id`);
  });

  it('should have map type enumeration table', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameType): any);
    expect(table).toBeDefined();
    expect(table.name).toBe(descriptorNameType);
    expect(table.schema).toBe(namespaceName);
    expect(table.description).toBe(mapTypeEnumerationDocumentation);
    expect(table.includeCreateDateColumn).toBe(true);
    expect(table.includeLastModifiedDateAndIdColumn).toBe(true);
  });

  it('should have four columns', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameType): any);
    expect(table.columns).toHaveLength(4);
  });

  it('should have one primary key', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameType): any);
    expect(R.head(table.columns).name).toBe(`${descriptorNameType}Id`);
    expect(R.head(table.columns).isIdentityDatabaseType).toBe(true);
    expect(R.head(table.columns).isPartOfPrimaryKey).toBe(true);
    expect(R.head(table.columns).isNullable).toBe(false);
    expect(R.last(table.columns).description).not.toBe('');
  });

  it('should have code value column', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameType): any);
    const column = R.head(table.columns.filter(x => x.name === 'CodeValue'));
    expect(column).toBeDefined();
    expect(column.length).toBe('50');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });

  it('should have description column', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameType): any);
    const column = R.head(table.columns.filter(x => x.name === 'Description'));
    expect(column).toBeDefined();
    expect(column.length).toBe('1024');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });

  it('should have short description column', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameType): any);
    const column = R.head(table.columns.filter(x => x.name === 'ShortDescription'));
    expect(column).toBeDefined();
    expect(column.length).toBe('450');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });
});

describe('when DescriptorTableEnhancer enhances descriptor with map type name ending with \'Type\'', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespaceName';
  const descriptorName: string = 'DescriptorName';
  const descriptorNameDescriptor: string = `${descriptorName}Descriptor`;
  const descriptorNameType: string = `${descriptorName}Type`;
  const descriptorDocumentation: string = 'DescriptorDocumentation';
  const mapTypeEnumerationName: string = `${descriptorNameType}Map`;
  const mapTypeEnumerationDocumentation: string = 'MapTypeEnumerationDocumentation';

  beforeAll(() => {
    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorNameType,
      documentation: descriptorDocumentation,
      isMapTypeOptional: true,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace: namespaceName,
      }),
      data: {
        edfiOds: {
          ods_IsMapType: true,
          ods_TableName: descriptorNameDescriptor,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const mapTypeEnumeration: MapTypeEnumeration = Object.assign(newMapTypeEnumeration(), {
      metaEdName: mapTypeEnumerationName,
      documentation: mapTypeEnumerationDocumentation,
    });
    descriptor.mapTypeEnumeration = mapTypeEnumeration;

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, descriptor);
    enhance(metaEd);
  });

  it('should create two tables', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(2);
  });

  it('should have descriptor table', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(table).toBeDefined();
    expect(table.name).toBe(descriptorNameDescriptor);
    expect(table.schema).toBe(namespaceName);
    expect(table.description).toBe(descriptorDocumentation);
  });

  it('should have two columns', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(table.columns).toHaveLength(2);
  });

  it('should have primary key', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(R.head(table.columns).name).toBe(`${descriptorNameType}DescriptorId`);
    expect(R.head(table.columns).isPartOfPrimaryKey).toBe(true);
    expect(R.head(table.columns).isNullable).toBe(false);
    expect(R.head(table.columns).description).not.toBe('');
  });

  it('should have type column', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(R.last(table.columns).name).toBe(`${descriptorNameType}Id`);
    expect(R.last(table.columns).isPartOfPrimaryKey).toBe(false);
    expect(R.last(table.columns).isNullable).toBe(true);
    expect(R.last(table.columns).description).not.toBe('');
  });

  it('should have two foreign keys', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(table.foreignKeys).toHaveLength(2);
  });

  it('should have foreign key to descriptor table', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(R.head(table.foreignKeys).withDeleteCascade).toBe(true);

    expect(R.head(table.foreignKeys).parentTableName).toBe(descriptorNameDescriptor);
    expect(R.head(R.head(table.foreignKeys).columnNames).parentTableColumnName).toBe(`${descriptorNameDescriptor}Id`);

    expect(R.head(table.foreignKeys).foreignTableName).toBe('Descriptor');
    expect(R.head(R.head(table.foreignKeys).columnNames).foreignTableColumnName).toBe('DescriptorId');
  });

  it('should have foreign key to map type enumeration table', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameDescriptor): any);
    expect(R.last(table.foreignKeys).columnNames).toHaveLength(1);
    expect(R.last(table.foreignKeys).withDeleteCascade).toBe(false);

    expect(R.last(table.foreignKeys).parentTableName).toBe(descriptorNameDescriptor);
    expect(R.head(R.last(table.foreignKeys).columnNames).parentTableColumnName).toBe(`${descriptorNameType}Id`);

    expect(R.last(table.foreignKeys).foreignTableName).toBe(descriptorNameType);
    expect(R.head(R.last(table.foreignKeys).columnNames).foreignTableColumnName).toBe(`${descriptorNameType}Id`);
  });

  it('should have map type enumeration table', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameType): any);
    expect(table).toBeDefined();
    expect(table.name).toBe(descriptorNameType);
    expect(table.schema).toBe(namespaceName);
    expect(table.description).toBe(mapTypeEnumerationDocumentation);
    expect(table.includeCreateDateColumn).toBe(true);
    expect(table.includeLastModifiedDateAndIdColumn).toBe(true);
  });

  it('should have four columns', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameType): any);
    expect(table.columns).toHaveLength(4);
  });

  it('should have one primary key', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameType): any);
    expect(R.head(table.columns).name).toBe(`${descriptorNameType}Id`);
    expect(R.head(table.columns).isIdentityDatabaseType).toBe(true);
    expect(R.head(table.columns).isPartOfPrimaryKey).toBe(true);
    expect(R.head(table.columns).isNullable).toBe(false);
    expect(R.last(table.columns).description).not.toBe('');
  });

  it('should have code value column', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameType): any);
    const column = R.head(table.columns.filter(x => x.name === 'CodeValue'));
    expect(column).toBeDefined();
    expect(column.length).toBe('50');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });

  it('should have description column', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameType): any);
    const column = R.head(table.columns.filter(x => x.name === 'Description'));
    expect(column).toBeDefined();
    expect(column.length).toBe('1024');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });

  it('should have short description column', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorNameType): any);
    const column = R.head(table.columns.filter(x => x.name === 'ShortDescription'));
    expect(column).toBeDefined();
    expect(column.length).toBe('450');
    expect(column.isPartOfPrimaryKey).toBe(false);
    expect(column.isNullable).toBe(false);
    expect(column.description).not.toBe('');
  });
});
