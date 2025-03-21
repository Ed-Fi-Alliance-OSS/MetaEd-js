// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { DomainEntityBuilder } from '../../src/builder/DomainEntityBuilder';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';

import { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building entities with duplicate enumeration properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName = 'Xyz.PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withEnumerationProperty(propertyName, documentation, true, false)
      .withEnumerationProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one enumeration', (): void => {
    expect(metaEd.propertyIndex.enumeration.length).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with non-duplicate enumeration properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName1 = 'Xyz.PropertyName1';
  const propertyName2 = 'Abc.PropertyName2';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withEnumerationProperty(propertyName1, documentation, true, false)
      .withEnumerationProperty(propertyName2, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build two enumerations', (): void => {
    expect(metaEd.propertyIndex.enumeration.length).toBe(2);
  });

  it('should have correct reference namespace and metaed name', (): void => {
    expect(metaEd.propertyIndex.enumeration[0].referencedNamespaceName).toBe('Xyz');
    expect(metaEd.propertyIndex.enumeration[0].metaEdName).toBe('PropertyName1');
    expect(metaEd.propertyIndex.enumeration[1].referencedNamespaceName).toBe('Abc');
    expect(metaEd.propertyIndex.enumeration[1].metaEdName).toBe('PropertyName2');
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building entities with duplicate common properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName = 'Xyz.PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withCommonProperty(propertyName, documentation, true, false)
      .withCommonProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common', (): void => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with non-duplicate common properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName1 = 'Xyz.PropertyName1';
  const propertyName2 = 'Abc.PropertyName2';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withCommonProperty(propertyName1, documentation, true, false)
      .withCommonProperty(propertyName2, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build two commons', (): void => {
    expect(metaEd.propertyIndex.common.length).toBe(2);
  });

  it('should have correct reference namespace and metaed name', (): void => {
    expect(metaEd.propertyIndex.common[0].referencedNamespaceName).toBe('Xyz');
    expect(metaEd.propertyIndex.common[0].metaEdName).toBe('PropertyName1');
    expect(metaEd.propertyIndex.common[1].referencedNamespaceName).toBe('Abc');
    expect(metaEd.propertyIndex.common[1].metaEdName).toBe('PropertyName2');
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building entities with an association property that duplicates name of another property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName = 'Xyz.PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withCommonProperty(propertyName, documentation, true, false)
      .withAssociationProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, zero associations', (): void => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.association.length).toBe(0);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with an association property that non-duplicates name of another property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName1 = 'Xyz.PropertyName1';
  const propertyName2 = 'Abc.PropertyName2';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withCommonProperty(propertyName1, documentation, true, false)
      .withAssociationProperty(propertyName2, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, one association', (): void => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.association.length).toBe(1);
  });

  it('should have correct reference namespace and metaed name', (): void => {
    expect(metaEd.propertyIndex.common[0].referencedNamespaceName).toBe('Xyz');
    expect(metaEd.propertyIndex.common[0].metaEdName).toBe('PropertyName1');
    expect(metaEd.propertyIndex.association[0].referencedNamespaceName).toBe('Abc');
    expect(metaEd.propertyIndex.association[0].metaEdName).toBe('PropertyName2');
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building entities with a short property that duplicates name of another property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withCommonProperty(`Xyz.${propertyName}`, documentation, true, false)
      .withShortProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, zero shorts', (): void => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.short.length).toBe(0);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with a short property that non-duplicates name of another property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName1 = 'Xyz.PropertyName1';
  const propertyName2 = 'PropertyName2';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withCommonProperty(propertyName1, documentation, true, false)
      .withShortProperty(propertyName2, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, one short', (): void => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.short.length).toBe(1);
  });

  it('should have correct reference namespace and metaed name', (): void => {
    expect(metaEd.propertyIndex.common[0].referencedNamespaceName).toBe('Xyz');
    expect(metaEd.propertyIndex.common[0].metaEdName).toBe('PropertyName1');
    expect(metaEd.propertyIndex.short[0].referencedNamespaceName).toBe(namespaceName);
    expect(metaEd.propertyIndex.short[0].metaEdName).toBe('PropertyName2');
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building entities with an shared decimal property that duplicates name of another property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName = 'Xyz.PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withCommonProperty(propertyName, documentation, true, false)
      .withSharedDecimalProperty(propertyName, '', documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, zero shared decimals', (): void => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.sharedDecimal.length).toBe(0);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with an shared decimal property that non-duplicates name of another property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName1 = 'Xyz.PropertyName1';
  const propertyName2 = 'Abc.PropertyName2';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withCommonProperty(propertyName1, documentation, true, false)
      .withSharedDecimalProperty(propertyName2, '', documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, one shared decimal', (): void => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.sharedDecimal.length).toBe(1);
  });

  it('should have correct reference namespace and metaed name', (): void => {
    expect(metaEd.propertyIndex.common[0].referencedNamespaceName).toBe('Xyz');
    expect(metaEd.propertyIndex.common[0].metaEdName).toBe('PropertyName1');
    expect(metaEd.propertyIndex.sharedDecimal[0].referencedNamespaceName).toBe('Abc');
    expect(metaEd.propertyIndex.sharedDecimal[0].metaEdName).toBe('PropertyName2');
    expect(metaEd.propertyIndex.sharedDecimal[0].referencedType).toBe('PropertyName2');
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building entities with renamed shared decimal property that non-duplicates name of another property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName1 = 'Xyz.PropertyName1';
  const propertyName2 = 'Abc.PropertyName2';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withCommonProperty(propertyName1, documentation, true, false)
      .withSharedDecimalProperty(propertyName2, 'RenamedName', documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, one shared decimal', (): void => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.sharedDecimal.length).toBe(1);
  });

  it('should have correct reference namespace and metaed name', (): void => {
    expect(metaEd.propertyIndex.common[0].referencedNamespaceName).toBe('Xyz');
    expect(metaEd.propertyIndex.common[0].metaEdName).toBe('PropertyName1');
    expect(metaEd.propertyIndex.sharedDecimal[0].referencedNamespaceName).toBe('Abc');
    expect(metaEd.propertyIndex.sharedDecimal[0].metaEdName).toBe('RenamedName');
    expect(metaEd.propertyIndex.sharedDecimal[0].referencedType).toBe('PropertyName2');
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building entities with a time property that duplicates name of another property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withCommonProperty(`Xyz.${propertyName}`, documentation, true, false)
      .withTimeProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it("should build one common, zero Time's", () => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.time.length).toBe(0);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with a time property that non-duplicates name of another property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName1 = 'Xyz.PropertyName1';
  const propertyName2 = 'PropertyName2';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withCommonProperty(propertyName1, documentation, true, false)
      .withTimeProperty(propertyName2, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, one time', (): void => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.time.length).toBe(1);
  });

  it('should have correct reference namespace and metaed name', (): void => {
    expect(metaEd.propertyIndex.common[0].referencedNamespaceName).toBe('Xyz');
    expect(metaEd.propertyIndex.common[0].metaEdName).toBe('PropertyName1');
    expect(metaEd.propertyIndex.time[0].referencedNamespaceName).toBe(namespaceName);
    expect(metaEd.propertyIndex.time[0].metaEdName).toBe('PropertyName2');
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building entities with a datetime property that duplicates name of another property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withCommonProperty(`Xyz.${propertyName}`, documentation, true, false)
      .withDatetimeProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, zero datetimes', (): void => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.datetime.length).toBe(0);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with a datetime property that non-duplicates name of another property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName1 = 'Xyz.PropertyName1';
  const propertyName2 = 'PropertyName2';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withCommonProperty(propertyName1, documentation, true, false)
      .withDatetimeProperty(propertyName2, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, one datetime', (): void => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.datetime.length).toBe(1);
  });

  it('should have correct reference namespace and metaed name', (): void => {
    expect(metaEd.propertyIndex.common[0].referencedNamespaceName).toBe('Xyz');
    expect(metaEd.propertyIndex.common[0].metaEdName).toBe('PropertyName1');
    expect(metaEd.propertyIndex.datetime[0].referencedNamespaceName).toBe(namespaceName);
    expect(metaEd.propertyIndex.datetime[0].metaEdName).toBe('PropertyName2');
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building entities with a year property that duplicates name of another property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName = 'PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withCommonProperty(`Xyz.${propertyName}`, documentation, true, false)
      .withYearProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, zero years', (): void => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.year.length).toBe(0);
  });

  it('should have validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with a year property that non-duplicates name of another property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName1 = 'Xyz.PropertyName1';
  const propertyName2 = 'PropertyName2';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withCommonProperty(propertyName1, documentation, true, false)
      .withYearProperty(propertyName2, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one common, one year', (): void => {
    expect(metaEd.propertyIndex.common.length).toBe(1);
    expect(metaEd.propertyIndex.year.length).toBe(1);
  });

  it('should have correct reference namespace and metaed name', (): void => {
    expect(metaEd.propertyIndex.common[0].referencedNamespaceName).toBe('Xyz');
    expect(metaEd.propertyIndex.common[0].metaEdName).toBe('PropertyName1');
    expect(metaEd.propertyIndex.year[0].referencedNamespaceName).toBe(namespaceName);
    expect(metaEd.propertyIndex.year[0].metaEdName).toBe('PropertyName2');
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building entities with two association properties duplicate property name but different contexts', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName = 'Xyz.PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withAssociationProperty(propertyName, documentation, true, false, false, 'Context1')
      .withAssociationProperty(propertyName, documentation, true, false, false, 'Context2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build two associations', (): void => {
    expect(metaEd.propertyIndex.association.length).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building entities with two association properties non-duplicate property name but different contexts', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName1 = 'Xyz.PropertyName1';
  const propertyName2 = 'Abc.PropertyName2';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withAssociationProperty(propertyName1, documentation, true, false, false, 'Context1')
      .withAssociationProperty(propertyName2, documentation, true, false, false, 'Context2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build two associations', (): void => {
    expect(metaEd.propertyIndex.association.length).toBe(2);
  });

  it('should have correct reference namespace and metaed name', (): void => {
    expect(metaEd.propertyIndex.association[0].referencedNamespaceName).toBe('Xyz');
    expect(metaEd.propertyIndex.association[0].metaEdName).toBe('PropertyName1');
    expect(metaEd.propertyIndex.association[1].referencedNamespaceName).toBe('Abc');
    expect(metaEd.propertyIndex.association[1].metaEdName).toBe('PropertyName2');
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building entities with two association properties with duplicate property name and duplicate contexts', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName = 'Xyz.PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withAssociationProperty(propertyName, documentation, true, false, false, 'Context1')
      .withAssociationProperty(propertyName, documentation, true, false, false, 'Context1')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one association', (): void => {
    expect(metaEd.propertyIndex.association.length).toBe(1);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with two association properties with non-duplicate property name and duplicate contexts', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName1 = 'Xyz.PropertyName1';
  const propertyName2 = 'Abc.PropertyName2';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withAssociationProperty(propertyName1, documentation, true, false, false, 'Context1')
      .withAssociationProperty(propertyName2, documentation, true, false, false, 'Context1')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build two associations', (): void => {
    expect(metaEd.propertyIndex.association.length).toBe(2);
  });

  it('should have correct reference namespace and metaed name', (): void => {
    expect(metaEd.propertyIndex.association[0].referencedNamespaceName).toBe('Xyz');
    expect(metaEd.propertyIndex.association[0].metaEdName).toBe('PropertyName1');
    expect(metaEd.propertyIndex.association[1].referencedNamespaceName).toBe('Abc');
    expect(metaEd.propertyIndex.association[1].metaEdName).toBe('PropertyName2');
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building entities with two association properties with duplicate property name and duplicate contexts, different shorten to', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName = 'Xyz.PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withAssociationProperty(propertyName, documentation, true, false, false)
      .roleName('context1', 'Short1')
      .withAssociationProperty(propertyName, documentation, true, false, false)
      .roleName('context1', 'Short2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build one association', (): void => {
    expect(metaEd.propertyIndex.association.length).toBe(1);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with two association properties with non-duplicate property name and duplicate contexts, different shorten to', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName1 = 'Xyz.PropertyName1';
  const propertyName2 = 'Abc.PropertyName2';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withAssociationProperty(propertyName1, documentation, true, false, false)
      .roleName('context1', 'Short1')
      .withAssociationProperty(propertyName2, documentation, true, false, false)
      .roleName('context1', 'Short2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build two associations', (): void => {
    expect(metaEd.propertyIndex.association.length).toBe(2);
  });

  it('should have correct reference namespace and metaed name', (): void => {
    expect(metaEd.propertyIndex.association[0].referencedNamespaceName).toBe('Xyz');
    expect(metaEd.propertyIndex.association[0].metaEdName).toBe('PropertyName1');
    expect(metaEd.propertyIndex.association[1].referencedNamespaceName).toBe('Abc');
    expect(metaEd.propertyIndex.association[1].metaEdName).toBe('PropertyName2');
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building entities with two association properties with duplicate property name and duplicate contexts, duplicate shorten to', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName = 'Xyz.PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withAssociationProperty(propertyName, documentation, true, false, false)
      .roleName('context1', 'ShortOne')
      .withAssociationProperty(propertyName, documentation, true, false, false)
      .roleName('context1', 'ShortOne')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build two associations', (): void => {
    expect(metaEd.propertyIndex.association.length).toBe(1);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});

describe('when building entities with two association properties with non-duplicate property name and duplicate contexts, duplicate shorten to', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName1 = 'Xyz.PropertyName1';
  const propertyName2 = 'Xyz.PropertyName2';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withAssociationProperty(propertyName1, documentation, true, false, false)
      .roleName('context1', 'ShortOne')
      .withAssociationProperty(propertyName2, documentation, true, false, false)
      .roleName('context1', 'ShortOne')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should build two associations', (): void => {
    expect(metaEd.propertyIndex.association.length).toBe(2);
  });

  it('should have correct reference namespace and metaed name', (): void => {
    expect(metaEd.propertyIndex.association[0].referencedNamespaceName).toBe('Xyz');
    expect(metaEd.propertyIndex.association[0].metaEdName).toBe('PropertyName1');
    expect(metaEd.propertyIndex.association[1].referencedNamespaceName).toBe('Xyz');
    expect(metaEd.propertyIndex.association[1].metaEdName).toBe('PropertyName2');
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building entities with two association properties with non-duplicate namespaces, duplicate property name and duplicate contexts', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';

  const propertyName1 = 'Xyz.PropertyName';
  const propertyName2 = 'Abc.PropertyName';
  const documentation = 'doc';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('EntityName')
      .withDocumentation(documentation)
      .withAssociationProperty(propertyName1, documentation, true, false, false)
      .roleName('context1')
      .withAssociationProperty(propertyName2, documentation, true, false, false)
      .roleName('context1')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DomainEntityBuilder(metaEd, validationFailures));
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
  });
});
