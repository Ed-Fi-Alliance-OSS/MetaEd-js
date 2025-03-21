// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newMetaEdEnvironment, MetaEdTextBuilder, DescriptorBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/Descriptor/DescriptorNamesMustBeUnique';

describe('when entities in same namespace have different names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDescriptor('ValidName1')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartDescriptor('ValidName2')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build two descriptor', (): void => {
    expect(coreNamespace.entity.descriptor.size).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when entities in same namespace have identical names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDescriptor(entityName)
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartDescriptor(entityName)
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one descriptor because TopLevelEntityBuilder will not let it get that far', (): void => {
    expect(coreNamespace.entity.descriptor.size).toBe(1);
  });

  it('should have no validation failures because of TopLevelEntityBuilder', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when descriptors in separate dependency-linked namespaces have identical names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDescriptor(entityName)
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartDescriptor(entityName)
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one descriptor in core namespace', (): void => {
    expect(coreNamespace.entity.descriptor.size).toBe(1);
  });

  it('should build one descriptor in extension namespace', (): void => {
    expect(extensionNamespace.entity.descriptor.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when descriptors in non-dependency-linked namespaces have identical names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespacea: any = null;
  let extensionNamespaceb: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDescriptor('NotADuplicate')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()

      .withBeginNamespace('Extensiona', 'Extensiona')
      .withStartDescriptor(entityName)
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()

      .withBeginNamespace('Extensionb', 'Extensionb')
      .withStartDescriptor(entityName)
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespacea = metaEd.namespace.get('Extensiona');
    extensionNamespaceb = metaEd.namespace.get('Extensionb');
    extensionNamespacea.dependencies.push(coreNamespace);
    extensionNamespaceb.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one core descriptor', (): void => {
    expect(coreNamespace.entity.descriptor.size).toBe(1);
  });

  it('should build one extension1 descriptor', (): void => {
    expect(extensionNamespacea.entity.descriptor.size).toBe(1);
  });

  it('should build one extension2 descriptor', (): void => {
    expect(extensionNamespaceb.entity.descriptor.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});
