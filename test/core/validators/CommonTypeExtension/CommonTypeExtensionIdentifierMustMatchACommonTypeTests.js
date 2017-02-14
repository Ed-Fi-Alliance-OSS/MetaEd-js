import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/CommonExtension/CommonExtensionIdentifierMustMatchACommonType';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('CommonTypeExtensionIdentifierMustMatchACommonTypeTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_common_type_extension_has_valid_extendee', () => {
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('Property1', 'doc', true, false)
      .withEndCommon()

      .withStartCommonExtension(entityName)
      .withBooleanProperty('Property2', 'doc', true, false)
      .withEndCommonExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_common_type_extension_has_invalid_extendee', () => {
    const entityName: string = 'NotACommonTypeIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonExtension(entityName)
      .withBooleanProperty('Property2', 'doc', false, false)
      .withEndCommonExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Common Type additions');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('does not match');
    });
  });

  describe('When rule context has extendeeName exception', () => {
    const { ruleContext } = addRuleContextPath(['extendeeName'], {}, true);
    const { invalidPath, validatorName } = validatable('CommonTypeExtensionIdentifierMustMatchACommonTypeTests', ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
