// @flow
import R from 'ramda';
import {
  addEntityForNamespace,
  addProperty,
  newDomainEntity,
  newDomainEntityProperty,
  newMetaEdEnvironment,
  newSharedInteger,
  newSharedIntegerProperty,
  newNamespace,
} from 'metaed-core';
import type { MetaEdEnvironment, Namespace } from 'metaed-core';
import { enhance } from '../../src/enhancer/InheritedDocumentationCopyingEnhancer';

describe('when enhancing shared integer property with inherited documentation', () => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'edfi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityDocumentation: string = 'ReferencedEntityDocumentation';
  const referencedEntityName: string = 'ReferencedEntityName';

  beforeAll(() => {
    const referencedEntity = Object.assign(newSharedInteger(), {
      metaEdName: referencedEntityName,
      documentation: referencedEntityDocumentation,
      namespace,
    });

    const property = Object.assign(newSharedIntegerProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
      referencedEntity,
      documentationInherited: true,
      namespace,
    });

    const parentEntity = Object.assign(newDomainEntity(), {
      metaEdName: parentEntityName,
      properties: [property],
      namespace,
    });

    addEntityForNamespace(referencedEntity);
    addEntityForNamespace(parentEntity);
    addProperty(metaEd.propertyIndex, property);

    enhance(metaEd);
  });

  it('should have correct referenced entity', () => {
    const property = R.head(metaEd.propertyIndex.sharedInteger.filter(p => p.metaEdName === referencedEntityName));
    expect(property.documentation).toBe(referencedEntityDocumentation);
  });
});

describe('when enhancing domain entity property with inherited documentation', () => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'edfi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityDocumentation: string = 'ReferencedEntityDocumentation';
  const referencedEntityName: string = 'ReferencedEntityName';

  beforeAll(() => {
    const referencedEntity = Object.assign(newDomainEntity(), {
      metaEdName: referencedEntityName,
      documentation: referencedEntityDocumentation,
      namespace,
    });

    const property = Object.assign(newDomainEntityProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
      referencedEntity,
      documentationInherited: true,
      namespace,
    });

    const parentEntity = Object.assign(newDomainEntity(), {
      metaEdName: parentEntityName,
      properties: [property],
      namespace,
    });

    addEntityForNamespace(referencedEntity);
    addEntityForNamespace(parentEntity);
    addProperty(metaEd.propertyIndex, property);

    enhance(metaEd);
  });

  it('should have correct referenced entity', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter(p => p.metaEdName === referencedEntityName));
    expect(property.documentation).toBe(referencedEntityDocumentation);
  });
});
