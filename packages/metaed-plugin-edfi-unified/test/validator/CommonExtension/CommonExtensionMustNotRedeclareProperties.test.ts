// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  CommonBuilder,
  CommonExtensionBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/CommonExtension/CommonExtensionMustNotRedeclareProperties';

describe('when common extension correctly has different property names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const commonName = 'CommonName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndCommon()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartCommonExtension(`EdFi.${commonName}`)
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one common extension', (): void => {
    expect(extensionNamespace.entity.commonExtension.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when common extension has duplicate property name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const commonName = 'CommonName';
  const duplicatePropertyName = 'DuplicatePropertyName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withBooleanProperty(duplicatePropertyName, 'doc', true, false)
      .withEndCommon()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartCommonExtension(`EdFi.${commonName}`)
      .withBooleanProperty(duplicatePropertyName, 'doc', true, false)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one common extension', (): void => {
    expect(extensionNamespace.entity.commonExtension.size).toBe(1);
  });

  it('should have validation failures()', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('CommonExtensionMustNotRedeclareProperties');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});

describe('when common extension has duplicate property name but different role names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const commonName = 'CommonName';
  const duplicatePropertyName = 'DuplicatePropertyName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withBooleanProperty(duplicatePropertyName, 'doc', true, false)
      .withEndCommon()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartCommonExtension(`EdFi.${commonName}`)
      .withBooleanProperty(duplicatePropertyName, 'doc', true, false, 'RoleName')
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when common extension has multiple duplicates', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const commonName = 'CommonName';
  const notDuplicatePropertyName = 'NotDuplicatePropertyName';
  const duplicatePropertyName1 = 'DuplicatePropertyName1';
  const duplicatePropertyName2 = 'DuplicatePropertyName2';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withBooleanProperty(duplicatePropertyName1, 'doc', true, false)
      .withBooleanProperty(duplicatePropertyName2, 'doc', true, false)
      .withEndCommon()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartCommonExtension(`EdFi.${commonName}`)
      .withBooleanProperty(duplicatePropertyName1, 'doc', true, false)
      .withBooleanProperty(duplicatePropertyName2, 'doc', true, false)
      .withBooleanProperty(notDuplicatePropertyName, 'doc', true, false)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should have validation failures()', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('CommonExtensionMustNotRedeclareProperties');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).not.toMatch(new RegExp(notDuplicatePropertyName));
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();

    expect(failures[1].validatorName).toBe('CommonExtensionMustNotRedeclareProperties');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).not.toMatch(new RegExp(notDuplicatePropertyName));
    expect(failures[1].message).toMatchSnapshot();
    expect(failures[1].sourceMap).toMatchSnapshot();
  });
});

describe('when common extension has duplicate common property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const commonName = 'CommonName';
  const duplicatePropertyName = 'DuplicatePropertyName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withCommonProperty(duplicatePropertyName, 'doc', true, false)
      .withEndCommon()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartCommonExtension(`EdFi.${commonName}`)
      .withCommonProperty(duplicatePropertyName, 'doc', true, false)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should have validation failures()', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('CommonExtensionMustNotRedeclareProperties');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});

describe('when common extension has duplicate common extension override property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const commonName = 'CommonName';
  const duplicatePropertyName = 'DuplicatePropertyName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withCommonProperty(duplicatePropertyName, 'doc', true, false)
      .withEndCommon()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartCommonExtension(`EdFi.${commonName}`)
      .withCommonExtensionOverrideProperty(duplicatePropertyName, 'doc', true, false)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});
