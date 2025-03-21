// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newAssociation,
  newAssociationExtension,
  newAssociationSubclass,
  newDomainEntity,
  newDomainEntityExtension,
  newDomainEntitySubclass,
  newIntegerProperty,
  newMetaEdEnvironment,
  newNamespace,
} from '@edfi/metaed-core';
import {
  Association,
  AssociationExtension,
  AssociationSubclass,
  DomainEntity,
  DomainEntityExtension,
  DomainEntitySubclass,
  IntegerProperty,
  MetaEdEnvironment,
  Namespace,
} from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/TopLevelEntityBaseReferenceEnhancer';

describe('when enhancing domain entity subclass base entity reference', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntityName = 'DomainEntityName';
  const domainEntityDocumentation = 'DomainEntityDocumentation';
  const domainEntitySubclassName = 'DomainEntitySubclassName';

  beforeAll(() => {
    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
      namespace,
      documentation: domainEntityDocumentation,
      data: {
        edfiOdsRelational: {
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName: domainEntityName,
      namespace,
      documentation: 'DomainEntitySubclassDocumentation',
      baseEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    namespace.entity.domainEntity.set(domainEntityName, domainEntity);
    namespace.entity.domainEntitySubclass.set(domainEntitySubclassName, domainEntitySubclass);
    enhance(metaEd);
  });

  it('should create base entity reference property', (): void => {
    const domainEntity: any = namespace.entity.domainEntitySubclass.get(domainEntitySubclassName);
    expect(domainEntity.data.edfiOdsRelational.odsIdentityProperties).toHaveLength(1);

    const referentialProperty: any = domainEntity.data.edfiOdsRelational.odsIdentityProperties[0];
    expect(referentialProperty).toBeDefined();
    expect(referentialProperty.metaEdName).toBe(domainEntityName);
    expect(referentialProperty.documentation).toBe(domainEntityDocumentation);
    expect(referentialProperty.isPartOfIdentity).toBe(true);
    expect(referentialProperty.data.edfiOdsRelational.odsDeleteCascadePrimaryKey).toBe(true);
    expect(referentialProperty.parentEntity).toBe(domainEntity);
    expect(referentialProperty.referencedEntity).toBe(domainEntity.baseEntity);
    expect(referentialProperty.data.edfiOdsRelational.odsIsReferenceToSuperclass).toBe(true);
    expect(referentialProperty.data.edfiOdsRelational.odsIsReferenceToExtensionParent).toBe(false);
  });
});

describe('when enhancing domain entity subclass base entity reference with identity rename', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntityName = 'DomainEntityName';
  const domainEntityDocumentation = 'DomainEntityDocumentation';
  const domainEntitySubclassName = 'DomainEntitySubclassName';
  const IntegerPropertyName2 = 'IntegerPropertyName2';

  beforeAll(() => {
    const integerProperty1: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: 'IntegerPropertyName1',
      namespace,
      isPartOfIdentity: true,
    });
    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
      namespace,
      documentation: domainEntityDocumentation,
      data: {
        edfiOdsRelational: {
          odsProperties: [integerProperty1],
          odsIdentityProperties: [integerProperty1],
        },
      },
    });

    const integerProperty2: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: IntegerPropertyName2,
      isPartOfIdentity: true,
      isIdentityRename: true,
    });
    const domainEntitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName: domainEntityName,
      namespace,
      documentation: 'DomainEntitySubclassDocumentation',
      baseEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsProperties: [integerProperty2],
          odsIdentityProperties: [integerProperty2],
        },
      },
    });
    namespace.entity.domainEntity.set(domainEntityName, domainEntity);
    namespace.entity.domainEntitySubclass.set(domainEntitySubclassName, domainEntitySubclass);
    enhance(metaEd);
  });

  it('should not create base entity reference property', (): void => {
    const domainEntity: any = namespace.entity.domainEntitySubclass.get(domainEntitySubclassName);
    expect(domainEntity.data.edfiOdsRelational.odsIdentityProperties).toHaveLength(1);

    const referentialProperty: any = domainEntity.data.edfiOdsRelational.odsIdentityProperties[0];
    expect(referentialProperty).toBeDefined();
    expect(referentialProperty.metaEdName).toBe(IntegerPropertyName2);
  });
});

describe('when enhancing domain entity extension base entity reference', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntityName = 'DomainEntityName';
  const domainEntityDocumentation = 'DomainEntityDocumentation';
  const domainEntityExtensionName = 'DomainEntityExtensionName';

  beforeAll(() => {
    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
      namespace,
      documentation: domainEntityDocumentation,
      data: {
        edfiOdsRelational: {
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const domainEntityExtension: DomainEntityExtension = Object.assign(newDomainEntityExtension(), {
      metaEdName: domainEntityName,
      namespace,
      documentation: 'DomainEntityExtensionDocumentation',
      baseEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    namespace.entity.domainEntity.set(domainEntityName, domainEntity);
    namespace.entity.domainEntityExtension.set(domainEntityExtensionName, domainEntityExtension);
    enhance(metaEd);
  });

  it('should create base entity reference property', (): void => {
    const domainEntity: any = namespace.entity.domainEntityExtension.get(domainEntityExtensionName);
    expect(domainEntity.data.edfiOdsRelational.odsIdentityProperties).toHaveLength(1);

    const referentialProperty: any = domainEntity.data.edfiOdsRelational.odsIdentityProperties[0];
    expect(referentialProperty).toBeDefined();
    expect(referentialProperty.metaEdName).toBe(domainEntityName);
    expect(referentialProperty.documentation).toBe(domainEntityDocumentation);
    expect(referentialProperty.isPartOfIdentity).toBe(true);
    expect(referentialProperty.data.edfiOdsRelational.odsDeleteCascadePrimaryKey).toBe(true);
    expect(referentialProperty.parentEntity).toBe(domainEntity);
    expect(referentialProperty.referencedEntity).toBe(domainEntity.baseEntity);
    expect(referentialProperty.data.edfiOdsRelational.odsIsReferenceToSuperclass).toBe(false);
    expect(referentialProperty.data.edfiOdsRelational.odsIsReferenceToExtensionParent).toBe(true);
  });
});

describe('when enhancing association subclass base entity reference', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const associationName = 'AssociationName';
  const associationDocumentation = 'AssociationDocumentation';
  const associationSubclassName = 'AssociationSubclassName';

  beforeAll(() => {
    const association: Association = Object.assign(newAssociation(), {
      metaEdName: associationName,
      namespace,
      documentation: associationDocumentation,
      data: {
        edfiOdsRelational: {
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const associationSubclass: AssociationSubclass = Object.assign(newAssociationSubclass(), {
      metaEdName: associationName,
      namespace,
      documentation: 'AssociationSubclassDocumentation',
      baseEntity: association,
      data: {
        edfiOdsRelational: {
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    namespace.entity.association.set(associationName, association);
    namespace.entity.associationSubclass.set(associationSubclassName, associationSubclass);
    enhance(metaEd);
  });

  it('should create base entity reference property', (): void => {
    const association: any = namespace.entity.associationSubclass.get(associationSubclassName);
    expect(association.data.edfiOdsRelational.odsIdentityProperties).toHaveLength(1);

    const referentialProperty: any = association.data.edfiOdsRelational.odsIdentityProperties[0];
    expect(referentialProperty).toBeDefined();
    expect(referentialProperty.metaEdName).toBe(associationName);
    expect(referentialProperty.documentation).toBe(associationDocumentation);
    expect(referentialProperty.isPartOfIdentity).toBe(true);
    expect(referentialProperty.data.edfiOdsRelational.odsDeleteCascadePrimaryKey).toBe(true);
    expect(referentialProperty.parentEntity).toBe(association);
    expect(referentialProperty.referencedEntity).toBe(association.baseEntity);
    expect(referentialProperty.data.edfiOdsRelational.odsIsReferenceToSuperclass).toBe(true);
    expect(referentialProperty.data.edfiOdsRelational.odsIsReferenceToExtensionParent).toBe(false);
  });
});

describe('when enhancing association extension base entity reference', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const associationName = 'AssociationName';
  const associationDocumentation = 'AssociationDocumentation';
  const associationExtensionName = 'AssociationExtensionName';

  beforeAll(() => {
    const association: Association = Object.assign(newAssociation(), {
      metaEdName: associationName,
      namespace,
      documentation: associationDocumentation,
      data: {
        edfiOdsRelational: {
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const associationExtension: AssociationExtension = Object.assign(newAssociationExtension(), {
      metaEdName: associationName,
      namespace,
      documentation: 'AssociationExtensionDocumentation',
      baseEntity: association,
      data: {
        edfiOdsRelational: {
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    namespace.entity.association.set(associationName, association);
    namespace.entity.associationExtension.set(associationExtensionName, associationExtension);
    enhance(metaEd);
  });

  it('should create base entity reference property', (): void => {
    const association: any = namespace.entity.associationExtension.get(associationExtensionName);
    expect(association.data.edfiOdsRelational.odsIdentityProperties).toHaveLength(1);

    const referentialProperty: any = association.data.edfiOdsRelational.odsIdentityProperties[0];
    expect(referentialProperty).toBeDefined();
    expect(referentialProperty.metaEdName).toBe(associationName);
    expect(referentialProperty.documentation).toBe(associationDocumentation);
    expect(referentialProperty.isPartOfIdentity).toBe(true);
    expect(referentialProperty.data.edfiOdsRelational.odsDeleteCascadePrimaryKey).toBe(true);
    expect(referentialProperty.parentEntity).toBe(association);
    expect(referentialProperty.referencedEntity).toBe(association.baseEntity);
    expect(referentialProperty.data.edfiOdsRelational.odsIsReferenceToSuperclass).toBe(false);
    expect(referentialProperty.data.edfiOdsRelational.odsIsReferenceToExtensionParent).toBe(true);
  });
});
