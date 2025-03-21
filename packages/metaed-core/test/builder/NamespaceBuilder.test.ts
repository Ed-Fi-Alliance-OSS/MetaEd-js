// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';
import { DefaultExtensionEntitySuffix } from '../../src/model/Namespace';

describe('when building extension namespace info', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  beforeAll(() => {
    const builder = new NamespaceBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartCommon('Dummy')
      .withDocumentation('Dummy')
      .withIntegerProperty('Dummy', 'Dummy', true, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one namespace info', (): void => {
    expect(metaEd.namespace.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have correct namespace', (): void => {
    const namespace: any = metaEd.namespace.get(namespaceName);
    expect(namespace.namespaceName).toBe(namespaceName);
  });

  it('should have correct project extension', (): void => {
    const namespace: any = metaEd.namespace.get(namespaceName);
    expect(namespace.projectExtension).toBe(projectExtension);
  });

  it('should be an extension', (): void => {
    const namespace: any = metaEd.namespace.get(namespaceName);
    expect(namespace.isExtension).toBe(true);
  });

  it('should have correct extension suffix', (): void => {
    const namespace: any = metaEd.namespace.get(namespaceName);
    expect(namespace.extensionEntitySuffix).toBe(DefaultExtensionEntitySuffix);
  });
});

describe('when building core namespace info', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'EdFi';

  beforeAll(() => {
    const builder = new NamespaceBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon('Dummy')
      .withDocumentation('Dummy')
      .withIntegerProperty('Dummy', 'Dummy', true, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one namespace info', (): void => {
    expect(metaEd.namespace.size).toBe(1);
  });

  it('should have correct namespace', (): void => {
    const namespace: any = metaEd.namespace.get(namespaceName);
    expect(namespace.namespaceName).toBe(namespaceName);
  });

  it('should have a blank project extension', (): void => {
    const namespace: any = metaEd.namespace.get(namespaceName);
    expect(namespace.projectExtension).toBe('');
  });

  it('should not be an extension', (): void => {
    const namespace: any = metaEd.namespace.get(namespaceName);
    expect(namespace.isExtension).toBe(false);
  });

  it('should have correct extension suffix', (): void => {
    const namespace: any = metaEd.namespace.get(namespaceName);
    expect(namespace.extensionEntitySuffix).toBe(DefaultExtensionEntitySuffix);
  });
});
