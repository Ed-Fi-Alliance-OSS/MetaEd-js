// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  newDomainEntity,
  newDomainEntitySubclass,
  newAssociation,
  newAssociationSubclass,
  newDescriptor,
  newInterchange,
  newInterchangeItem,
  newDomainEntityExtension,
  newInterchangeExtension,
  newNamespace,
  addEntityForNamespace,
  getEntityFromNamespace,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/InterchangeBaseItemEnhancer';

describe('when enhancing interchange in core', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);

  const interchangeMetaEdName = 'InterchangeMetaEdName';

  const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: 'DomainEntity1', namespace });
  const domainEntity2 = Object.assign(newDomainEntity(), { metaEdName: 'DomainEntity2', namespace });
  const domainEntitySubclass1 = Object.assign(newDomainEntitySubclass(), { metaEdName: 'DomainEntitySubclass1', namespace });
  const domainEntitySubclass2 = Object.assign(newDomainEntitySubclass(), { metaEdName: 'DomainEntitySubclass2', namespace });
  const association1 = Object.assign(newAssociation(), { metaEdName: 'Association1', namespace });
  const association2 = Object.assign(newAssociation(), { metaEdName: 'Association2', namespace });
  const associationSubclass1 = Object.assign(newAssociationSubclass(), { metaEdName: 'AssociationSubclass1', namespace });
  const associationSubclass2 = Object.assign(newAssociationSubclass(), { metaEdName: 'AssociationSubclass2', namespace });
  const descriptor1 = Object.assign(newDescriptor(), { metaEdName: 'Descriptor1', namespace });
  const descriptor2 = Object.assign(newDescriptor(), { metaEdName: 'Descriptor2', namespace });

  const elementEntities = [domainEntity1, domainEntitySubclass1, association1, associationSubclass1, descriptor1];
  const identityTemplateEntities = [domainEntity2, domainEntitySubclass2, association2, associationSubclass2, descriptor2];

  beforeAll(() => {
    const interchange = Object.assign(newInterchange(), { metaEdName: interchangeMetaEdName, namespace });
    addEntityForNamespace(interchange);

    elementEntities.forEach((entity) => {
      interchange.elements.push(
        Object.assign(newInterchangeItem(), {
          metaEdName: entity.metaEdName,
          referencedType: [entity.type],
          referencedNamespaceName: namespace.namespaceName,
          namespace,
        }),
      );
      addEntityForNamespace(entity);
    });

    identityTemplateEntities.forEach((entity) => {
      interchange.identityTemplates.push(
        Object.assign(newInterchangeItem(), {
          metaEdName: entity.metaEdName,
          referencedType: [entity.type],
          referencedNamespaceName: namespace.namespaceName,
          namespace,
        }),
      );
      addEntityForNamespace(entity);
    });

    enhance(metaEd);
  });

  it('should have references for all entities', (): void => {
    const interchange: any = getEntityFromNamespace(interchangeMetaEdName, namespace, 'interchange');
    expect(interchange.elements[0].referencedEntity).toBe(domainEntity1);
    expect(interchange.elements[1].referencedEntity).toBe(domainEntitySubclass1);
    expect(interchange.elements[2].referencedEntity).toBe(association1);
    expect(interchange.elements[3].referencedEntity).toBe(associationSubclass1);
    expect(interchange.elements[4].referencedEntity).toBe(descriptor1);

    expect(interchange.identityTemplates[0].referencedEntity).toBe(domainEntity2);
    expect(interchange.identityTemplates[1].referencedEntity).toBe(domainEntitySubclass2);
    expect(interchange.identityTemplates[2].referencedEntity).toBe(association2);
    expect(interchange.identityTemplates[3].referencedEntity).toBe(associationSubclass2);
    expect(interchange.identityTemplates[4].referencedEntity).toBe(descriptor2);
  });
});

describe('when enhancing interchange extension', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);

  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);

  const interchangeMetaEdName = 'InterchangeMetaEdName';

  const domainEntity = Object.assign(newDomainEntity(), { metaEdName: 'DomainEntity', namespace });
  const domainEntityExtension = Object.assign(newDomainEntityExtension(), {
    metaEdName: 'DomainEntity',
    namespace: extensionNamespace,
  });

  beforeAll(() => {
    addEntityForNamespace(domainEntity);
    addEntityForNamespace(domainEntityExtension);

    const interchange = Object.assign(newInterchange(), { metaEdName: interchangeMetaEdName, namespace });
    addEntityForNamespace(interchange);

    const interchangeExtension = Object.assign(newInterchangeExtension(), {
      metaEdName: interchangeMetaEdName,
      namespace: extensionNamespace,
    });
    addEntityForNamespace(interchangeExtension);

    interchange.elements.push(
      Object.assign(newInterchangeItem(), {
        metaEdName: domainEntity.metaEdName,
        referencedType: [domainEntity.type],
        referencedNamespaceName: namespace.namespaceName,
        namespace,
      }),
    );

    interchangeExtension.elements.push(
      Object.assign(newInterchangeItem(), {
        metaEdName: domainEntityExtension.metaEdName,
        referencedType: [domainEntityExtension.type],
        referencedNamespaceName: extensionNamespace.namespaceName,
        extensionNamespace,
      }),
    );

    enhance(metaEd);
  });

  it('should have references for all entities', (): void => {
    const interchange: any = getEntityFromNamespace(interchangeMetaEdName, namespace, 'interchange');
    expect(interchange.elements[0].referencedEntity).toBe(domainEntity);
    expect(interchange.elements[0].referencedEntityDeprecated).toBe(false);

    const interchangeExtension: any = getEntityFromNamespace(
      interchangeMetaEdName,
      extensionNamespace,
      'interchangeExtension',
    );
    expect(interchangeExtension.elements[0].referencedEntity).toBe(domainEntityExtension);
    expect(interchangeExtension.elements[0].referencedEntityDeprecated).toBe(false);
  });
});

describe('when enhancing with deprecated references', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);

  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);

  const interchangeMetaEdName = 'InterchangeMetaEdName';

  const domainEntity = {
    ...newDomainEntity(),
    metaEdName: 'DomainEntity',
    namespace,
    isDeprecated: true,
  };
  const domainEntityExtension = {
    ...newDomainEntityExtension(),
    metaEdName: 'DomainEntity',
    namespace: extensionNamespace,
    isDeprecated: true,
  };

  beforeAll(() => {
    addEntityForNamespace(domainEntity);
    addEntityForNamespace(domainEntityExtension);

    const interchange = Object.assign(newInterchange(), { metaEdName: interchangeMetaEdName, namespace });
    addEntityForNamespace(interchange);

    const interchangeExtension = Object.assign(newInterchangeExtension(), {
      metaEdName: interchangeMetaEdName,
      namespace: extensionNamespace,
    });
    addEntityForNamespace(interchangeExtension);

    interchange.elements.push(
      Object.assign(newInterchangeItem(), {
        metaEdName: domainEntity.metaEdName,
        referencedType: [domainEntity.type],
        referencedNamespaceName: namespace.namespaceName,
        namespace,
      }),
    );

    interchangeExtension.elements.push(
      Object.assign(newInterchangeItem(), {
        metaEdName: domainEntityExtension.metaEdName,
        referencedType: [domainEntityExtension.type],
        referencedNamespaceName: extensionNamespace.namespaceName,
        extensionNamespace,
      }),
    );

    enhance(metaEd);
  });

  it('should have references for all entities', (): void => {
    const interchange: any = getEntityFromNamespace(interchangeMetaEdName, namespace, 'interchange');
    expect(interchange.elements[0].referencedEntity).toBe(domainEntity);
    expect(interchange.elements[0].referencedEntityDeprecated).toBe(true);

    const interchangeExtension: any = getEntityFromNamespace(
      interchangeMetaEdName,
      extensionNamespace,
      'interchangeExtension',
    );
    expect(interchangeExtension.elements[0].referencedEntity).toBe(domainEntityExtension);
    expect(interchangeExtension.elements[0].referencedEntityDeprecated).toBe(true);
  });
});
