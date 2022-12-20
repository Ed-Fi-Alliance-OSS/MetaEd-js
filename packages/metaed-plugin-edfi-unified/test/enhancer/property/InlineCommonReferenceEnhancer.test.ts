import * as R from 'ramda';
import { newMetaEdEnvironment, newInlineCommonProperty, newInlineCommon, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, InlineCommonProperty, Common, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../../src/enhancer/property/InlineCommonReferenceEnhancer';

describe('when enhancing inlineCommon property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: InlineCommonProperty = Object.assign(newInlineCommonProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      parentEntityName,
    });
    metaEd.propertyIndex.inlineCommon.push(property);

    const parentEntity: Common = Object.assign(newInlineCommon(), {
      metaEdName: parentEntityName,
      namespace,
      properties: [property],
    });
    namespace.entity.common.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Common = Object.assign(newInlineCommon(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.common.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', (): void => {
    const property = R.head(metaEd.propertyIndex.inlineCommon.filter((p) => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
    expect(property.referencedEntity.inReferences).toContain(property);
    expect(property.parentEntity.outReferences).toContain(property);
  });
});

describe('when enhancing inlineCommon property referring to deprecated inline common', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: InlineCommonProperty = Object.assign(newInlineCommonProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      parentEntityName,
    });
    metaEd.propertyIndex.inlineCommon.push(property);

    const parentEntity: Common = Object.assign(newInlineCommon(), {
      metaEdName: parentEntityName,
      namespace,
      properties: [property],
    });
    namespace.entity.common.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Common = Object.assign(newInlineCommon(), {
      metaEdName: referencedEntityName,
      namespace,
      isDeprecated: true,
    });
    namespace.entity.common.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have deprecation flag set', (): void => {
    const property = R.head(metaEd.propertyIndex.inlineCommon.filter((p) => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntityDeprecated).toBe(true);
  });
});

describe('when enhancing inlineCommon property across namespaces', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: InlineCommonProperty = Object.assign(newInlineCommonProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace: extensionNamespace,
      parentEntityName,
    });
    metaEd.propertyIndex.inlineCommon.push(property);

    const parentEntity: Common = Object.assign(newInlineCommon(), {
      metaEdName: parentEntityName,
      namespace: extensionNamespace,
      properties: [property],
    });
    extensionNamespace.entity.common.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: Common = Object.assign(newInlineCommon(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.common.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', (): void => {
    const property = R.head(metaEd.propertyIndex.inlineCommon.filter((p) => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
    expect(property.referencedEntity.inReferences).toContain(property);
    expect(property.parentEntity.outReferences).toContain(property);
  });
});
