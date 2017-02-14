import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/CommonProperty/CommonPropertyMustNotContainIdentity';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

chai.should();

describe('IncludePropertyMustNotContainIdentity', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_include_property_has_primary_key', () => {
    const commonTypeName: string = 'CommonType';
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon(commonTypeName)
      .withDocumentation('doc')
      .withStringProperty('StringProperty', 'doc', true, false, 100)
      .withEndCommon()

      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withCommonIdentity(propertyName, 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Include');
      helper.errorMessages()[0].message.should.include(propertyName);
      helper.errorMessages()[0].message.should.include('invalid');
    });
  });

  describe('When rule context has propertyName exception', () => {
    const { ruleContext } = addRuleContextPath(['propertyName', 'ID'], { ruleIndex: MetaEdGrammar.RULE_stringProperty }, true);
    addRuleContextPath(['propertyComponents', 'propertyAnnotation', 'identity'], ruleContext, false);

    const { ruleContext: parentContext } = addRuleContextPath(['DOMAIN_ENTITY'], { ruleIndex: MetaEdGrammar.RULE_domainEntity }, false);
    ruleContext.parentCtx = parentContext;
    addRuleContextPath(['entityName', 'ID'], parentContext, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has identity exception', () => {
    const { ruleContext } = addRuleContextPath(['propertyName', 'ID'], { ruleIndex: MetaEdGrammar.RULE_stringProperty }, false);
    addRuleContextPath(['propertyComponents', 'propertyAnnotation', 'identity'], ruleContext, true);

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
    addRuleContextPath(['propertyComponents', 'propertyAnnotation', 'identity'], ruleContext, false);

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
    addRuleContextPath(['propertyComponents', 'propertyAnnotation', 'identity'], ruleContext, false);

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
