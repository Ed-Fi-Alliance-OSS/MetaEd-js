// @flow
import {
  addEntity,
  newAssociation,
  newAssociationSubclass,
  newIntegerProperty,
  newMetaEdEnvironment,
  newNamespaceInfo,
} from 'metaed-core';
import type {
  Association,
  AssociationSubclass,
  IntegerProperty,
  MetaEdEnvironment,
  NamespaceInfo,
} from 'metaed-core';
import { enhance } from '../../../src/enhancer/table/AssociationSubclassTableEnhancer';
import { enhance as initializeEdFiOdsEntityRepository } from '../../../src/model/EdFiOdsEntityRepository';
import type { Table } from '../../../src/model/database/Table';

describe('when AssociationSubclassTableEnhancer enhances association subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';
  const documentation: string = 'Documentation';
  const associationSubclassName: string = 'AssociationSubclassName';
  const associationSubclassPropertyName: string = 'AssociationSubclassPropertyName';

  beforeAll(() => {
    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
      extensionEntitySuffix: '',
    });
    const associationName: string = 'AssociationName';
    const association: Association = Object.assign(newAssociation(), {
      namespaceInfo,
      documentation,
      metaEdName: associationName,
      data: {
        edfiOds: {
          ods_TableName: associationName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const associationPkPropertyName: string = 'AssociationPkPropertyName';
    const associationPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: associationPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: association,
      data: {
        edfiOds: {
          ods_Name: associationPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    association.data.edfiOds.ods_Properties.push(associationPkProperty);
    addEntity(metaEd.entity, association);

    const extensionNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: 'extension',
      isExtension: true,
    });
    const associationSubclass: AssociationSubclass = Object.assign(newAssociationSubclass(), {
      namespaceInfo,
      documentation,
      metaEdName: associationSubclassName,
      baseEntityName: associationName,
      baseEntity: association,
      data: {
        edfiOds: {
          ods_TableName: associationSubclassName,
          ods_ExtensionName: associationSubclassName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const associationSubclassProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespaceInfo: extensionNamespaceInfo,
      metaEdName: associationSubclassPropertyName,
      isPartOfIdentity: false,
      parentEntity: associationSubclass,
      data: {
        edfiOds: {
          ods_Name: associationSubclassPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    associationSubclass.data.edfiOds.ods_Properties.push(associationSubclassProperty);
    addEntity(metaEd.entity, associationSubclass);

    initializeEdFiOdsEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(1);
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationSubclassName)).toBeDefined();
  });

  it('should have schema equal to namespace', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationSubclassName).schema).toBe(namespace);
  });

  it('should have description equal to documentation', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationSubclassName).description).toBe(documentation);
  });

  it('should have one column', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(associationSubclassName);
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].name).toBe(associationSubclassPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(false);
  });
});

describe('when AssociationSubclassTableEnhancer enhances association subclass with primary key', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';
  const documentation: string = 'Documentation';
  const associationSubclassName: string = 'AssociationSubclassName';
  const associationSubclassPkPropertyName: string = 'AssociationSubclassPkPropertyName';

  beforeAll(() => {
    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
      extensionEntitySuffix: '',
    });
    const associationName: string = 'AssociationName';
    const association: Association = Object.assign(newAssociation(), {
      namespaceInfo,
      documentation,
      metaEdName: associationName,
      data: {
        edfiOds: {
          ods_TableName: associationName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const associationPkPropertyName: string = 'AssociationPkPropertyName';
    const associationPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: associationPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: association,
      data: {
        edfiOds: {
          ods_Name: associationPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    association.data.edfiOds.ods_Properties.push(associationPkProperty);
    addEntity(metaEd.entity, association);

    const extensionNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: 'extension',
      isExtension: true,
    });
    const associationSubclass: AssociationSubclass = Object.assign(newAssociationSubclass(), {
      namespaceInfo,
      documentation,
      metaEdName: associationSubclassName,
      baseEntityName: associationName,
      baseEntity: association,
      data: {
        edfiOds: {
          ods_TableName: associationSubclassName,
          ods_ExtensionName: associationSubclassName,
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const associationSubclassPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespaceInfo: extensionNamespaceInfo,
      metaEdName: associationSubclassPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: associationSubclass,
      data: {
        edfiOds: {
          ods_Name: associationSubclassPkPropertyName,
          ods_ContextPrefix: '',
        },
      },
    });
    associationSubclass.data.edfiOds.ods_Properties.push(associationSubclassPkProperty);
    addEntity(metaEd.entity, associationSubclass);

    initializeEdFiOdsEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(1);
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get(associationSubclassName)).toBeDefined();
  });

  it('should have one primary key column', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(associationSubclassName);
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].name).toBe(associationSubclassPkPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
  });
});
