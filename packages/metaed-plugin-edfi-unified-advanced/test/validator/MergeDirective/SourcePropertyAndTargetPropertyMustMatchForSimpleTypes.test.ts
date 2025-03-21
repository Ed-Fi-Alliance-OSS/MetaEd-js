// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  DomainEntityBuilder,
  DomainEntitySubclassBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  MetaEdEnvironment,
  ValidationFailure,
} from '@edfi/metaed-core';
import {
  mergeDirectiveEnhancer,
  domainEntityReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { validate } from '../../../src/validator/MergeDirective/SourcePropertyAndTargetPropertyMustMatch';

describe('when validating merge property name and types match', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const stringIdentityName = 'StringIdentityName';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('doc')
      .withSharedStringIdentity(stringIdentityName, stringIdentityName, 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withSharedStringIdentity(stringIdentityName, stringIdentityName, 'doc')
      .withDomainEntityIdentity(domainEntityName1, 'doc')
      .withMergeDirective(`${domainEntityName1}.${stringIdentityName}`, stringIdentityName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating merge property type mismatch', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const stringIdentityName = 'StringIdentityName';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('doc')
      .withSharedIntegerIdentity(stringIdentityName, stringIdentityName, 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('doc')
      .withSharedStringIdentity(stringIdentityName, stringIdentityName, 'doc')
      .withDomainEntityIdentity(domainEntityName1, 'doc')
      .withMergeDirective(`${domainEntityName1}.${stringIdentityName}`, stringIdentityName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SourcePropertyAndTargetPropertyMustMatch');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when validating merge property type mismatch should have validation failure -> message ',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating merge property type mismatch should have validation failure -> sourceMap',
    );
  });
});

describe('when validating merge of doubly nested domain entity with domain entity properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntityName3 = 'DomainEntityName3';
    const integerName = 'IntegerName';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withSharedIntegerIdentity(integerName, integerName, 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName2, 'DomainEntityIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName4')
      .withDocumentation('DomainEntityDocumentation')
      .withSharedIntegerIdentity(integerName, integerName, 'DomainEntityPropertyDocumentation')
      .withDomainEntityIdentity(domainEntityName3, 'DomainEntityPropertyDocumentation')
      .withMergeDirective(`${domainEntityName3}.${domainEntityName2}.${domainEntityName1}.${integerName}`, `${integerName}`)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build four domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(4);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating merge of domain entity and domain entity subclass properties of base entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const sharedIntegerEntityName1 = 'SharedIntegerEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntityName3 = 'DomainEntityName3';
    const domainEntitySubclassName = 'DomainEntitySubclassName';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withSharedIntegerIdentity(sharedIntegerEntityName1, sharedIntegerEntityName1, 'DomainEntityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndDomainEntitySubclass()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('DomainEntityDocumentation')
      .withSharedIntegerIdentity(sharedIntegerEntityName1, sharedIntegerEntityName1, 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName4')
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntitySubclassName, 'DomainEntityPropertyDocumentation')
      .withDomainEntityIdentity(domainEntityName3, 'DomainEntityPropertyDocumentation')
      .withMergeDirective(
        `${domainEntityName3}.${sharedIntegerEntityName1}`,
        `${domainEntitySubclassName}.${sharedIntegerEntityName1}`,
      )
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    domainEntitySubclassBaseClassEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build four domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(3);
  });

  it('should build one domain entity subclass', (): void => {
    expect(coreNamespace.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});
