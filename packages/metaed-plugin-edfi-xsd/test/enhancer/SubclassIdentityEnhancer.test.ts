// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  newAssociation,
  newAssociationProperty,
  newAssociationSubclass,
  newNamespace,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, Association, AssociationSubclass, AssociationProperty, Namespace } from '@edfi/metaed-core';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance as copyPropertiesEnhance } from '../../src/enhancer/CopyPropertiesEnhancer';
import { enhance } from '../../src/enhancer/SubclassIdentityEnhancer';

describe('when enhancing association subclass without identity renames', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const baseAssociationName = 'BaseName';
  const subclassAssociationName = 'SubclassName';
  let baseIdentityProperty: AssociationProperty;
  let subclassIdentityProperty: AssociationProperty;

  beforeAll(() => {
    baseIdentityProperty = {
      ...newAssociationProperty(),
      metaEdName: 'BaseIdentityProperty',
      namespace,
      isPartOfIdentity: true,
    };

    const baseAssociation: Association = {
      ...newAssociation(),
      metaEdName: baseAssociationName,
      namespace,
      properties: [baseIdentityProperty],
      identityProperties: [baseIdentityProperty],
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.association.set(baseAssociation.metaEdName, baseAssociation);

    subclassIdentityProperty = {
      ...newAssociationProperty(),
      metaEdName: 'SubclassIdentityProperty',
      namespace,
      isPartOfIdentity: true,
    };

    const subclassAssociation: AssociationSubclass = {
      ...newAssociationSubclass(),
      metaEdName: subclassAssociationName,
      namespace,
      baseEntityName: baseAssociationName,
      baseEntity: baseAssociation,
      properties: [subclassIdentityProperty],
      identityProperties: [subclassIdentityProperty],
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.associationSubclass.set(subclassAssociation.metaEdName, subclassAssociation);

    initializeTopLevelEntities(metaEd);
    copyPropertiesEnhance(metaEd);
    enhance(metaEd);
  });

  it('should add base identity property to subclass primary key list', (): void => {
    const associationSubclass: any = namespace.entity.associationSubclass.get(subclassAssociationName);
    expect(associationSubclass.data.edfiXsd.xsdIdentityProperties).toContain(baseIdentityProperty);
  });

  it('should still have original identity', (): void => {
    const associationSubclass: any = namespace.entity.associationSubclass.get(subclassAssociationName);
    expect(associationSubclass.data.edfiXsd.xsdIdentityProperties).toContain(subclassIdentityProperty);
  });

  it('should not have base identity in properties', (): void => {
    const associationSubclass: any = namespace.entity.associationSubclass.get(subclassAssociationName);
    expect(associationSubclass.data.edfiXsd.xsdProperties).not.toContain(baseIdentityProperty);
  });
});

describe('when enhancing association subclass with identity renames', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const baseAssociationName = 'BaseName';
  const baseIdentityName = 'BaseKeyName';
  const subclassAssociationName = 'SubclassName';
  let baseIdentityProperty: AssociationProperty;
  let subclassIdentityProperty: AssociationProperty;
  let subclassIdentityRenameProperty: AssociationProperty;

  beforeAll(() => {
    baseIdentityProperty = { ...newAssociationProperty(), metaEdName: baseIdentityName, namespace, isPartOfIdentity: true };

    const baseAssociation: Association = {
      ...newAssociation(),
      metaEdName: baseAssociationName,
      namespace,
      properties: [baseIdentityProperty],
      identityProperties: [baseIdentityProperty],
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.association.set(baseAssociation.metaEdName, baseAssociation);

    subclassIdentityProperty = {
      ...newAssociationProperty(),
      metaEdName: 'SubclassIdentityProperty',
      namespace,
      isPartOfIdentity: true,
    };

    subclassIdentityRenameProperty = {
      ...newAssociationProperty(),
      metaEdName: 'SubclassIdentityRenameProperty',
      namespace,
      isIdentityRename: true,
      baseKeyName: baseIdentityName,
    };

    const subclassAssociation: AssociationSubclass = {
      ...newAssociationSubclass(),
      metaEdName: subclassAssociationName,
      namespace,
      baseEntityName: baseAssociationName,
      baseEntity: baseAssociation,
      properties: [subclassIdentityProperty, subclassIdentityRenameProperty],
      identityProperties: [subclassIdentityProperty, subclassIdentityRenameProperty],
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.associationSubclass.set(subclassAssociation.metaEdName, subclassAssociation);

    initializeTopLevelEntities(metaEd);
    copyPropertiesEnhance(metaEd);
    enhance(metaEd);
  });

  it('should not add renamed identity property to subclass', (): void => {
    const associationSubclass: any = namespace.entity.associationSubclass.get(subclassAssociationName);
    expect(associationSubclass.data.edfiXsd.xsdIdentityProperties).not.toContain(baseIdentityProperty);
  });
});
