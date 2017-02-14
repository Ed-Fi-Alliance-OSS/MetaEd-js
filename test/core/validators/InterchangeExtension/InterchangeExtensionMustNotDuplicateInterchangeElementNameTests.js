import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath, addPropertyArrayContext } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/InterchangeExtension/InterchangeExtensionMustNotDuplicateInterchangeElementName';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('InterchangeExtensionMustNotDuplicateInterchangeElementName', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_elements_have_different_names', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchangeExtension('Interchange1')
      .withDomainEntityElement('Template1')
      .withDomainEntityElement('Template2')
      .withEndInterchangeExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_elements_have_duplicate_names', () => {
    const entityName: string = 'Interchange1';
    const duplicateTemplate: string = 'Identity1';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchangeExtension('Interchange1')
      .withDomainEntityElement(duplicateTemplate)
      .withDomainEntityElement(duplicateTemplate)
      .withEndInterchangeExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Interchange additions');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('duplicate interchange element');
      helper.errorMessages()[0].message.should.include(duplicateTemplate);
    });
  });

  describe('When rule context has extendeeName exception', () => {
    const { ruleContext } = addRuleContextPath(['extendeeName', 'ID'], {}, true);
    const { leafContext: interchangeExtensionComponentContext } = addRuleContextPath(['interchangeExtensionComponent'], ruleContext, false);
    const { leafContext: interchangeElementContext } = addPropertyArrayContext('interchangeElement', interchangeExtensionComponentContext);
    addRuleContextPath(['ID'], interchangeElementContext, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has interchangeComponent exception', () => {
    const { ruleContext } = addRuleContextPath(['extendeeName', 'ID'], {}, false);
    const { leafContext: interchangeExtensionComponentContext } = addRuleContextPath(['interchangeExtensionComponent'], ruleContext, true);
    const { leafContext: interchangeElementContext } = addPropertyArrayContext('interchangeElement', interchangeExtensionComponentContext);
    addRuleContextPath(['ID'], interchangeElementContext, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has ID exception', () => {
    const { ruleContext } = addRuleContextPath(['extendeeName', 'ID'], {}, false);
    const { leafContext: interchangeExtensionComponentContext } = addRuleContextPath(['interchangeExtensionComponent'], ruleContext, false);
    const { leafContext: interchangeIdentityTemplateContext } = addPropertyArrayContext('interchangeElement', interchangeExtensionComponentContext);
    addRuleContextPath(['ID'], interchangeIdentityTemplateContext, true);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
