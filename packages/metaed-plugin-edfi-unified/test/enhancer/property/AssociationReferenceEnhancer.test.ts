import * as R from 'ramda';
import {
  newMetaEdEnvironment,
  newNamespace,
  newAssociationProperty,
  newAssociation,
  newAssociationSubclass,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, AssociationProperty, Association, AssociationSubclass, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../../src/enhancer/property/AssociationReferenceEnhancer';

describe('when enhancing association property referring to association', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: AssociationProperty = Object.assign(newAssociationProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      parentEntityName,
    });
    metaEd.propertyIndex.association.push(property);

    const parentEntity: Association = Object.assign(newAssociation(), {
      metaEdName: parentEntityName,
      namespace,
      properties: [property],
    });
    namespace.entity.association.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Association = Object.assign(newAssociation(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.association.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', (): void => {
    const property = R.head(metaEd.propertyIndex.association.filter((p) => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
    expect(property.referencedEntity.inReferences).toContain(property);
    expect(property.parentEntity.outReferences).toContain(property);
  });
});

describe('when enhancing association property referring to deprecated association', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: AssociationProperty = Object.assign(newAssociationProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      parentEntityName,
    });
    metaEd.propertyIndex.association.push(property);

    const parentEntity: Association = Object.assign(newAssociation(), {
      metaEdName: parentEntityName,
      namespace,
      properties: [property],
    });
    namespace.entity.association.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Association = Object.assign(newAssociation(), {
      metaEdName: referencedEntityName,
      namespace,
      isDeprecated: true,
    });
    namespace.entity.association.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have deprecation flag set', (): void => {
    const property = R.head(metaEd.propertyIndex.association.filter((p) => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntityDeprecated).toBe(true);
  });
});

describe('when enhancing association property referring to subclass', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: AssociationProperty = Object.assign(newAssociationProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      parentEntityName,
    });
    metaEd.propertyIndex.association.push(property);

    const parentEntity: Association = Object.assign(newAssociation(), {
      metaEdName: parentEntityName,
      namespace,
      properties: [property],
    });
    namespace.entity.association.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: AssociationSubclass = Object.assign(newAssociationSubclass(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.associationSubclass.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', (): void => {
    const property = R.head(metaEd.propertyIndex.association.filter((p) => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
    expect(property.referencedEntity.inReferences).toContain(property);
    expect(property.parentEntity.outReferences).toContain(property);
  });
});

describe('when enhancing association property referring to deprecated subclass', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: AssociationProperty = Object.assign(newAssociationProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      parentEntityName,
    });
    metaEd.propertyIndex.association.push(property);

    const parentEntity: Association = Object.assign(newAssociation(), {
      metaEdName: parentEntityName,
      namespace,
      properties: [property],
    });
    namespace.entity.association.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: AssociationSubclass = Object.assign(newAssociationSubclass(), {
      metaEdName: referencedEntityName,
      namespace,
      isDeprecated: true,
    });
    namespace.entity.associationSubclass.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have deprecation flag set', (): void => {
    const property = R.head(metaEd.propertyIndex.association.filter((p) => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntityDeprecated).toBe(true);
  });
});

describe('when enhancing association property referring to association across namespaces', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: AssociationProperty = Object.assign(newAssociationProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace: extensionNamespace,
      parentEntityName,
    });
    metaEd.propertyIndex.association.push(property);

    const parentEntity: Association = Object.assign(newAssociation(), {
      metaEdName: parentEntityName,
      namespace: extensionNamespace,
      properties: [property],
    });
    extensionNamespace.entity.association.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Association = Object.assign(newAssociation(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.association.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', (): void => {
    const property = R.head(metaEd.propertyIndex.association.filter((p) => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
    expect(property.referencedEntity.inReferences).toContain(property);
    expect(property.parentEntity.outReferences).toContain(property);
  });
});
