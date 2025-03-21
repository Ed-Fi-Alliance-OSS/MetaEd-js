// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  AssociationBuilder,
  AssociationExtensionBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/AbstractEntity/AbstractGeneralStudentProgramAssociationMustNotBeExtended';

describe('when validating association additions', (): void => {
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '3.2.0-c' };
  const associationName = 'AssociationName';
  let coreNamespace: Namespace;
  let extensionNamespace: Namespace;
  let failures: ValidationFailure[];

  beforeAll(() => {
    const coreNamespaceName = 'EdFi';
    const extensionNamespaceName = 'Extension';

    MetaEdTextBuilder.build()
      .withBeginNamespace(coreNamespaceName)
      .withStartAssociation(associationName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('PropertyName1', 'Documentation')
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace(extensionNamespaceName)
      .withStartAssociationExtension(associationName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('PropertyName2', 'Documentation')
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get(coreNamespaceName) as any;
    extensionNamespace = metaEd.namespace.get(extensionNamespaceName) as any;
    extensionNamespace.dependencies = [coreNamespace];

    failures = validate(metaEd);
  });

  it('should build association and association extension', (): void => {
    expect(coreNamespace.entity.association.size).toBe(1);
    expect(extensionNamespace.entity.associationExtension.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating abstract GeneralStudentProgramAssociation additions', (): void => {
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '3.2.0-c' };
  const generalStudentProgramAssociation = 'GeneralStudentProgramAssociation';
  let coreNamespace: Namespace;
  let extensionNamespace: Namespace;
  let failures: ValidationFailure[];

  beforeAll(() => {
    const coreNamespaceName = 'EdFi';
    const extensionNamespaceName = 'Extension';

    MetaEdTextBuilder.build()
      .withBeginNamespace(coreNamespaceName)
      .withStartAssociation(generalStudentProgramAssociation)
      .withDocumentation('Documentation')
      .withIntegerIdentity('PropertyName1', 'Documentation')
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace(extensionNamespaceName)
      .withStartAssociationExtension(generalStudentProgramAssociation)
      .withDocumentation('Documentation')
      .withIntegerIdentity('PropertyName2', 'Documentation')
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get(coreNamespaceName) as any;
    extensionNamespace = metaEd.namespace.get(extensionNamespaceName) as any;
    extensionNamespace.dependencies = [coreNamespace];

    failures = validate(metaEd);
  });

  it('should build abstract entity and domain entity extension', (): void => {
    expect(coreNamespace.entity.association.size).toBe(1);
    expect(extensionNamespace.entity.associationExtension.size).toBe(1);
  });

  it('should have one validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures).toMatchSnapshot();
  });
});
