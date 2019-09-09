import {
  newMetaEdEnvironment,
  newPluginEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  NamespaceBuilder,
} from 'metaed-core';
import { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../src/validator/BlockPropertiesNamedDiscriminator';

describe('when domain entity has no properties named Discriminator on tech version 3.1', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set(
    'edfiOdsRelational',
    Object.assign(newPluginEnvironment(), {
      targetTechnologyVersion: '3.1.0',
    }),
  );

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('doc')
      .withStringProperty('NotDiscriminator', 'doc', true, false, '100')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when domain entity has property named Discriminator on tech version 3.1', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set(
    'edfiOdsRelational',
    Object.assign(newPluginEnvironment(), {
      targetTechnologyVersion: '3.1.0',
    }),
  );

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('doc')
      .withStringProperty('Discriminator', 'doc', true, false, '100')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures).toMatchSnapshot();
  });
});

describe('when domain entity has property named Discriminator on tech version below 3.1', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set(
    'edfiOdsRelational',
    Object.assign(newPluginEnvironment(), {
      targetTechnologyVersion: '3.0.0',
    }),
  );

  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('doc')
      .withStringProperty('Discriminator', 'doc', true, false, '100')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should not have validation failure', (): void => {
    expect(failures).toHaveLength(0);
  });
});
