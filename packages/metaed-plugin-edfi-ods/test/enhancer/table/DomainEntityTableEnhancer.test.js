// @flow
import R from 'ramda';
import {
  addEntity,
  newCommon,
  newCommonProperty,
  newDescriptor,
  newDescriptorProperty,
  newDomainEntity,
  newDomainEntityProperty,
  newEnumeration,
  newEnumerationProperty,
  newIntegerProperty,
  newMetaEdEnvironment,
  newNamespace,
  NoTopLevelEntity,
} from 'metaed-core';
import type {
  Common,
  CommonProperty,
  Descriptor,
  DescriptorProperty,
  DomainEntity,
  DomainEntityProperty,
  Enumeration,
  EnumerationProperty,
  IntegerProperty,
  MetaEdEnvironment,
  TopLevelEntity,
} from 'metaed-core';
import { enhance } from '../../../src/enhancer/table/DomainEntityTableEnhancer';
import { enhance as initializeEdFiOdsEntityRepository } from '../../../src/model/EdFiOdsEntityRepository';
import type { ForeignKey } from '../../../src/model/database/ForeignKey';
import type { Table } from '../../../src/model/database/Table';

describe('when DomainEntityTableEnhancer enhances entity with simple property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const entityName: string = 'EntityName';
  const documentation: string = 'Documentation';
  const propertyName: string = 'PropertyName';
  let entity: TopLevelEntity = NoTopLevelEntity;

  beforeAll(() => {
    entity = Object.assign(newDomainEntity(), {
      metaEdName: entityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_TableName: entityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const property: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: propertyName,
      withContext: '',
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    entity.data.edfiOds.ods_Properties.push(property);

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entity);
    enhance(metaEd);
  });

  it('should create a table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(1);
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName)).toBeDefined();
  });

  it('should have schema equal to namespace', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName).schema).toBe(namespaceName);
  });

  it('should have description equal to documentation', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName).description).toBe(documentation);
  });

  it('should have one column', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName);
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].name).toBe(propertyName);
  });

  it('should reference the original entity', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName);
    expect(table.parentEntity).toBe(entity);
  });
});

describe('when DomainEntityTableEnhancer enhances entity with required collection property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const entityName: string = 'EntityName';
  const domainEntityName: string = 'DomainEntityName';
  const documentation: string = 'Documentation';
  const entityPkPropertyName: string = 'EntityPkPropertyName';
  const domainEntityPkPropertyName: string = 'DomainEntityPkPropertyName';

  beforeAll(() => {
    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: entityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_TableName: entityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const entityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: entityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    const requiredCollectionProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName,
      withContext: '',
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: true,
        },
      },
    });
    entity.data.edfiOds.ods_IdentityProperties.push(entityPkProperty);
    entity.data.edfiOds.ods_Properties.push(entityPkProperty);
    entity.data.edfiOds.ods_Properties.push(requiredCollectionProperty);

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_TableName: domainEntityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const domainEntityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: domainEntityPkPropertyName,
      isPartOfIdentity: true,
      withContext: '',
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    domainEntity.data.edfiOds.ods_IdentityProperties.push(domainEntityPkProperty);
    domainEntity.data.edfiOds.ods_Properties.push(domainEntityPkProperty);
    requiredCollectionProperty.referencedEntity = domainEntity;

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entity);
    addEntity(metaEd.entity, domainEntity);
    enhance(metaEd);
  });

  it('should create three tables', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(3);
  });

  it('should create table for entity with one primary key column', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName);
    expect(table).toBeDefined();

    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].name).toBe(entityPkPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
  });

  it('should create table for domainEntity with one primary key column', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntityName);
    expect(table).toBeDefined();

    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].name).toBe(domainEntityPkPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
  });

  it('should create join table from entity and domainEntity', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName + domainEntityName)).toBeDefined();
  });

  it('should have join table with two columns', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName + domainEntityName).columns).toHaveLength(2);
  });

  it('should have join table with foreign key to entity', () => {
    const joinTable: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName + domainEntityName);
    expect(joinTable.columns[0].name).toBe(entityPkPropertyName);
    expect(joinTable.columns[0].isPartOfPrimaryKey).toBe(true);
  });

  it('should have join table with foreign key to domainEntity', () => {
    const joinTable: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName + domainEntityName);
    expect(joinTable.columns[1].name).toBe(domainEntityPkPropertyName);
    expect(joinTable.columns[1].isPartOfPrimaryKey).toBe(true);
  });
});

describe('when DomainEntityTableEnhancer enhances entity with required collection common property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName: string = 'namespace';
  const entityName: string = 'EntityName';
  const commonName: string = 'CommonName';
  const documentation: string = 'Documentation';
  const entityPkPropertyName: string = 'EntityPkPropertyName';
  const commonPkPropertyName: string = 'CommonPkPropertyName';

  beforeAll(() => {
    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: entityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_TableName: entityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const entityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: entityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    const requiredCollectionProperty: CommonProperty = Object.assign(newCommonProperty(), {
      metaEdName: commonName,
      withContext: '',
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_Name: commonName,
          ods_ContextPrefix: '',
          ods_IsCollection: true,
        },
      },
    });
    entity.data.edfiOds.ods_IdentityProperties.push(entityPkProperty);
    entity.data.edfiOds.ods_Properties.push(entityPkProperty);
    entity.data.edfiOds.ods_Properties.push(requiredCollectionProperty);

    const common: Common = Object.assign(newCommon(), {
      metaEdName: commonName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_TableName: commonName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const commonPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonPkPropertyName,
      isPartOfIdentity: true,
      withContext: '',
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    common.data.edfiOds.ods_IdentityProperties.push(commonPkProperty);
    common.data.edfiOds.ods_Properties.push(commonPkProperty);
    requiredCollectionProperty.referencedEntity = common;

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entity);
    addEntity(metaEd.entity, common);
    enhance(metaEd);
  });

  it('should create two tables', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(2);
  });

  it('should create table for entity with one primary key column', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName);
    expect(table).toBeDefined();

    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].name).toBe(entityPkPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
  });

  it('should create join table from entity and domainEntity', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName + commonName)).toBeDefined();
  });

  it('should have join table with two columns', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName + commonName).columns).toHaveLength(2);
  });

  it('should have join table with foreign key to common', () => {
    const joinTable: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName + commonName);
    expect(joinTable.columns[0].name).toBe(commonPkPropertyName);
    expect(joinTable.columns[0].isPartOfPrimaryKey).toBe(true);
  });

  it('should have join table with foreign key to entity', () => {
    const joinTable: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName + commonName);
    expect(joinTable.columns[1].name).toBe(entityPkPropertyName);
    expect(joinTable.columns[1].isPartOfPrimaryKey).toBe(true);
  });
});

describe('when DomainEntityTableEnhancer enhances entity with primary key reference to another entity with a non primary key reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const entityPkPropertyName: string = 'EntityPkPropertyName';
  const referencedEntityName: string = 'ReferencedEntityName';
  const referencedEntityPkPropertyName: string = 'ReferencedEntityPkPropertyName';
  const subReferencedEntityName: string = 'SubReferencedEntityName';
  const subReferencedEntityPkPropertyName: string = 'SubReferencedEntityPkPropertyName';

  beforeAll(() => {
    const namespaceName: string = 'namespace';
    const documentation: string = 'Documentation';
    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: entityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_TableName: entityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const entityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: entityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    const requiredProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: referencedEntityName,
      isRequired: true,
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    entity.data.edfiOds.ods_IdentityProperties.push(entityPkProperty);
    entity.data.edfiOds.ods_Properties.push(entityPkProperty);
    entity.data.edfiOds.ods_Properties.push(requiredProperty);

    const referencedEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: referencedEntityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_TableName: referencedEntityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const referencedEntityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: referencedEntityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: referencedEntity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    const referencedEntityRequiredProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: subReferencedEntityName,
      isRequired: true,
      parentEntity: referencedEntity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    referencedEntity.data.edfiOds.ods_IdentityProperties.push(referencedEntityPkProperty);
    referencedEntity.data.edfiOds.ods_Properties.push(referencedEntityPkProperty);
    referencedEntity.data.edfiOds.ods_Properties.push(referencedEntityRequiredProperty);
    requiredProperty.referencedEntity = referencedEntity;

    const subReferencedEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: subReferencedEntityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_TableName: subReferencedEntityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const subReferencedEntityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: subReferencedEntityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: subReferencedEntity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    subReferencedEntity.data.edfiOds.ods_IdentityProperties.push(subReferencedEntityPkProperty);
    subReferencedEntity.data.edfiOds.ods_Properties.push(subReferencedEntityPkProperty);
    referencedEntityRequiredProperty.referencedEntity = subReferencedEntity;

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entity);
    addEntity(metaEd.entity, referencedEntity);
    addEntity(metaEd.entity, subReferencedEntity);
    enhance(metaEd);
  });

  it('should create three tables', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(3);
  });

  it('should create table for entity with one primary key and one non primary key column', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName);
    expect(table).toBeDefined();

    expect(table.columns).toHaveLength(2);
    expect(table.columns[0].name).toBe(entityPkPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);

    expect(table.columns[1].name).toBe(referencedEntityPkPropertyName);
    expect(table.columns[1].isPartOfPrimaryKey).toBe(false);
  });

  it('should create table for referencedEntity with one primary key and one non primary key column', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(referencedEntityName);
    expect(table).toBeDefined();

    expect(table.columns).toHaveLength(2);
    expect(table.columns[0].name).toBe(referencedEntityPkPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);

    expect(table.columns[1].name).toBe(subReferencedEntityPkPropertyName);
    expect(table.columns[1].isPartOfPrimaryKey).toBe(false);
  });
});

describe('when DomainEntityTableEnhancer enhances entity with primary key reference to another entity with a primary key reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const entityPkPropertyName: string = 'EntityPkPropertyName';
  const referencedEntityName: string = 'ReferencedEntityName';
  const referencedEntityPkPropertyName: string = 'ReferencedEntityPkPropertyName';
  const subReferencedEntityName: string = 'SubReferencedEntityName';
  const subReferencedEntityPkPropertyName: string = 'SubReferencedEntityPkPropertyName';

  beforeAll(() => {
    const namespaceName: string = 'namespace';
    const documentation: string = 'Documentation';
    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: entityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_TableName: entityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const entityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: entityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    const entityRequiredProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: referencedEntityName,
      isRequired: true,
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    entity.data.edfiOds.ods_IdentityProperties.push(entityPkProperty);
    entity.data.edfiOds.ods_Properties.push(entityPkProperty);
    entity.data.edfiOds.ods_Properties.push(entityRequiredProperty);

    const referencedEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: referencedEntityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_TableName: referencedEntityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const referencedEntityPkProperty1: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: referencedEntityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: referencedEntity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    const referencedEntityPkProperty2: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: subReferencedEntityName,
      isPartOfIdentity: true,
      parentEntity: referencedEntity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    referencedEntity.data.edfiOds.ods_IdentityProperties.push(referencedEntityPkProperty1);
    referencedEntity.data.edfiOds.ods_IdentityProperties.push(referencedEntityPkProperty2);
    referencedEntity.data.edfiOds.ods_Properties.push(referencedEntityPkProperty1);
    referencedEntity.data.edfiOds.ods_Properties.push(referencedEntityPkProperty2);
    entityRequiredProperty.referencedEntity = referencedEntity;

    const subReferencedEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: subReferencedEntityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_TableName: subReferencedEntityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const subReferencedEntityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: subReferencedEntityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: subReferencedEntity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    subReferencedEntity.data.edfiOds.ods_IdentityProperties.push(subReferencedEntityPkProperty);
    subReferencedEntity.data.edfiOds.ods_Properties.push(subReferencedEntityPkProperty);
    referencedEntityPkProperty2.referencedEntity = subReferencedEntity;

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entity);
    addEntity(metaEd.entity, referencedEntity);
    addEntity(metaEd.entity, subReferencedEntity);
    enhance(metaEd);
  });

  it('should create three tables', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(3);
  });

  it('should create table for entity with one primary key and two non primary key columns', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName);
    expect(table).toBeDefined();

    expect(table.columns).toHaveLength(3);
    expect(table.columns[0].name).toBe(entityPkPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);

    expect(table.columns[1].name).toBe(referencedEntityPkPropertyName);
    expect(table.columns[1].isPartOfPrimaryKey).toBe(false);

    expect(table.columns[2].name).toBe(subReferencedEntityPkPropertyName);
    expect(table.columns[2].isPartOfPrimaryKey).toBe(false);
  });

  it('should create table for referencedEntity with two primary key columns', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(referencedEntityName);
    expect(table).toBeDefined();

    expect(table.columns).toHaveLength(2);
    expect(table.columns[0].name).toBe(referencedEntityPkPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);

    expect(table.columns[1].name).toBe(subReferencedEntityPkPropertyName);
    expect(table.columns[1].isPartOfPrimaryKey).toBe(true);
  });
});

describe("when DomainEntityTableEnhancer enhances entity with collection property whose name starts with the referenced entity's name", () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const referencedEntityName: string = 'EntityNameOfReference';

  beforeAll(() => {
    const namespaceName: string = 'namespace';
    const documentation: string = 'Documentation';
    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: entityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_TableName: entityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const entityCollectionProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: referencedEntityName,
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: true,
        },
      },
    });
    entity.data.edfiOds.ods_Properties.push(entityCollectionProperty);

    const referencedEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: referencedEntityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_TableName: referencedEntityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    entityCollectionProperty.referencedEntity = referencedEntity;

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entity);
    addEntity(metaEd.entity, referencedEntity);
    enhance(metaEd);
  });

  it('should create join table that does not conflict with the referenced entity table name', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName + referencedEntityName)).toBeDefined();
  });
});

describe('when DomainEntityTableEnhancer enhances entity with two reference properties that have same primary key names', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const referencedEntityName1: string = 'ReferencedEntityName1';
  const referencedEntityName2: string = 'ReferencedEntityName2';
  const commonPkPropertyName: string = 'CommonPkPropertyName';

  beforeAll(() => {
    const namespaceName: string = 'namespace';
    const documentation: string = 'Documentation';
    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: entityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_TableName: entityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const entityPkProperty1: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: referencedEntityName1,
      isPartOfIdentity: true,
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    const entityPkProperty2: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: referencedEntityName2,
      isPartOfIdentity: true,
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    entity.data.edfiOds.ods_IdentityProperties.push(entityPkProperty1);
    entity.data.edfiOds.ods_IdentityProperties.push(entityPkProperty2);
    entity.data.edfiOds.ods_Properties.push(entityPkProperty1);
    entity.data.edfiOds.ods_Properties.push(entityPkProperty2);

    const referencedEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: referencedEntityName1,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_TableName: referencedEntityName1,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const referencedEntity1PkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: referencedEntity1,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    referencedEntity1.data.edfiOds.ods_IdentityProperties.push(referencedEntity1PkProperty);
    referencedEntity1.data.edfiOds.ods_Properties.push(referencedEntity1PkProperty);
    entityPkProperty1.referencedEntity = referencedEntity1;

    const referencedEntity2: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: referencedEntityName2,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_TableName: referencedEntityName2,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const referencedEntity2PkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: referencedEntity2,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    referencedEntity2.data.edfiOds.ods_IdentityProperties.push(referencedEntity2PkProperty);
    referencedEntity2.data.edfiOds.ods_Properties.push(referencedEntity2PkProperty);
    entityPkProperty2.referencedEntity = referencedEntity2;

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entity);
    addEntity(metaEd.entity, referencedEntity1);
    addEntity(metaEd.entity, referencedEntity2);
    enhance(metaEd);
  });

  it('should create three tables, one for each entity', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName)).toBeDefined();
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(referencedEntityName1)).toBeDefined();
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(referencedEntityName2)).toBeDefined();
  });
  it('should create single column in entity table', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName);
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].name).toBe(commonPkPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
  });
});

describe('when DomainEntityTableEnhancer enhances entity with optional collection property with context', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const contextName: string = 'ContextName';
  const entityName: string = 'EntityName';
  const optionalCollectionPropertyName: string = 'OptionalCollectionPropertyName';

  beforeAll(() => {
    const namespaceName: string = 'namespace';
    const documentation: string = 'Documentation';
    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: entityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_TableName: entityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const optionalCollectionProperty: EnumerationProperty = Object.assign(newEnumerationProperty(), {
      metaEdName: optionalCollectionPropertyName,
      isOptionalCollection: true,
      withContext: contextName,
      parentEntity: entity,
      referencedEntity: Object.assign(newEnumeration(), {
        data: {
          edfiOds: {
            ods_TableName: 'EnumerationEntityName',
          },
        },
      }),
      data: {
        edfiOds: {
          ods_TypeifiedBaseName: `${optionalCollectionPropertyName}Type`,
          ods_ContextPrefix: contextName,
          ods_IsCollection: true,
        },
      },
    });
    entity.data.edfiOds.ods_Properties.push(optionalCollectionProperty);

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entity);
    enhance(metaEd);
  });

  it('should create two tables', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(2);
  });

  it('should have entity table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName)).toBeDefined();
  });

  it('should have join table with context', () => {
    expect(
      (metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName + contextName + optionalCollectionPropertyName),
    ).toBeDefined();
  });
});

describe('when DomainEntityTableEnhancer enhances entity with collection enumeration property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const enumerationName: string = 'EnumerationName';

  beforeAll(() => {
    const namespaceName: string = 'namespace';
    const documentation: string = 'Documentation';
    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: entityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_Name: entityName,
          ods_TableName: entityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const enumerationProperty: EnumerationProperty = Object.assign(newEnumerationProperty(), {
      metaEdName: enumerationName,
      isOptionalCollection: true,
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_TypeifiedBaseName: `${enumerationName}Type`,
          ods_ContextPrefix: '',
          ods_IsCollection: true,
        },
      },
    });
    entity.data.edfiOds.ods_Properties.push(enumerationProperty);

    const enumeration: Enumeration = Object.assign(newEnumeration(), {
      metaEdName: enumerationName,
      data: {
        edfiOds: {
          ods_TableName: `${enumerationName}Type`,
        },
      },
    });
    enumerationProperty.referencedEntity = enumeration;

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entity);
    enhance(metaEd);
  });

  it('should create two tables', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(2);
  });

  it('should have entity table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName)).toBeDefined();
  });

  it('should have join table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName + enumerationName)).toBeDefined();
  });

  it('should have join table with foreign key to enumeration table', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName + enumerationName);
    const foreignKey: ForeignKey = R.head(table.foreignKeys.filter(x => x.foreignTableName !== entityName));
    expect(foreignKey).toBeDefined();
    expect(foreignKey.foreignTableName).toBe(`${enumerationName}Type`);
  });
});

describe('when DomainEntityTableEnhancer enhances entity with enumeration property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const enumerationName: string = 'EnumerationName';

  beforeAll(() => {
    const namespaceName: string = 'namespace';
    const documentation: string = 'Documentation';
    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: entityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_Name: entityName,
          ods_TableName: entityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const enumerationProperty: EnumerationProperty = Object.assign(newEnumerationProperty(), {
      metaEdName: enumerationName,
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_TypeifiedBaseName: `${enumerationName}Type`,
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    entity.data.edfiOds.ods_Properties.push(enumerationProperty);

    const enumeration: Enumeration = Object.assign(newEnumeration(), {
      metaEdName: enumerationName,
      data: {
        edfiOds: {
          ods_TableName: `${enumerationName}Type`,
        },
      },
    });
    enumerationProperty.referencedEntity = enumeration;

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entity);
    enhance(metaEd);
  });

  it('should create one table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(1);
  });

  it('should have foreign key to enumeration table', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName);
    const foreignKey: ForeignKey = R.head(table.foreignKeys);
    expect(foreignKey).toBeDefined();
    expect(foreignKey.foreignTableName).toBe(`${enumerationName}Type`);
  });
});

describe("when DomainEntityTableEnhancer enhances entity with enumeration property whose name starts with the parent entity's name", () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const enumerationName: string = 'EntityNameForEnumeration';

  beforeAll(() => {
    const namespaceName: string = 'namespace';
    const documentation: string = 'Documentation';
    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: entityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_Name: entityName,
          ods_TableName: entityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const enumerationProperty: EnumerationProperty = Object.assign(newEnumerationProperty(), {
      metaEdName: enumerationName,
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_TypeifiedBaseName: `${enumerationName}Type`,
          ods_ContextPrefix: '',
          ods_IsCollection: true,
        },
      },
    });
    entity.data.edfiOds.ods_Properties.push(enumerationProperty);

    const enumeration: Enumeration = Object.assign(newEnumeration(), {
      metaEdName: enumerationName,
      data: {
        edfiOds: {
          ods_TableName: `${enumerationName}Type`,
        },
      },
    });
    enumerationProperty.referencedEntity = enumeration;

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entity);
    enhance(metaEd);
  });

  it('should create two tables', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(2);
  });

  it('should have entity table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName)).toBeDefined();
  });

  it('should create join table that does not conflict with the parent entity table name', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(enumerationName)).toBeDefined();
  });
});

describe('when DomainEntityTableEnhancer enhances entity with descriptor collection property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const descriptorName: string = 'DescriptorName';

  beforeAll(() => {
    const namespaceName: string = 'namespace';
    const documentation: string = 'Documentation';
    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: entityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_Name: entityName,
          ods_TableName: entityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const descriptorProperty: DescriptorProperty = Object.assign(newDescriptorProperty(), {
      metaEdName: descriptorName,
      isOptionalCollection: true,
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_DescriptorifiedBaseName: `${descriptorName}Descriptor`,
          ods_ContextPrefix: '',
          ods_IsCollection: true,
        },
      },
    });
    entity.data.edfiOds.ods_Properties.push(descriptorProperty);

    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorName,
      data: {
        edfiOds: {
          ods_DescriptorName: `${descriptorName}Descriptor`,
          ods_TableName: `${descriptorName}Descriptor`,
        },
      },
    });
    descriptorProperty.referencedEntity = descriptor;

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entity);
    enhance(metaEd);
  });

  it('should create two tables', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(2);
  });

  it('should have entity table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName)).toBeDefined();
  });

  it('should have join table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName + descriptorName)).toBeDefined();
  });

  it('should have join table with foreign key to descriptor table', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName + descriptorName);
    const foreignKey: ForeignKey = R.head(table.foreignKeys.filter(x => x.foreignTableName !== entityName));
    expect(foreignKey).toBeDefined();
    expect(foreignKey.foreignTableName).toBe(`${descriptorName}Descriptor`);
  });
});

describe('when DomainEntityTableEnhancer enhances entity with descriptor property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const descriptorName: string = 'DescriptorName';

  beforeAll(() => {
    const namespaceName: string = 'namespace';
    const documentation: string = 'Documentation';
    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: entityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_Name: entityName,
          ods_TableName: entityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const descriptorProperty: DescriptorProperty = Object.assign(newDescriptorProperty(), {
      metaEdName: descriptorName,
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_DescriptorifiedBaseName: `${descriptorName}Descriptor`,
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    entity.data.edfiOds.ods_Properties.push(descriptorProperty);

    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorName,
      data: {
        edfiOds: {
          ods_DescriptorName: `${descriptorName}Descriptor`,
          ods_TableName: `${descriptorName}Type`,
        },
      },
    });
    descriptorProperty.referencedEntity = descriptor;

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entity);
    enhance(metaEd);
  });

  it('should create one table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(1);
  });

  it('should have foreign key to descriptor table', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName);
    const foreignKey: ForeignKey = R.head(table.foreignKeys);
    expect(foreignKey).toBeDefined();
    expect(foreignKey.foreignTableName).toBe(`${descriptorName}Descriptor`);
  });
});

describe("when DomainEntityTableEnhancer enhances entity with descriptor collection property whose name starts with the parent entity's name", () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const descriptorName: string = 'EntityNameForDescriptor';

  beforeAll(() => {
    const namespaceName: string = 'namespace';
    const documentation: string = 'Documentation';
    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: entityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_Name: entityName,
          ods_TableName: entityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const descriptorProperty: DescriptorProperty = Object.assign(newDescriptorProperty(), {
      metaEdName: descriptorName,
      isOptionalCollection: true,
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_DescriptorifiedBaseName: `${descriptorName}Descriptor`,
          ods_ContextPrefix: '',
          ods_IsCollection: true,
        },
      },
    });
    entity.data.edfiOds.ods_Properties.push(descriptorProperty);

    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorName,
      data: {
        edfiOds: {
          ods_DescriptorName: `${descriptorName}Descriptor`,
          ods_TableName: `${descriptorName}Descriptor`,
        },
      },
    });
    descriptorProperty.referencedEntity = descriptor;

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entity);
    enhance(metaEd);
  });

  it('should create two tables', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(2);
  });

  it('should have entity table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName)).toBeDefined();
  });

  it('should create join table that does not conflict with the parent entity table name', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(descriptorName)).toBeDefined();
  });
});

describe("when DomainEntityTableEnhancer enhances entity with common collection property whose name starts with the parent entity's name", () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const entityPkPropertyName: string = 'EntityPkPropertyName';
  const commonName: string = 'EntityNameForCommon';
  const commonPkPropertyName: string = 'CommonPkPropertyName';
  const commonNonPkPropertyName: string = 'CommonNonPkPropertyName';

  beforeAll(() => {
    const namespaceName: string = 'namespace';
    const documentation: string = 'Documentation';
    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: entityName,
      documentation,
      namespace: Object.assign(newNamespace(), {
        namespaceName,
      }),
      data: {
        edfiOds: {
          ods_Name: entityName,
          ods_TableName: entityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const entityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: entityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    const commonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      metaEdName: commonName,
      isOptionalCollection: true,
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_Name: commonName,
          ods_ContextPrefix: '',
          ods_IsCollection: true,
        },
      },
    });
    entity.data.edfiOds.ods_IdentityProperties.push(entityPkProperty);
    entity.data.edfiOds.ods_Properties.push(entityPkProperty);
    entity.data.edfiOds.ods_Properties.push(commonProperty);

    const common: Common = Object.assign(newCommon(), {
      metaEdName: commonName,
      data: {
        edfiOds: {
          ods_TableName: commonName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const commonPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    const commonNonPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: commonNonPkPropertyName,
      isPartOfIdentity: false,
      parentEntity: entity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });
    common.data.edfiOds.ods_IdentityProperties.push(commonPkProperty);
    common.data.edfiOds.ods_Properties.push(commonPkProperty);
    common.data.edfiOds.ods_Properties.push(commonNonPkProperty);
    commonProperty.referencedEntity = common;

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entity);
    enhance(metaEd);
  });

  it('should create two tables', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(2);
  });

  it('should have entity table with one primary key', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(entityName);
    expect(table).toBeDefined();

    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].name).toBe(entityPkPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
  });

  it('should create join table with two primary keys and one non primary key', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(commonName);
    expect(table).toBeDefined();

    expect(table.columns).toHaveLength(3);
    expect(table.columns[0].name).toBe(commonPkPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);

    expect(table.columns[1].name).toBe(commonNonPkPropertyName);
    expect(table.columns[1].isPartOfPrimaryKey).toBe(false);

    expect(table.columns[2].name).toBe(entityPkPropertyName);
    expect(table.columns[2].isPartOfPrimaryKey).toBe(true);
  });
});
