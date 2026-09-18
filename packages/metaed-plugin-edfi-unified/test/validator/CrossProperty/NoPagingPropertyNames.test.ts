// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  newPluginEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, SemVer, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/CrossProperty/NoPagingPropertyNames';
import { initialize } from '../../../src/index';

/**
 * A MetaEd environment whose edfiUnified plugin targets the given Ed-Fi API version. This is the technology
 * version the validator gates on, not the data standard version.
 */
function metaEdTargetingEdFiApi(targetTechnologyVersion: SemVer): MetaEdEnvironment {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiUnified', { ...newPluginEnvironment(), targetTechnologyVersion });
  return metaEd;
}

/**
 * Builds one domain entity that uses every reserved query parameter name as a property name, plus two
 * properties that are not reserved: a plain name and a name that merely starts with a reserved one.
 */
function buildEntityUsingEveryReservedName(metaEd: MetaEdEnvironment): void {
  MetaEdTextBuilder.build()
    .withBeginNamespace('EdFi')
    .withStartDomainEntity('EntityName')
    .withDocumentation('doc')
    .withProperty('string', 'Property', 'doc', true, false)
    .withProperty('integer', 'Offsets', 'doc', true, false)
    .withProperty('integer', 'Offset', 'doc', true, false)
    .withProperty('integer', 'Limit', 'doc', true, false)
    .withProperty('integer', 'TotalCount', 'doc', true, false)
    .withProperty('string', 'PageToken', 'doc', true, false)
    .withProperty('integer', 'PageSize', 'doc', true, false)
    .withProperty('integer', 'MinChangeVersion', 'doc', true, false)
    .withProperty('integer', 'MaxChangeVersion', 'doc', true, false)
    .withProperty('integer', 'Number', 'doc', true, false)
    .withEndDomainEntity()
    .withEndNamespace()

    .sendToListener(new NamespaceBuilder(metaEd, []))
    .sendToListener(new DomainEntityBuilder(metaEd, []));
}

describe('when targeting Ed-Fi API 8.1.0 and using every reserved query parameter name as a property name', (): void => {
  const metaEd: MetaEdEnvironment = metaEdTargetingEdFiApi('8.1.0');

  let failures: ValidationFailure[];

  beforeAll(() => {
    buildEntityUsingEveryReservedName(metaEd);
    failures = validate(metaEd);
  });

  it('should have one validation failure per reserved name', (): void => {
    expect(failures).toHaveLength(8);
    expect(failures).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "error",
          "fileMap": null,
          "message": "Offset is a reserved query parameter name for Ed-Fi API 8.1+ and cannot be used as a property name. Reserved names are limit, offset, totalCount, pageToken, pageSize, minChangeVersion, maxChangeVersion and number",
          "sourceMap": Object {
            "column": 12,
            "line": 13,
            "tokenText": "Offset",
          },
          "validatorName": "NoPagingPropertyNames",
        },
        Object {
          "category": "error",
          "fileMap": null,
          "message": "Limit is a reserved query parameter name for Ed-Fi API 8.1+ and cannot be used as a property name. Reserved names are limit, offset, totalCount, pageToken, pageSize, minChangeVersion, maxChangeVersion and number",
          "sourceMap": Object {
            "column": 12,
            "line": 17,
            "tokenText": "Limit",
          },
          "validatorName": "NoPagingPropertyNames",
        },
        Object {
          "category": "error",
          "fileMap": null,
          "message": "TotalCount is a reserved query parameter name for Ed-Fi API 8.1+ and cannot be used as a property name. Reserved names are limit, offset, totalCount, pageToken, pageSize, minChangeVersion, maxChangeVersion and number",
          "sourceMap": Object {
            "column": 12,
            "line": 21,
            "tokenText": "TotalCount",
          },
          "validatorName": "NoPagingPropertyNames",
        },
        Object {
          "category": "error",
          "fileMap": null,
          "message": "PageSize is a reserved query parameter name for Ed-Fi API 8.1+ and cannot be used as a property name. Reserved names are limit, offset, totalCount, pageToken, pageSize, minChangeVersion, maxChangeVersion and number",
          "sourceMap": Object {
            "column": 12,
            "line": 29,
            "tokenText": "PageSize",
          },
          "validatorName": "NoPagingPropertyNames",
        },
        Object {
          "category": "error",
          "fileMap": null,
          "message": "MinChangeVersion is a reserved query parameter name for Ed-Fi API 8.1+ and cannot be used as a property name. Reserved names are limit, offset, totalCount, pageToken, pageSize, minChangeVersion, maxChangeVersion and number",
          "sourceMap": Object {
            "column": 12,
            "line": 33,
            "tokenText": "MinChangeVersion",
          },
          "validatorName": "NoPagingPropertyNames",
        },
        Object {
          "category": "error",
          "fileMap": null,
          "message": "MaxChangeVersion is a reserved query parameter name for Ed-Fi API 8.1+ and cannot be used as a property name. Reserved names are limit, offset, totalCount, pageToken, pageSize, minChangeVersion, maxChangeVersion and number",
          "sourceMap": Object {
            "column": 12,
            "line": 37,
            "tokenText": "MaxChangeVersion",
          },
          "validatorName": "NoPagingPropertyNames",
        },
        Object {
          "category": "error",
          "fileMap": null,
          "message": "Number is a reserved query parameter name for Ed-Fi API 8.1+ and cannot be used as a property name. Reserved names are limit, offset, totalCount, pageToken, pageSize, minChangeVersion, maxChangeVersion and number",
          "sourceMap": Object {
            "column": 12,
            "line": 41,
            "tokenText": "Number",
          },
          "validatorName": "NoPagingPropertyNames",
        },
        Object {
          "category": "error",
          "fileMap": null,
          "message": "PageToken is a reserved query parameter name for Ed-Fi API 8.1+ and cannot be used as a property name. Reserved names are limit, offset, totalCount, pageToken, pageSize, minChangeVersion, maxChangeVersion and number",
          "sourceMap": Object {
            "column": 11,
            "line": 25,
            "tokenText": "PageToken",
          },
          "validatorName": "NoPagingPropertyNames",
        },
      ]
    `);
  });
});

describe('when targeting Ed-Fi API 8.1.0 and using a differently cased reserved query parameter name', (): void => {
  const metaEd: MetaEdEnvironment = metaEdTargetingEdFiApi('8.1.0');

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withProperty('integer', 'Totalcount', 'doc', true, false)
      .withProperty('string', 'Pagetoken', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation failures regardless of casing', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "error",
          "fileMap": null,
          "message": "Totalcount is a reserved query parameter name for Ed-Fi API 8.1+ and cannot be used as a property name. Reserved names are limit, offset, totalCount, pageToken, pageSize, minChangeVersion, maxChangeVersion and number",
          "sourceMap": Object {
            "column": 12,
            "line": 5,
            "tokenText": "Totalcount",
          },
          "validatorName": "NoPagingPropertyNames",
        },
        Object {
          "category": "error",
          "fileMap": null,
          "message": "Pagetoken is a reserved query parameter name for Ed-Fi API 8.1+ and cannot be used as a property name. Reserved names are limit, offset, totalCount, pageToken, pageSize, minChangeVersion, maxChangeVersion and number",
          "sourceMap": Object {
            "column": 11,
            "line": 9,
            "tokenText": "Pagetoken",
          },
          "validatorName": "NoPagingPropertyNames",
        },
      ]
    `);
  });
});

describe('when targeting Ed-Fi API 8.1.0 and a role name composes a reserved query parameter name', (): void => {
  const metaEd: MetaEdEnvironment = metaEdTargetingEdFiApi('8.1.0');

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withProperty('string', 'Token', 'doc', true, false, 'Page')
      .withProperty('integer', 'Number', 'doc', true, false, 'Phone')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should fail the composed reserved name and accept the composed unreserved name', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures).toMatchInlineSnapshot(`
      Array [
        Object {
          "category": "error",
          "fileMap": null,
          "message": "PageToken is a reserved query parameter name for Ed-Fi API 8.1+ and cannot be used as a property name. Reserved names are limit, offset, totalCount, pageToken, pageSize, minChangeVersion, maxChangeVersion and number",
          "sourceMap": Object {
            "column": 11,
            "line": 5,
            "tokenText": "Token",
          },
          "validatorName": "NoPagingPropertyNames",
        },
      ]
    `);
  });
});

describe('when targeting Ed-Fi API 8.0.0 and using every reserved query parameter name as a property name', (): void => {
  const metaEd: MetaEdEnvironment = metaEdTargetingEdFiApi('8.0.0');

  let failures: ValidationFailure[];

  beforeAll(() => {
    buildEntityUsingEveryReservedName(metaEd);
    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when targeting Ed-Fi API 7.3.0 and using every reserved query parameter name as a property name', (): void => {
  const metaEd: MetaEdEnvironment = metaEdTargetingEdFiApi('7.3.0');

  let failures: ValidationFailure[];

  beforeAll(() => {
    buildEntityUsingEveryReservedName(metaEd);
    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when targeting an Ed-Fi API 8.1.0 prerelease and using every reserved query parameter name as a property name', (): void => {
  const metaEd: MetaEdEnvironment = metaEdTargetingEdFiApi('8.1.0-dev.1');

  let failures: ValidationFailure[];

  beforeAll(() => {
    buildEntityUsingEveryReservedName(metaEd);
    failures = validate(metaEd);
  });

  it('should have one validation failure per reserved name', (): void => {
    expect(failures).toHaveLength(8);
  });
});

describe('when targeting Ed-Fi API 8.2.0 and using every reserved query parameter name as a property name', (): void => {
  const metaEd: MetaEdEnvironment = metaEdTargetingEdFiApi('8.2.0');

  let failures: ValidationFailure[];

  beforeAll(() => {
    buildEntityUsingEveryReservedName(metaEd);
    failures = validate(metaEd);
  });

  it('should have one validation failure per reserved name', (): void => {
    expect(failures).toHaveLength(8);
  });
});

describe('when the edfiUnified plugin environment is absent and using every reserved query parameter name as a property name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  let failures: ValidationFailure[];

  beforeAll(() => {
    buildEntityUsingEveryReservedName(metaEd);
    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when initializing the unified plugin', (): void => {
  it('should register the validator', (): void => {
    expect(initialize().validator).toContain(validate);
  });
});
