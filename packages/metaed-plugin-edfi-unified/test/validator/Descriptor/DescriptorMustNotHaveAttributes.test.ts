import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DescriptorBuilder,
  NamespaceBuilder,
  newPluginEnvironment,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/Descriptor/DescriptorMustNotHaveAttributes';

describe('when descriptor does not have properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  metaEd.plugin.set(
    'edfiUnified',
    Object.assign(newPluginEnvironment(), {
      targetTechnologyVersion: '5.2.0',
    }),
  );

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDescriptor('ValidName')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should not have validation errors', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when descriptor has properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  metaEd.plugin.set(
    'edfiUnified',
    Object.assign(newPluginEnvironment(), {
      targetTechnologyVersion: '5.2.1',
    }),
  );

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDescriptor('ValidName')
      .withDocumentation('doc')
      .withStringProperty('Property1', 'doc', true, false, '100')
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation errors', (): void => {
    expect(failures.length).toBeGreaterThan(0);
  });
});

describe('when version does not satisfy >= 5.2.0', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  metaEd.plugin.set(
    'edfiUnified',
    Object.assign(newPluginEnvironment(), {
      targetTechnologyVersion: '3.0.0',
    }),
  );

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDescriptor('ValidName')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should not have validation errors', (): void => {
    expect(failures).toHaveLength(0);
  });
});
