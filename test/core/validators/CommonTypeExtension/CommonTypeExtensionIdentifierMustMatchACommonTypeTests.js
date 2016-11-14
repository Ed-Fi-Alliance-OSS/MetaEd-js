import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/CommonTypeExtension/CommonTypeExtensionIdentifierMustMatchACommonType';
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
      .withStartCommonType(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('Property1', 'doc', true, false)
      .withEndCommonType()

      .withStartCommonTypeExtension(entityName)
      .withBooleanProperty('Property2', 'doc', true, false)
      .withEndCommonTypeExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().length.should.equal(0);
    });
  });

  describe('When_common_type_extension_has_invalid_extendee', () => {
    const entityName: string = 'NotACommonTypeIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonTypeExtension(entityName)
      .withBooleanProperty('Property2', 'doc', false, false)
      .withEndCommonTypeExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessageCollection().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection()[0].message.should.include('Common Type additions');
      helper.errorMessageCollection()[0].message.should.include(entityName);
      helper.errorMessageCollection()[0].message.should.include('does not match');
    });
  });
});
