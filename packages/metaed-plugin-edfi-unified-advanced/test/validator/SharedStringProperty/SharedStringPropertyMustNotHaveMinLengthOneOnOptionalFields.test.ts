import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  NamespaceBuilder,
  SharedStringBuilder,
  newPluginEnvironment,
} from '@edfi/metaed-core';
import { sharedStringPropertyEnhancer, stringReferenceEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/SharedStringProperty/SharedStringPropertyMustNotHaveMinLengthOneOnOptionalFields';

describe('when validating shared string property with no minimum length and is optional', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const minLength = '0';
  const maxLength = '10';

  let failures: ValidationFailure[];

  beforeAll(() => {
    metaEd.plugin.set('edfiUnifiedAdvanced', { ...newPluginEnvironment(), targetTechnologyVersion: '7.1.0' });

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', maxLength, minLength)
      .withSharedStringProperty('StringProperty', null, 'doc', false, false)
      .withEndAbstractEntity()
      .withStartSharedString('StringProperty')
      .withDocumentation('doc')
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    stringReferenceEnhancer(metaEd);
    sharedStringPropertyEnhancer(metaEd);

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating shared string property with minimum length one and is required', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const minLength = '1';
  const maxLength = '10';

  let failures: ValidationFailure[];

  beforeAll(() => {
    metaEd.plugin.set('edfiUnifiedAdvanced', { ...newPluginEnvironment(), targetTechnologyVersion: '7.1.0' });

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', maxLength, minLength)
      .withSharedStringProperty('StringProperty', null, 'doc', true, false)
      .withEndAbstractEntity()
      .withStartSharedString('StringProperty')
      .withDocumentation('doc')
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    stringReferenceEnhancer(metaEd);
    sharedStringPropertyEnhancer(metaEd);

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating shared string property with minimum length one and is optional v7', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const minLength = '1';
  const maxLength = '0';

  let failures: ValidationFailure[];

  beforeAll(() => {
    metaEd.plugin.set('edfiUnifiedAdvanced', { ...newPluginEnvironment(), targetTechnologyVersion: '7.1.0' });

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', maxLength, minLength)
      .withSharedStringProperty('StringProperty', null, 'doc', false, false)
      .withEndAbstractEntity()
      .withStartSharedString('StringProperty')
      .withDocumentation('doc')
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    stringReferenceEnhancer(metaEd);
    sharedStringPropertyEnhancer(metaEd);

    failures = validate(metaEd);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SharedStringPropertyMustNotHaveMinLengthOneOnOptionalFields');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"Shared String Property StringProperty has min length 1 on optional field."`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 0,
        "line": 0,
        "tokenText": "NoSourceMap",
      }
    `);
  });
});

describe('when validating shared string property with minimum length one and is optional v6', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const minLength = '1';
  const maxLength = '0';

  let failures: ValidationFailure[];

  beforeAll(() => {
    metaEd.plugin.set('edfiUnifiedAdvanced', { ...newPluginEnvironment(), targetTechnologyVersion: '6.2.0' });

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', maxLength, minLength)
      .withSharedStringProperty('StringProperty', null, 'doc', false, false)
      .withEndAbstractEntity()
      .withStartSharedString('StringProperty')
      .withDocumentation('doc')
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    stringReferenceEnhancer(metaEd);
    sharedStringPropertyEnhancer(metaEd);

    failures = validate(metaEd);
  });

  it('should have validation warnings', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SharedStringPropertyMustNotHaveMinLengthOneOnOptionalFields');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"Shared String Property StringProperty has min length 1 on optional field. This warning will be treated as an error in API version 7.x"`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 0,
        "line": 0,
        "tokenText": "NoSourceMap",
      }
    `);
  });
});
