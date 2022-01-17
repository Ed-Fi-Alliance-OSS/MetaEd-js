import R from 'ramda';
import { newMetaEdEnvironment, newDescriptorProperty, newDescriptor, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, DescriptorProperty, Descriptor, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../../src/enhancer/property/DescriptorReferenceEnhancer';

describe('when enhancing descriptor property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: DescriptorProperty = Object.assign(newDescriptorProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      parentEntityName,
    });
    metaEd.propertyIndex.descriptor.push(property);

    const parentEntity: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: parentEntityName,
      namespace,
      properties: [property],
    });
    namespace.entity.descriptor.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.descriptor.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', (): void => {
    const property = R.head(metaEd.propertyIndex.descriptor.filter((p) => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
    expect(property.referencedEntity.inReferences).toContain(property);
    expect(property.parentEntity.outReferences).toContain(property);
  });
});

describe('when enhancing descriptor property referring to deprecated descriptor', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: DescriptorProperty = Object.assign(newDescriptorProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      parentEntityName,
    });
    metaEd.propertyIndex.descriptor.push(property);

    const parentEntity: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: parentEntityName,
      namespace,
      properties: [property],
    });
    namespace.entity.descriptor.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: referencedEntityName,
      namespace,
      isDeprecated: true,
    });
    namespace.entity.descriptor.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have deprecation flag set', (): void => {
    const property = R.head(metaEd.propertyIndex.descriptor.filter((p) => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntityDeprecated).toBe(true);
  });
});

describe('when enhancing descriptor property across namespaces', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: DescriptorProperty = Object.assign(newDescriptorProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace: extensionNamespace,
      parentEntityName,
    });
    metaEd.propertyIndex.descriptor.push(property);

    const parentEntity: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: parentEntityName,
      namespace: extensionNamespace,
      properties: [property],
    });
    extensionNamespace.entity.descriptor.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.descriptor.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', (): void => {
    const property = R.head(metaEd.propertyIndex.descriptor.filter((p) => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
    expect(property.referencedEntity.inReferences).toContain(property);
    expect(property.parentEntity.outReferences).toContain(property);
  });
});
