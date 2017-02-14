import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath, addPropertyArrayContext } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/Interchange/InterchangeMustNotDuplicateIdentityName';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('InterchangeMustNotDuplicateIdentityTemplateNameTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_identity_templates_have_different_names', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange('Interchange1')
      .withDocumentation('doc')
      .withDomainEntityElement('Required')
      .withDomainEntityIdentityTemplate('Template1')
      .withDomainEntityIdentityTemplate('Template2')
      .withEndInterchange()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_identity_templates_have_duplicate_names', () => {
    const entityName: string = 'Interchange1';
    const duplicateTemplate: string = 'Identity1';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange('Interchange1')
      .withDocumentation('doc')
      .withDomainEntityElement('Required')
      .withDomainEntityIdentityTemplate(duplicateTemplate)
      .withDomainEntityIdentityTemplate(duplicateTemplate)
      .withEndInterchange()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Interchange');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('duplicate identity template');
      helper.errorMessages()[0].message.should.include(duplicateTemplate);
    });
  });

  describe('When rule context has interchangeName exception', () => {
    const { ruleContext } = addRuleContextPath(['interchangeName', 'ID'], {}, true);
    const { leafContext: interchangeComponentContext } = addRuleContextPath(['interchangeComponent'], ruleContext, false);
    const { leafContext: interchangeIdentityTemplateContext } = addPropertyArrayContext('interchangeIdentityTemplate', interchangeComponentContext);
    addRuleContextPath(['ID'], interchangeIdentityTemplateContext, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has interchangeComponent exception', () => {
    const { ruleContext } = addRuleContextPath(['interchangeName', 'ID'], {}, false);
    const { leafContext: interchangeComponentContext } = addRuleContextPath(['interchangeComponent'], ruleContext, true);
    const { leafContext: interchangeIdentityTemplateContext } = addPropertyArrayContext('interchangeIdentityTemplate', interchangeComponentContext);
    addRuleContextPath(['ID'], interchangeIdentityTemplateContext, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has ID exception', () => {
    const { ruleContext } = addRuleContextPath(['interchangeName', 'ID'], {}, false);
    const { leafContext: interchangeComponentContext } = addRuleContextPath(['interchangeComponent'], ruleContext, false);
    const { leafContext: interchangeIdentityTemplateContext } = addPropertyArrayContext('interchangeIdentityTemplate', interchangeComponentContext);
    addRuleContextPath(['ID'], interchangeIdentityTemplateContext, true);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
