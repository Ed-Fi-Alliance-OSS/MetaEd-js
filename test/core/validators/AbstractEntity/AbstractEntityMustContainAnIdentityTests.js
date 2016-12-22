import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath, addPropertyArrayContext } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/AbstractEntity/AbstractEntityMustContainAnIdentity';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

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
      helper.errorMessages().length.should.equal(0);
      helper.warningMessages().length.should.equal(0);
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
      helper.errorMessages().should.not.be.empty;
    });

    it('Should_have_validation_failure_message', () => {
      helper.errorMessages()[0].message.should.include('Abstract Entity');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('does not have an identity');
    });
  });

  describe('When rule context has abstractEntityName exception', () => {
    const { ruleContext } = addRuleContextPath(['abstractEntityName', 'ID'], {}, true);

    const { leafContext: stringPropertyContext } = addPropertyArrayContext('stringProperty', ruleContext);
    addRuleContextPath(['propertyComponents', 'propertyAnnotation'], stringPropertyContext, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has identity exception', () => {
    const { ruleContext } = addRuleContextPath(['abstractEntityName', 'ID'], {}, false);

    const { leafContext: stringPropertyContext } = addPropertyArrayContext('stringProperty', ruleContext);
    addRuleContextPath(['propertyComponents', 'propertyAnnotation'], stringPropertyContext, true);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
