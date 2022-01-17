import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  ChoiceBuilder,
  DomainEntityBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/ChoiceProperty/ChoicePropertyMustMatchAChoice';

describe('when choice property has identifier of choice', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'DomainEntityName';
  const entityName = 'EntityName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartChoice(entityName)
      .withDocumentation('doc')
      .withStringProperty('StringProperty', 'doc', true, false, '100')
      .withEndChoice()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withChoiceProperty(entityName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when choice property has identifier of choice in dependency namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'DomainEntityName';
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartChoice(entityName)
      .withDocumentation('doc')
      .withStringProperty('StringProperty', 'doc', true, false, '100')
      .withEndChoice()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withChoiceProperty(`EdFi.${entityName}`, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);
    failures = validate(metaEd);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when choice property has invalid identifier', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'DomainEntityName';
  const entityName = 'EntityName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartChoice('WrongName')
      .withDocumentation('doc')
      .withStringProperty('StringProperty', 'doc', true, false, '100')
      .withEndChoice()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withChoiceProperty(entityName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation failures()', (): void => {
    expect(failures).toHaveLength(1);
  });

  it('should have validation failure for property', (): void => {
    expect(failures[0].validatorName).toBe('ChoicePropertyMustMatchAChoice');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});

describe('when choice property has invalid identifier in dependency namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'DomainEntityName';
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartChoice('WrongName')
      .withDocumentation('doc')
      .withStringProperty('StringProperty', 'doc', true, false, '100')
      .withEndChoice()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withChoiceProperty(entityName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should have validation failures()', (): void => {
    expect(failures).toHaveLength(1);
  });

  it('should have validation failure for property', (): void => {
    expect(failures[0].validatorName).toBe('ChoicePropertyMustMatchAChoice');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});
