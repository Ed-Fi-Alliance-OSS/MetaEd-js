import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/Interchange/InterchangeMustNotDuplicateIdentityTemplateName';
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
      .withElement('Required')
      .withIdentityTemplate('Template1')
      .withIdentityTemplate('Template2')
      .withEndInterchange()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().length.should.equal(0);
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
      .withElement('Required')
      .withIdentityTemplate(duplicateTemplate)
      .withIdentityTemplate(duplicateTemplate)
      .withEndInterchange()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessageCollection().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection()[0].message.should.include('Interchange');
      helper.errorMessageCollection()[0].message.should.include(entityName);
      helper.errorMessageCollection()[0].message.should.include('duplicate identity template');
      helper.errorMessageCollection()[0].message.should.include(duplicateTemplate);
    });
  });
});
