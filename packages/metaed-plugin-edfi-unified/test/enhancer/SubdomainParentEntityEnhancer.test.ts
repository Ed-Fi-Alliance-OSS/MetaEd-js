import { newMetaEdEnvironment, newDomain, newSubdomain, addEntityForNamespace, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Domain, Subdomain, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/SubdomainParentEntityEnhancer';

describe('when enhancing subdomain with parent', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const childEntityName = 'ChildEntityName';
  let parentEntity: Domain;
  let childEntity: Subdomain;

  beforeAll(() => {
    parentEntity = Object.assign(newDomain(), {
      metaEdName: parentEntityName,
      namespace,
    });
    addEntityForNamespace(parentEntity);

    childEntity = Object.assign(newSubdomain(), {
      metaEdName: childEntityName,
      parentMetaEdName: parentEntityName,
      namespace,
    });
    addEntityForNamespace(childEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', (): void => {
    expect(childEntity.parent).toBe(parentEntity);
  });
});
