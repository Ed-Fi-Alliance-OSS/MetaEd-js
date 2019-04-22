import R from 'ramda';
import { newMetaEdEnvironment, newNamespace, newChoiceProperty, newChoice } from 'metaed-core';
import { MetaEdEnvironment, ChoiceProperty, Choice, Namespace } from 'metaed-core';
import { enhance } from '../../../src/enhancer/property/ChoiceReferenceEnhancer';

describe('when enhancing choice property', () => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: ChoiceProperty = Object.assign(newChoiceProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      parentEntityName,
    });
    metaEd.propertyIndex.choice.push(property);

    const parentEntity: Choice = Object.assign(newChoice(), {
      metaEdName: parentEntityName,
      namespace,
      properties: [property],
    });
    namespace.entity.choice.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Choice = Object.assign(newChoice(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.choice.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    const property = R.head(metaEd.propertyIndex.choice.filter(p => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
    expect(property.referencedEntity.inReferences).toContain(property);
    expect(property.parentEntity.outReferences).toContain(property);
  });
});

describe('when enhancing choice property across namespaces', () => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: ChoiceProperty = Object.assign(newChoiceProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace: extensionNamespace,
      parentEntityName,
    });
    metaEd.propertyIndex.choice.push(property);

    const parentEntity: Choice = Object.assign(newChoice(), {
      metaEdName: parentEntityName,
      namespace: extensionNamespace,
      properties: [property],
    });
    extensionNamespace.entity.choice.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Choice = Object.assign(newChoice(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.choice.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', () => {
    const property = R.head(metaEd.propertyIndex.choice.filter(p => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
    expect(property.referencedEntity.inReferences).toContain(property);
    expect(property.parentEntity.outReferences).toContain(property);
  });
});
