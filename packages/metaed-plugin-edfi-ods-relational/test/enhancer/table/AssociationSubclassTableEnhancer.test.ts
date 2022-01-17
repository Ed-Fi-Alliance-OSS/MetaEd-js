import {
  addEntityForNamespace,
  newAssociation,
  newAssociationSubclass,
  newIntegerProperty,
  newMetaEdEnvironment,
  newNamespace,
} from '@edfi/metaed-core';
import { Association, AssociationSubclass, IntegerProperty, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { tableEntities } from '../../../src/enhancer/EnhancerHelper';
import { enhance } from '../../../src/enhancer/table/AssociationSubclassTableEnhancer';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../../src/model/EdFiOdsRelationalEntityRepository';
import { Table } from '../../../src/model/database/Table';

describe('when AssociationSubclassTableEnhancer enhances association subclass', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const documentation = 'Documentation';
  const associationSubclassName = 'AssociationSubclassName';
  const associationSubclassPropertyName = 'AssociationSubclassPropertyName';

  beforeAll(() => {
    const associationName = 'AssociationName';
    const association: Association = Object.assign(newAssociation(), {
      namespace,
      documentation,
      metaEdName: associationName,
      data: {
        edfiOdsRelational: {
          odsTableId: associationName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const associationPkPropertyName = 'AssociationPkPropertyName';
    const associationPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: associationPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: association,
      data: {
        edfiOdsRelational: {
          odsName: associationPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    association.data.edfiOdsRelational.odsProperties.push(associationPkProperty);
    addEntityForNamespace(association);

    const associationSubclass: AssociationSubclass = Object.assign(newAssociationSubclass(), {
      namespace: extensionNamespace,
      documentation,
      metaEdName: associationSubclassName,
      baseEntityName: associationName,
      baseEntity: association,
      data: {
        edfiOdsRelational: {
          odsTableId: associationSubclassName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const associationSubclassProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: associationSubclassPropertyName,
      isPartOfIdentity: false,
      parentEntity: associationSubclass,
      data: {
        edfiOdsRelational: {
          odsName: associationSubclassPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    associationSubclass.data.edfiOdsRelational.odsProperties.push(associationSubclassProperty);
    addEntityForNamespace(associationSubclass);

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).size).toBe(1);
    expect(tableEntities(metaEd, extensionNamespace).get(associationSubclassName)).toBeDefined();
  });

  it('should have schema equal to namespace', (): void => {
    expect((tableEntities(metaEd, extensionNamespace).get(associationSubclassName) as Table).schema).toBe('extension');
  });

  it('should have description equal to documentation', (): void => {
    expect((tableEntities(metaEd, extensionNamespace).get(associationSubclassName) as Table).description).toBe(
      documentation,
    );
  });

  it('should have one column', (): void => {
    const table: Table = tableEntities(metaEd, extensionNamespace).get(associationSubclassName) as Table;
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(associationSubclassPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(false);
  });
});

describe('when AssociationSubclassTableEnhancer enhances association subclass with primary key', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const documentation = 'Documentation';
  const associationSubclassName = 'AssociationSubclassName';
  const associationSubclassPkPropertyName = 'AssociationSubclassPkPropertyName';

  beforeAll(() => {
    const associationName = 'AssociationName';
    const association: Association = Object.assign(newAssociation(), {
      namespace,
      documentation,
      metaEdName: associationName,
      data: {
        edfiOdsRelational: {
          odsTableId: associationName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const associationPkPropertyName = 'AssociationPkPropertyName';
    const associationPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: associationPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: association,
      data: {
        edfiOdsRelational: {
          odsName: associationPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    association.data.edfiOdsRelational.odsProperties.push(associationPkProperty);
    addEntityForNamespace(association);

    const associationSubclass: AssociationSubclass = Object.assign(newAssociationSubclass(), {
      namespace: extensionNamespace,
      documentation,
      metaEdName: associationSubclassName,
      baseEntityName: associationName,
      baseEntity: association,
      data: {
        edfiOdsRelational: {
          odsTableId: associationSubclassName,
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const associationSubclassPkProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      namespace: extensionNamespace,
      metaEdName: associationSubclassPkPropertyName,
      isPartOfIdentity: true,
      parentEntity: associationSubclass,
      data: {
        edfiOdsRelational: {
          odsName: associationSubclassPkPropertyName,
          odsContextPrefix: '',
        },
      },
    });
    associationSubclass.data.edfiOdsRelational.odsProperties.push(associationSubclassPkProperty);
    addEntityForNamespace(associationSubclass);

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    enhance(metaEd);
  });

  it('should create a table', (): void => {
    expect(tableEntities(metaEd, extensionNamespace).size).toBe(1);
    expect(tableEntities(metaEd, extensionNamespace).get(associationSubclassName)).toBeDefined();
  });

  it('should have one primary key column', (): void => {
    const table: Table = tableEntities(metaEd, extensionNamespace).get(associationSubclassName) as Table;
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(associationSubclassPkPropertyName);
    expect(table.columns[0].isPartOfPrimaryKey).toBe(true);
  });
});
