import R from 'ramda';
import { newMetaEdEnvironment, newNamespace, newEnumerationProperty, newEnumeration } from 'metaed-core';
import { MetaEdEnvironment, EnumerationProperty, Enumeration, Namespace } from 'metaed-core';
import { enhance } from '../../../src/enhancer/property/EnumerationReferenceEnhancer';

describe('when enhancing enumeration property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: EnumerationProperty = Object.assign(newEnumerationProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      parentEntityName,
    });
    metaEd.propertyIndex.enumeration.push(property);

    const parentEntity: Enumeration = Object.assign(newEnumeration(), {
      metaEdName: parentEntityName,
      namespace,
      properties: [property],
    });
    namespace.entity.enumeration.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Enumeration = Object.assign(newEnumeration(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.enumeration.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', (): void => {
    const property = R.head(metaEd.propertyIndex.enumeration.filter((p) => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
    expect(property.referencedEntity.inReferences).toContain(property);
    expect(property.parentEntity.outReferences).toContain(property);
  });
});

describe('when enhancing deprecated enumeration property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: EnumerationProperty = Object.assign(newEnumerationProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      parentEntityName,
    });
    metaEd.propertyIndex.enumeration.push(property);

    const parentEntity: Enumeration = Object.assign(newEnumeration(), {
      metaEdName: parentEntityName,
      namespace,
      properties: [property],
    });
    namespace.entity.enumeration.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Enumeration = Object.assign(newEnumeration(), {
      metaEdName: referencedEntityName,
      namespace,
      isDeprecated: true,
    });
    namespace.entity.enumeration.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have deprecation flag set', (): void => {
    const property = R.head(metaEd.propertyIndex.enumeration.filter((p) => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntityDeprecated).toBe(true);
  });
});

describe('when enhancing enumeration property across namespaces', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: EnumerationProperty = Object.assign(newEnumerationProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace: extensionNamespace,
      parentEntityName,
    });
    metaEd.propertyIndex.enumeration.push(property);

    const parentEntity: Enumeration = Object.assign(newEnumeration(), {
      metaEdName: parentEntityName,
      namespace: extensionNamespace,
      properties: [property],
    });
    extensionNamespace.entity.enumeration.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Enumeration = Object.assign(newEnumeration(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.enumeration.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', (): void => {
    const property = R.head(metaEd.propertyIndex.enumeration.filter((p) => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
    expect(property.referencedEntity.inReferences).toContain(property);
    expect(property.parentEntity.outReferences).toContain(property);
  });
});
