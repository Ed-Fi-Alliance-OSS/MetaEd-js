import * as R from 'ramda';
import {
  newMetaEdEnvironment,
  newNamespace,
  newSchoolYearEnumerationProperty,
  newSchoolYearEnumeration,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, SchoolYearEnumerationProperty, SchoolYearEnumeration, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../../src/enhancer/property/SchoolYearEnumerationReferenceEnhancer';

describe('when enhancing schoolYearEnumeration property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: SchoolYearEnumerationProperty = Object.assign(newSchoolYearEnumerationProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      parentEntityName,
    });
    metaEd.propertyIndex.schoolYearEnumeration.push(property);

    const parentEntity: SchoolYearEnumeration = Object.assign(newSchoolYearEnumeration(), {
      metaEdName: parentEntityName,
      namespace,
      properties: [property],
    });
    namespace.entity.schoolYearEnumeration.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: SchoolYearEnumeration = Object.assign(newSchoolYearEnumeration(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.schoolYearEnumeration.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', (): void => {
    const property = R.head(metaEd.propertyIndex.schoolYearEnumeration.filter((p) => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
    expect(property.referencedEntity.inReferences).toContain(property);
    expect(property.parentEntity.outReferences).toContain(property);
  });
});

describe('when enhancing schoolYearEnumeration property across namespaces', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  const referencedEntityName = 'ReferencedEntityName';

  beforeAll(() => {
    const property: SchoolYearEnumerationProperty = Object.assign(newSchoolYearEnumerationProperty(), {
      metaEdName: referencedEntityName,
      referencedNamespaceName: namespace.namespaceName,
      namespace: extensionNamespace,
      parentEntityName,
    });
    metaEd.propertyIndex.schoolYearEnumeration.push(property);

    const parentEntity: SchoolYearEnumeration = Object.assign(newSchoolYearEnumeration(), {
      metaEdName: parentEntityName,
      namespace: extensionNamespace,
      properties: [property],
    });
    extensionNamespace.entity.schoolYearEnumeration.set(parentEntity.metaEdName, parentEntity);

    const referencedEntity: SchoolYearEnumeration = Object.assign(newSchoolYearEnumeration(), {
      metaEdName: referencedEntityName,
      namespace,
    });
    namespace.entity.schoolYearEnumeration.set(referencedEntity.metaEdName, referencedEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', (): void => {
    const property = R.head(metaEd.propertyIndex.schoolYearEnumeration.filter((p) => p.metaEdName === referencedEntityName));
    expect(property).toBeDefined();
    expect(property.referencedEntity.metaEdName).toBe(referencedEntityName);
    expect(property.referencedEntity.inReferences).toContain(property);
    expect(property.parentEntity.outReferences).toContain(property);
  });
});
