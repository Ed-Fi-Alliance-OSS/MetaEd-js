import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/AssociationSubclass/AssociationSubclassIdentifierMustMatchAnAssociation';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('AssociationSubclassIdentifierMustMatchAnAssociationTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_association_subclass_has_valid_extendee', () => {
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withBooleanProperty('Property1', 'doc', true, false)
      .withEndAssociation()

      .withStartAssociationSubclass('NewSubclass', entityName)
      .withDocumentation('doc')
      .withBooleanProperty('Property2', 'doc', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_association_subclass_has_invalid_extendee', () => {
    const entityName: string = 'MyIdentifier';
    const baseName: string = 'NotAnAssociationIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociationSubclass(entityName, baseName)
      .withDocumentation('doc')
      .withBooleanProperty('Property1', 'doc', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().length.should.equal(1);
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Association');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('based on');
      helper.errorMessages()[0].message.should.include(baseName);
      helper.errorMessages()[0].message.should.include('does not match');
    });
  });

  describe('When rule context has baseName exception', () => {
    const { ruleContext } = addRuleContextPath(['baseName', 'ID'], {}, true);
    addRuleContextPath(['associationName', 'ID'], ruleContext, false);
    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has associationName exception', () => {
    const { ruleContext } = addRuleContextPath(['baseName', 'ID'], {}, false);
    addRuleContextPath(['associationName', 'ID'], ruleContext, true);
    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
