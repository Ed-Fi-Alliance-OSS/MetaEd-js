// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newDomainEntity, newIntegerProperty, newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { DomainEntity, IntegerProperty, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/CreateUsisFromUniqueIdsEnhancer';

describe('when enhancing entity with unique id property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntityName = 'DomainEntityName';
  let integerProperty: IntegerProperty;

  beforeAll(() => {
    integerProperty = {
      ...newIntegerProperty(),
      metaEdName: 'UniqueId',
      namespace,
      roleName: 'RoleNameName',
      shortenTo: 'ShortenToName',
      documentation: 'IntegerPropertyDocumentation',
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    };

    const domainEntity: DomainEntity = {
      ...newDomainEntity(),
      metaEdName: domainEntityName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsProperties: [integerProperty],
          odsIdentityProperties: [integerProperty],
        },
      },
    };

    namespace.entity.domainEntity.set(domainEntityName, domainEntity);
    enhance(metaEd);
  });

  it('should remove unique id property', (): void => {
    const domainEntity: any = namespace.entity.domainEntity.get(domainEntityName);
    expect(domainEntity.data.edfiOdsRelational.odsProperties).not.toContain(integerProperty);
    expect(domainEntity.data.edfiOdsRelational.odsIdentityProperties).not.toContain(integerProperty);
  });

  it('should add unique id copy as not part of identity', (): void => {
    const domainEntity: any = namespace.entity.domainEntity.get(domainEntityName);
    const property: any = domainEntity.data.edfiOdsRelational.odsProperties.find(
      (x) => x.metaEdName === integerProperty.metaEdName,
    );
    expect(property).toBeDefined();
    expect(property.metaEdName).toBe(integerProperty.metaEdName);
    expect(property.roleName).toBe(integerProperty.roleName);
    expect(property.shortenTo).toBe(integerProperty.shortenTo);
    expect(property.documentation).toBe(integerProperty.documentation);
    expect(property.isPartOfIdentity).toBe(false);
    expect(property.data.edfiOdsRelational.odsIsIdentityDatabaseType).toBe(false);
    expect(property.data.edfiOdsRelational.odsIsUniqueIndex).toBe(true);
  });

  it('should add usi property', (): void => {
    const domainEntity: any = namespace.entity.domainEntity.get(domainEntityName);
    const property: any = domainEntity.data.edfiOdsRelational.odsProperties.find((x) => x.metaEdName === 'USI');
    expect(property).toBeDefined();
    expect(property.metaEdName).toBe('USI');
    expect(property.roleName).toBe(integerProperty.roleName);
    expect(property.shortenTo).toBe(integerProperty.shortenTo);
    expect(property.documentation).toBe(integerProperty.documentation);
    expect(property.isPartOfIdentity).toBe(true);
    expect(property.parentEntityName).toBe(integerProperty.parentEntityName);
    expect(property.parentEntity).toBe(integerProperty.parentEntity);
    expect(property.data.edfiOdsRelational.odsName).toBe(`${integerProperty.roleName}USI`);
    expect(property.data.edfiOdsRelational.odsIsCollection).toBe(false);
    expect(property.data.edfiOdsRelational.odsContextPrefix).toBe(integerProperty.shortenTo);
    expect(property.data.edfiOdsRelational.odsIsIdentityDatabaseType).toBe(true);
    expect(property.data.edfiOdsRelational.odsIsUniqueIndex).toBe(false);
    expect(domainEntity.data.edfiOdsRelational.odsProperties).toContain(property);
    expect(domainEntity.data.edfiOdsRelational.odsIdentityProperties).toContain(property);
  });
});

describe('when enhancing entity with unique id property and additional identity property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntityName = 'DomainEntityName';
  let integerIdentityProperty: IntegerProperty;
  let uniqueIdProperty: IntegerProperty;

  beforeAll(() => {
    uniqueIdProperty = {
      ...newIntegerProperty(),
      metaEdName: 'UniqueId',
      namespace,
      roleName: 'RoleNameName',
      shortenTo: 'ShortenToName',
      documentation: 'doc',
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    };

    integerIdentityProperty = {
      ...newIntegerProperty(),
      metaEdName: 'IntegerIdentityProperty',
      namespace,
      documentation: 'doc',
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    };

    const domainEntity: DomainEntity = {
      ...newDomainEntity(),
      metaEdName: domainEntityName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsProperties: [uniqueIdProperty, integerIdentityProperty],
          odsIdentityProperties: [uniqueIdProperty, integerIdentityProperty],
        },
      },
    };

    namespace.entity.domainEntity.set(domainEntityName, domainEntity);
    enhance(metaEd);
  });

  it('should remove unique id property', (): void => {
    const domainEntity: any = namespace.entity.domainEntity.get(domainEntityName);
    expect(domainEntity.data.edfiOdsRelational.odsProperties).not.toContain(uniqueIdProperty);
    expect(domainEntity.data.edfiOdsRelational.odsIdentityProperties).not.toContain(uniqueIdProperty);
  });

  it('should remove integer identity property', (): void => {
    const domainEntity: any = namespace.entity.domainEntity.get(domainEntityName);
    expect(domainEntity.data.edfiOdsRelational.odsProperties).not.toContain(integerIdentityProperty);
    expect(domainEntity.data.edfiOdsRelational.odsIdentityProperties).not.toContain(integerIdentityProperty);
  });

  it('should add unique id copy as not part of identity', (): void => {
    const domainEntity: any = namespace.entity.domainEntity.get(domainEntityName);
    const property: any = domainEntity.data.edfiOdsRelational.odsProperties.find(
      (x) => x.metaEdName === uniqueIdProperty.metaEdName,
    );
    expect(property).toBeDefined();
    expect(property.metaEdName).toBe(uniqueIdProperty.metaEdName);
    expect(property.roleName).toBe(uniqueIdProperty.roleName);
    expect(property.shortenTo).toBe(uniqueIdProperty.shortenTo);
    expect(property.documentation).toBe(uniqueIdProperty.documentation);
    expect(property.isPartOfIdentity).toBe(false);
    expect(property.data.edfiOdsRelational.odsIsIdentityDatabaseType).toBe(false);
    expect(property.data.edfiOdsRelational.odsIsUniqueIndex).toBe(true);
  });

  it('should add integer identity copy as not part of identity', (): void => {
    const domainEntity: any = namespace.entity.domainEntity.get(domainEntityName);
    const property: any = domainEntity.data.edfiOdsRelational.odsProperties.find(
      (x) => x.metaEdName === integerIdentityProperty.metaEdName,
    );
    expect(property).toBeDefined();
    expect(property.metaEdName).toBe(integerIdentityProperty.metaEdName);
    expect(property.documentation).toBe(integerIdentityProperty.documentation);
    expect(property.isPartOfIdentity).toBe(false);
    expect(property.data.edfiOdsRelational.odsIsIdentityDatabaseType).toBe(false);
    expect(property.data.edfiOdsRelational.odsIsUniqueIndex).toBe(true);
  });

  it('should add usi property', (): void => {
    const domainEntity: any = namespace.entity.domainEntity.get(domainEntityName);
    const property: any = domainEntity.data.edfiOdsRelational.odsProperties.find((x) => x.metaEdName === 'USI');
    expect(property).toBeDefined();
    expect(property.metaEdName).toBe('USI');
    expect(property.roleName).toBe(uniqueIdProperty.roleName);
    expect(property.shortenTo).toBe(uniqueIdProperty.shortenTo);
    expect(property.documentation).toBe(uniqueIdProperty.documentation);
    expect(property.isPartOfIdentity).toBe(true);
    expect(property.parentEntityName).toBe(uniqueIdProperty.parentEntityName);
    expect(property.parentEntity).toBe(uniqueIdProperty.parentEntity);
    expect(property.data.edfiOdsRelational.odsName).toBe(`${uniqueIdProperty.roleName}USI`);
    expect(property.data.edfiOdsRelational.odsIsCollection).toBe(false);
    expect(property.data.edfiOdsRelational.odsContextPrefix).toBe(uniqueIdProperty.shortenTo);
    expect(property.data.edfiOdsRelational.odsIsIdentityDatabaseType).toBe(true);
    expect(property.data.edfiOdsRelational.odsIsUniqueIndex).toBe(false);
    expect(domainEntity.data.edfiOdsRelational.odsProperties).toContain(property);
    expect(domainEntity.data.edfiOdsRelational.odsIdentityProperties).toContain(property);
  });
});

describe('when enhancing entity with non unique id property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntityName = 'DomainEntityName';
  let integerProperty: IntegerProperty;

  beforeAll(() => {
    integerProperty = {
      ...newIntegerProperty(),
      metaEdName: 'UniqueID',
      namespace,
      roleName: 'RoleNameName',
      shortenTo: 'ShortenToName',
      documentation: 'IntegerPropertyDocumentation',
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    };

    const domainEntity: DomainEntity = {
      ...newDomainEntity(),
      metaEdName: domainEntityName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsProperties: [integerProperty],
          odsIdentityProperties: [integerProperty],
        },
      },
    };

    namespace.entity.domainEntity.set(domainEntityName, domainEntity);
    enhance(metaEd);
  });

  it('should not remove property', (): void => {
    const domainEntity: any = namespace.entity.domainEntity.get(domainEntityName);
    expect(domainEntity.data.edfiOdsRelational.odsProperties).toContain(integerProperty);
    expect(domainEntity.data.edfiOdsRelational.odsIdentityProperties).toContain(integerProperty);
  });

  it('should not add additional properties', (): void => {
    const domainEntity: any = namespace.entity.domainEntity.get(domainEntityName);
    expect(domainEntity.data.edfiOdsRelational.odsProperties).toHaveLength(1);
    expect(domainEntity.data.edfiOdsRelational.odsIdentityProperties).toHaveLength(1);
  });
});

describe('when enhancing entity with unique id property in extension namespace', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const domainEntityName = 'DomainEntityName';
  let integerProperty: IntegerProperty;

  beforeAll(() => {
    integerProperty = {
      ...newIntegerProperty(),
      metaEdName: 'UniqueID',
      roleName: 'RoleNameName',
      shortenTo: 'ShortenToName',
      documentation: 'IntegerPropertyDocumentation',
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    };

    const domainEntity: DomainEntity = {
      ...newDomainEntity(),
      metaEdName: domainEntityName,
      namespace: extensionNamespace,
      data: {
        edfiOdsRelational: {
          odsProperties: [integerProperty],
          odsIdentityProperties: [integerProperty],
        },
      },
    };

    namespace.entity.domainEntity.set(domainEntityName, domainEntity);
    enhance(metaEd);
  });

  it('should not remove property', (): void => {
    const domainEntity: any = namespace.entity.domainEntity.get(domainEntityName);
    expect(domainEntity.data.edfiOdsRelational.odsProperties).toContain(integerProperty);
    expect(domainEntity.data.edfiOdsRelational.odsIdentityProperties).toContain(integerProperty);
  });

  it('should not add additional properties', (): void => {
    const domainEntity: any = namespace.entity.domainEntity.get(domainEntityName);
    expect(domainEntity.data.edfiOdsRelational.odsProperties).toHaveLength(1);
    expect(domainEntity.data.edfiOdsRelational.odsIdentityProperties).toHaveLength(1);
  });
});
