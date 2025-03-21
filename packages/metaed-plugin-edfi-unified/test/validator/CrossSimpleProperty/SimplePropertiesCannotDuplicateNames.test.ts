// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  IntegerTypeBuilder,
  StringTypeBuilder,
  DecimalTypeBuilder,
  NamespaceBuilder,
  SharedDecimalBuilder,
  SharedIntegerBuilder,
  SharedStringBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/CrossSimpleProperty/SimplePropertiesCannotDuplicateNames';

describe('when two integer properties in different DEs have the same name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withIntegerProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withIntegerProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new IntegerTypeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');

    failures = validate(metaEd);
  });

  it('should build two domain entities, and one integer property', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.integer.length).toBe(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('SimplePropertiesCannotDuplicateNames');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();

    expect(failures[1].validatorName).toBe('SimplePropertiesCannotDuplicateNames');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot();
    expect(failures[1].sourceMap).toMatchSnapshot();
  });
});

describe('when two integer properties in different DEs in different namespaces have the same name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withIntegerProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension')
      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withIntegerProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new IntegerTypeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');

    failures = validate(metaEd);
  });

  it('should build two domain entities, and one integer property', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
    expect(extensionNamespace.entity.domainEntity.size).toBe(1);
    expect(metaEd.propertyIndex.integer.length).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when an integer property and a decimal property in different DEs have the same name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withIntegerProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withDecimalProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DecimalTypeBuilder(metaEd, []))
      .sendToListener(new IntegerTypeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');

    failures = validate(metaEd);
  });

  it('should build two domain entities, one integer property, one decimal property', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.integer.length).toBe(1);
    expect(metaEd.propertyIndex.decimal.length).toBe(1);
  });

  it('should have validation failures for each entity', (): void => {
    expect(failures).toHaveLength(2);
  });
});

describe('when a integer property and a string property in different DEs have the same name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withIntegerProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withStringProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new StringTypeBuilder(metaEd, []))
      .sendToListener(new IntegerTypeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');

    failures = validate(metaEd);
  });

  it('should build two domain entities, one integer property, one string property', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.integer.length).toBe(1);
    expect(metaEd.propertyIndex.string.length).toBe(1);
  });

  it('should have validation failures for each entity', (): void => {
    expect(failures).toHaveLength(2);
  });
});
describe('when an string property and a string property in different DEs have the same name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withStringProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withStringProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new StringTypeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');

    failures = validate(metaEd);
  });

  it('should build two domain entities, two string properties', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.string.length).toBe(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(failures).toHaveLength(2);
  });
});
describe('when an string property and a decimal property in different DEs have the same name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withStringProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withDecimalProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DecimalTypeBuilder(metaEd, []))
      .sendToListener(new StringTypeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');

    failures = validate(metaEd);
  });

  it('should build two domain entities, one string property, one decimal property', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.string.length).toBe(1);
    expect(metaEd.propertyIndex.decimal.length).toBe(1);
  });

  it('should have validation failures for each entity', (): void => {
    expect(failures).toHaveLength(2);
  });
});

describe('when an decimal property and a decimal property in different DEs have the same name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withDecimalProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withDecimalProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DecimalTypeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');

    failures = validate(metaEd);
  });

  it('should build two domain entities, two decimal properties', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.decimal.length).toBe(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(failures).toHaveLength(2);
  });
});

describe('when a decimal property and a shared decimal property in different DEs have the same name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withDecimalProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withSharedDecimalProperty(propertyName, null, 'doc', true, false)
      .withEndDomainEntity()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DecimalTypeBuilder(metaEd, []))
      .sendToListener(new SharedDecimalBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');

    failures = validate(metaEd);
  });

  it('should build two domain entities, one shared decimal, one decimal property', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.decimal.length).toBe(1);
    expect(metaEd.propertyIndex.sharedDecimal.length).toBe(1);
  });

  it('should have validation failures for each entity', (): void => {
    expect(failures).toHaveLength(2);
  });
});

describe('when a string property and a shared string property in different DEs have the same name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withStringProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withSharedStringProperty(propertyName, null, 'doc', true, false)
      .withEndDomainEntity()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new StringTypeBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');

    failures = validate(metaEd);
  });

  it('should build two domain entities, one shared string, one string property', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.string.length).toBe(1);
    expect(metaEd.propertyIndex.sharedString.length).toBe(1);
  });

  it('should have validation failures for each entity', (): void => {
    expect(failures).toHaveLength(2);
  });
});

describe('when a string property and a shared string property in different DEs in different namespaces have the same name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withStringProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension')
      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withSharedStringProperty(propertyName, null, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new StringTypeBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');

    failures = validate(metaEd);
  });

  it('should build two domain entities, one shared string, one string property', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
    expect(extensionNamespace.entity.domainEntity.size).toBe(1);
    expect(metaEd.propertyIndex.string.length).toBe(1);
    expect(metaEd.propertyIndex.sharedString.length).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when an integer property and a shared integer property in different DEs have the same name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withIntegerProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withSharedIntegerProperty(propertyName, null, 'doc', true, false)
      .withEndDomainEntity()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new IntegerTypeBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');

    failures = validate(metaEd);
  });

  it('should build two domain entities, one shared integer, one integer property', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.integer.length).toBe(1);
    expect(metaEd.propertyIndex.sharedInteger.length).toBe(1);
  });

  it('should have validation failures for each entity', (): void => {
    expect(failures).toHaveLength(2);
  });
});
describe('when a short property and a shared short property in different DEs have the same name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withShortProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withSharedShortProperty(propertyName, null, 'doc', true, false)
      .withEndDomainEntity()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new IntegerTypeBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');

    failures = validate(metaEd);
  });

  it('should build two domain entities, one shared short, one short property', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.short.length).toBe(1);
    expect(metaEd.propertyIndex.sharedShort.length).toBe(1);
  });

  it('should have validation failures for each entity', (): void => {
    expect(failures).toHaveLength(2);
  });
});

describe('when a string property and a shared decimal property in different DEs have the same name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName1')
      .withDocumentation('doc')
      .withStringProperty(propertyName, 'doc', true, false, '5', '2')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withSharedDecimalProperty(propertyName, null, 'doc', true, false)
      .withEndDomainEntity()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new IntegerTypeBuilder(metaEd, []))
      .sendToListener(new SharedDecimalBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');

    failures = validate(metaEd);
  });

  it('should build two domain entities, one shared string, one string property', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
    expect(metaEd.propertyIndex.string.length).toBe(1);
    expect(metaEd.propertyIndex.sharedDecimal.length).toBe(1);
  });

  it('should have validation failures for each entity', (): void => {
    expect(failures).toHaveLength(2);
  });
});
