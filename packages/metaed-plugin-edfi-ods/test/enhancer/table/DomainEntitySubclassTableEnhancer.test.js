// @flow
import R from 'ramda';
import {
  addEntity,
  newDomainEntity,
  newDomainEntitySubclass,
  newIntegerProperty,
  newMetaEdEnvironment,
  newNamespaceInfo,
} from 'metaed-core';
import type {
  DomainEntity,
  DomainEntitySubclass,
  IntegerProperty,
  MetaEdEnvironment,
  NamespaceInfo,
} from 'metaed-core';
import { enhance } from '../../../src/enhancer/table/DomainEntitySubclassTableEnhancer';
import { enhance as initializeEdFiOdsEntityRepository } from '../../../src/model/EdFiOdsEntityRepository';
import type { Table } from '../../../src/model/database/Table';

describe('when DomainEntitySubclassTableEnhancer enhances domain entity subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';
  const documentation: string = 'Documentation';
  const domainEntitySubclassName: string = 'DomainEntitySubclassName';
  const domainEntitySubclassPropertyName: string = 'DomainEntitySubclassPropertyName';

  beforeAll(() => {
    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
      extensionEntitySuffix: '',
    });
    const domainEntityName: string = 'DomainEntityName';
    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      namespaceInfo,
      documentation,
      metaEdName: domainEntityName,
      data: {
        edfiOds: {
          ods_TableName: domainEntityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const domainEntityPkPropertyName: string = 'DomainEntityPkPropertyName';
    const domainEntityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: domainEntityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntity,
      data: {
        edfiOds: {
          ods_Name: domainEntityPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    domainEntity.data.edfiOds.ods_Properties.push(domainEntityPkProperty);
    addEntity(metaEd.entity, domainEntity);

    const extensionNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: 'extension',
      isExtension: true,
    });
    const domainEntitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      namespaceInfo,
      documentation,
      metaEdName: domainEntitySubclassName,
      baseEntityName: domainEntityName,
      baseEntity: domainEntity,
      data: {
        edfiOds: {
          ods_TableName: domainEntitySubclassName,
          ods_ExtensionName: domainEntitySubclassName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const domainEntitySubclassProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespaceInfo: extensionNamespaceInfo,
      metaEdName: domainEntitySubclassPropertyName,
      isPartOfIdentity: false,
      parentEntity: domainEntitySubclass,
      data: {
        edfiOds: {
          ods_Name: domainEntitySubclassPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    domainEntitySubclass.data.edfiOds.ods_Properties.push(domainEntitySubclassProperty);
    addEntity(metaEd.entity, domainEntitySubclass);

    initializeEdFiOdsEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(1);
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntitySubclassName)).toBeDefined();
  });

  it('should have schema equal to namespace', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntitySubclassName).schema).toBe(namespace);
  });

  it('should have description equal to documentation', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntitySubclassName).description).toBe(documentation);
  });

  it('should have one column', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntitySubclassName);
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].name).toBe(domainEntitySubclassPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(false);
  });
});

describe('when DomainEntitySubclassTableEnhancer enhances domain entity subclass with primary key', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';
  const documentation: string = 'Documentation';
  const domainEntitySubclassName: string = 'DomainEntitySubclassName';
  const domainEntitySubclassPkPropertyName: string = 'DomainEntitySubclassPkPropertyName';

  beforeAll(() => {
    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
      extensionEntitySuffix: '',
    });
    const domainEntityName: string = 'DomainEntityName';
    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      namespaceInfo,
      documentation,
      metaEdName: domainEntityName,
      data: {
        edfiOds: {
          ods_TableName: domainEntityName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const domainEntityPkPropertyName: string = 'DomainEntityPkPropertyName';
    const domainEntityPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: domainEntityPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntity,
      data: {
        edfiOds: {
          ods_Name: domainEntityPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    domainEntity.data.edfiOds.ods_Properties.push(domainEntityPkProperty);
    addEntity(metaEd.entity, domainEntity);

    const extensionNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: 'extension',
      isExtension: true,
    });
    const domainEntitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      namespaceInfo,
      documentation,
      metaEdName: domainEntitySubclassName,
      baseEntityName: domainEntityName,
      baseEntity: domainEntity,
      data: {
        edfiOds: {
          ods_TableName: domainEntitySubclassName,
          ods_ExtensionName: domainEntitySubclassName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const domainEntitySubclassPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespaceInfo: extensionNamespaceInfo,
      metaEdName: domainEntitySubclassPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: domainEntitySubclass,
      data: {
        edfiOds: {
          ods_Name: domainEntitySubclassPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    domainEntitySubclass.data.edfiOds.ods_Properties.push(domainEntitySubclassPkProperty);
    addEntity(metaEd.entity, domainEntitySubclass);

    initializeEdFiOdsEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(1);
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntitySubclassName)).toBeDefined();
  });

  it('should have one primary key column', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntitySubclassName);
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].name).toBe(domainEntitySubclassPkPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
  });
});

describe('when DomainEntitySubclassTableEnhancer enhances domain entity subclass with identity rename property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';
  const documentation: string = 'Documentation';
  const domainEntityName: string = 'DomainEntityName';
  const domainEntitySubclassName: string = 'DomainEntitySubclassName';
  const domainEntitySubclassRenamePropertyName: string = 'DomainEntitySubclassRenamePropertyName';

  const domainEntityPkPropertyName: string = 'DomainEntityPkPropertyName';
  beforeAll(() => {
    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
      extensionEntitySuffix: '',
    });
    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      namespaceInfo,
      documentation,
      metaEdName: domainEntityName,
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
      parentEntity: domainEntity,
      data: {
        edfiOds: {
          ods_Name: domainEntityPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    domainEntity.data.edfiOds.ods_Properties.push(domainEntityPkProperty);
    addEntity(metaEd.entity, domainEntity);

    const extensionNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: 'extension',
      isExtension: true,
    });
    const domainEntitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      namespaceInfo,
      documentation,
      metaEdName: domainEntitySubclassName,
      baseEntityName: domainEntityName,
      baseEntity: domainEntity,
      data: {
        edfiOds: {
          ods_TableName: domainEntitySubclassName,
          ods_ExtensionName: domainEntitySubclassName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const domainEntitySubclassRenameProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespaceInfo: extensionNamespaceInfo,
      metaEdName: domainEntitySubclassRenamePropertyName,
      isIdentityRename: true,
      baseKeyName: domainEntityPkPropertyName,
      parentEntity: domainEntitySubclass,
      data: {
        edfiOds: {
          ods_Name: domainEntitySubclassRenamePropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    domainEntitySubclass.data.edfiOds.ods_Properties.push(domainEntitySubclassRenameProperty);
    addEntity(metaEd.entity, domainEntitySubclass);

    initializeEdFiOdsEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(1);
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntitySubclassName)).toBeDefined();
  });

  it('should have one column', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntitySubclassName);
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].name).toBe(domainEntitySubclassRenamePropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(false);
  });

  it('should create foreign key to from identity rename property to base entity property', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntitySubclassName);
    expect(table.foreignKeys).toHaveLength(1);
    expect(R.head(table.foreignKeys).parentTableName).toBe(domainEntitySubclassName);
    expect(R.head(table.foreignKeys).foreignTableName).toBe(domainEntityName);
  });
});
