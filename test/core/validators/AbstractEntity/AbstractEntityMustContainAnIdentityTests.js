import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/AbstractEntity/AbstractEntityMustContainAnIdentity';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';
import { ValidationMessage } from '../../../../src/core/validators/ValidationMessage';

chai.should();

describe('AbstractEntityMustContainAnIdentityTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_validating_abstract_entity_with_identity_fields', () => {
    const entityName: string = 'EntityName';

    let helper: ValidatorTestHelper;

    before(() => {
      const metaEdTextBuilder: MetaEdTextBuilder = new MetaEdTextBuilder();
      const metaEdText: string = metaEdTextBuilder
      .withBeginNamespace('edfi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('Property', 'doc', 100)
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();

      helper = new ValidatorTestHelper();
      helper.setup(metaEdText, validatorListener);
    });

    it('Should_have_no_validation_failures', () => {
      helper.errorMessageCollection().length.should.equal(0);
      helper.warningMessageCollection().length.should.equal(0);
    });
  });

  describe('When_validating_abstract_entity_with_no_identity_fields', () => {
    const entityName: string = 'EntityName';

    let helper: ValidatorTestHelper;

    before(() => {
      const metaEdTextBuilder: MetaEdTextBuilder = new MetaEdTextBuilder();
      const metaEdText: string = metaEdTextBuilder
      .withBeginNamespace('edfi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withDateProperty('Property', 'doc', true, false)
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();

      helper = new ValidatorTestHelper();
      helper.setup(metaEdText, validatorListener);
    });

    it('Should_have_validation_failure', () => {
      helper.errorMessageCollection().should.not.be.empty;
    });

    it('Should_have_validation_failure_message', () => {
      helper.errorMessageCollection()[0].message.should.include('Abstract Entity');
      helper.errorMessageCollection()[0].message.should.include(entityName);
      helper.errorMessageCollection()[0].message.should.include('does not have an identity');
    });
  });
});
