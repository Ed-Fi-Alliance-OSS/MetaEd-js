import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/IncludeProperty/IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_include_property_has_extension_override_of_non_common_type_extension', () => {
    const commonTypeName: string = 'CommonType';
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonType(commonTypeName)
      .withDocumentation('doc')
      .withBooleanProperty('DummyProperty1', 'doc', true, false)
      .withEndCommonType()

      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('DummyProperty2', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .withBeginNamespace('extension', 'EXTENSION')
      .withStartDomainEntityExtension(entityName)
      .withIncludeExtensionOverrideProperty(commonTypeName, 'doc', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessageCollection().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection()[0].message.should.include('include extension');
      helper.errorMessageCollection()[0].message.should.include(propertyName);
      helper.errorMessageCollection()[0].message.should.include(entityName);
      helper.errorMessageCollection()[0].message.should.include('invalid');
    });
  });

  describe('When_include_property_has_extension_override_of_common_type_extension', () => {
    const commonTypeName: string = 'CommonType';
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonType(commonTypeName)
      .withDocumentation('doc')
      .withBooleanProperty('DummyProperty1', 'doc', true, false)
      .withEndCommonType()

      .withStartCommonTypeExtension(commonTypeName)
      .withBooleanProperty('DummyProperty3', 'doc', true, false)
      .withEndCommonType()

      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('DummyProperty2', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .withBeginNamespace('extension', 'EXTENSION')
      .withStartDomainEntityExtension(entityName)
      .withIncludeExtensionOverrideProperty(commonTypeName, 'doc', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_not_have_validation_failure()', () => {
      helper.errorMessageCollection().should.be.empty;
    });
  });
});
