import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/CommonProperty/CommonPropertyWithExtensionOverrideMustReferenceCommonTypeExtension';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

chai.should();

describe('IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_include_property_has_extension_override_of_non_common_type_extension', () => {
    const commonTypeName: string = 'CommonType';
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon(commonTypeName)
      .withDocumentation('doc')
      .withBooleanProperty('DummyProperty1', 'doc', true, false)
      .withEndCommon()

      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('DummyProperty2', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .withBeginNamespace('extension', 'EXTENSION')
      .withStartDomainEntityExtension(entityName)
      .withCommonExtensionOverrideProperty(commonTypeName, 'doc', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('include extension');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('invalid');
    });
  });

  describe('When_include_property_has_extension_override_of_common_type_extension', () => {
    const commonTypeName: string = 'CommonType';
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon(commonTypeName)
      .withDocumentation('doc')
      .withBooleanProperty('DummyProperty1', 'doc', true, false)
      .withEndCommon()

      .withStartCommonExtension(commonTypeName)
      .withBooleanProperty('DummyProperty3', 'doc', true, false)
      .withEndCommon()

      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('DummyProperty2', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .withBeginNamespace('extension', 'EXTENSION')
      .withStartDomainEntityExtension(entityName)
      .withCommonExtensionOverrideProperty(commonTypeName, 'doc', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_not_have_validation_failure()', () => {
      helper.errorMessages().should.be.empty;
    });
  });

  describe('When rule context has propertyName exception', () => {
    const { ruleContext } = addRuleContextPath(['propertyName', 'ID'], { ruleIndex: MetaEdGrammar.RULE_stringProperty }, true);

    const { ruleContext: parentContext } = addRuleContextPath(['DOMAIN_ENTITY'], { ruleIndex: MetaEdGrammar.RULE_domainEntity }, false);
    ruleContext.parentCtx = parentContext;
    addRuleContextPath(['entityName', 'ID'], parentContext, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has DOMAIN_ENTITY exception', () => {
    const { ruleContext } = addRuleContextPath(['propertyName', 'ID'], { ruleIndex: MetaEdGrammar.RULE_stringProperty }, false);

    const { ruleContext: parentContext } = addRuleContextPath(['DOMAIN_ENTITY'], { ruleIndex: MetaEdGrammar.RULE_domainEntity }, true);
    ruleContext.parentCtx = parentContext;
    addRuleContextPath(['entityName', 'ID'], parentContext, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has entityName exception', () => {
    const { ruleContext } = addRuleContextPath(['propertyName', 'ID'], { ruleIndex: MetaEdGrammar.RULE_stringProperty }, false);

    const { ruleContext: parentContext } = addRuleContextPath(['DOMAIN_ENTITY'], { ruleIndex: MetaEdGrammar.RULE_domainEntity }, false);
    ruleContext.parentCtx = parentContext;
    addRuleContextPath(['entityName', 'ID'], parentContext, true);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
