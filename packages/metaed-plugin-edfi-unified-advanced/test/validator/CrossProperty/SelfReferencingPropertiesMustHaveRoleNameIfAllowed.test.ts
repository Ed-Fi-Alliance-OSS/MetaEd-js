// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  CommonBuilder,
  ChoiceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import {
  inlineCommonReferenceEnhancer,
  choiceReferenceEnhancer,
  domainEntityReferenceEnhancer,
  commonReferenceEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { validate } from '../../../src/validator/CrossProperty/SelfReferencingPropertiesMustHaveRoleNameIfAllowed';

describe('when entity has no self-referencing properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty('OtherEntity', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when self-referencing property has no role name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty(entityName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "error",
          "fileMap": null,
          "message": "Property referencing parent Domain Entity EntityName must have a role name.",
          "sourceMap": Object {
            "column": 18,
            "line": 5,
            "tokenText": "EntityName",
          },
          "validatorName": "SelfReferencingPropertiesMustHaveRoleNameIfAllowed",
        },
      ]
    `);
  });
});

describe('when self-referencing property has a role name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty(entityName, 'doc', true, false, false, 'ARoleName')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when self-referencing property is on an Inline Common', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartInlineCommon(entityName)
      .withDocumentation('doc')
      .withInlineCommonProperty(entityName, 'doc', true, false)
      .withEndInlineCommon()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    inlineCommonReferenceEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "error",
          "fileMap": null,
          "message": "Inline Common may not have a property that references its parent.",
          "sourceMap": Object {
            "column": 18,
            "line": 5,
            "tokenText": "EntityName",
          },
          "validatorName": "SelfReferencingPropertiesMustHaveRoleNameIfAllowed",
        },
      ]
    `);
  });
});

describe('when self-referencing property is on a Common', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon(entityName)
      .withDocumentation('doc')
      .withCommonProperty(entityName, 'doc', true, false)
      .withEndCommon()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    commonReferenceEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "error",
          "fileMap": null,
          "message": "Property referencing parent Common EntityName must have a role name.",
          "sourceMap": Object {
            "column": 11,
            "line": 5,
            "tokenText": "EntityName",
          },
          "validatorName": "SelfReferencingPropertiesMustHaveRoleNameIfAllowed",
        },
      ]
    `);
  });
});

describe('when self-referencing property is on a Choice', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartChoice(entityName)
      .withDocumentation('doc')
      .withChoiceProperty(entityName, 'doc', true, false)
      .withEndChoice()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []));

    choiceReferenceEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "error",
          "fileMap": null,
          "message": "Choice may not have a property that references its parent.",
          "sourceMap": Object {
            "column": 11,
            "line": 5,
            "tokenText": "EntityName",
          },
          "validatorName": "SelfReferencingPropertiesMustHaveRoleNameIfAllowed",
        },
      ]
    `);
  });
});
