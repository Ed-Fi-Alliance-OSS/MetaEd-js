import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  NamespaceBuilder,
  PluginEnvironment,
} from '@edfi/metaed-core';
import { initializeEdFiOdsRelationalEntityRepository } from '@edfi/metaed-plugin-edfi-ods-relational';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/StringProperty/StringPropertyMustNotHaveMinLengthOneOnOptionalFields';

describe('when validating string property with no minimum length and is optional', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const minLength = '0';
  const maxLength = '10';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', maxLength, minLength)
      .withStringProperty('StringProperty', 'doc', false, false, maxLength, minLength)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating string property with minimum length one and is required', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const minLength = '1';
  const maxLength = '10';

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', maxLength, minLength)
      .withStringProperty('StringProperty', 'doc', true, false, maxLength, minLength)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating string property with minimum length one and is optional v7', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const minLength = '1';
  const maxLength = '0';

  let failures: ValidationFailure[];

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    const edfiOdsRelationalPluginEnvironment: PluginEnvironment | undefined = metaEd.plugin.get('edfiOdsRelational');
    if (edfiOdsRelationalPluginEnvironment != null) edfiOdsRelationalPluginEnvironment.targetTechnologyVersion = '7.1.0';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', maxLength, minLength)
      .withStringProperty('StringProperty', 'doc', false, false, maxLength, minLength)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('StringPropertyMustNotHaveMinLengthOneOnOptionalFields');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});

describe('when validating string property with minimum length one and is optional v6', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const minLength = '1';
  const maxLength = '0';

  let failures: ValidationFailure[];

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    const edfiOdsRelationalPluginEnvironment: PluginEnvironment | undefined = metaEd.plugin.get('edfiOdsRelational');
    if (edfiOdsRelationalPluginEnvironment != null) edfiOdsRelationalPluginEnvironment.targetTechnologyVersion = '6.2.0';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', maxLength, minLength)
      .withStringProperty('StringProperty', 'doc', false, false, maxLength, minLength)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation warnings', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('StringPropertyMustNotHaveMinLengthOneOnOptionalFields');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});
