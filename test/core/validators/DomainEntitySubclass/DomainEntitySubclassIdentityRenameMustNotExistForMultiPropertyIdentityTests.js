import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath, addArrayContext, addPropertyArrayContext } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/DomainEntitySubclass/DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentityTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_domain_entity_subclass_renames_base_identity', () => {
    const entityName: string = 'SubclassIdentifier';
    const baseName: string = 'BaseDomainEntityIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(baseName)
      .withDocumentation('because documentation is required')
      .withStringIdentity('Property1', 'because a property is required', 100)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(entityName, baseName)
      .withDocumentation('because documentation is required')
      .withStringIdentityRename('Property2', 'Property1', 'because a property is required', 100)
      .withEndDomainEntitySubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().should.be.empty;
    });
  });

  describe('When_domain_entity_subclass_does_not_rename_identity', () => {
    const entityName: string = 'SubclassIdentifier';
    const baseName: string = 'BaseDomainEntityIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(baseName)
      .withDocumentation('because documentation is required')
      .withStringIdentity('Property1', 'because a property is required', 100)
      .withStringIdentity('Property2', 'because a property is required', 100)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(entityName, baseName)
      .withDocumentation('because documentation is required')
      .withStringProperty('Property3', 'because a property is required', true, false, 100)
      .withEndDomainEntitySubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().should.be.empty;
    });
  });

  describe('When_domain_entity_subclass_renames_base_identity_more_than_once', () => {
    const entityName: string = 'SubclassIdentifier';
    const baseName: string = 'BaseDomainEntityIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(baseName)
      .withDocumentation('because documentation is required')
      .withStringIdentity('Property1', 'because a property is required', 100)
      .withStringIdentity('Property2', 'because a property is required', 100)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(entityName, baseName)
      .withDocumentation('because documentation is required')
      .withStringIdentityRename('Property3', 'Property1', 'because a property is required', 100)
      .withStringIdentityRename('Property4', 'Property2', 'because a property is required', 100)
      .withEndDomainEntitySubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Domain Entity');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('based on');
      helper.errorMessages()[0].message.should.include(baseName);
      helper.errorMessages()[0].message.should.include('is invalid for identity rename');
      helper.errorMessages()[0].message.should.include('has more than one identity property');
    });
  });

  describe('When_domain_entity_subclass_extends_non_existent_entity', () => {
    const entityName: string = 'SubclassIdentifier';
    const baseName: string = 'BaseDomainEntityIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntitySubclass(entityName, baseName)
      .withDocumentation('because documentation is required')
      .withStringIdentityRename('Property2', 'Property3', 'because a property is required', 100)
      .withEndDomainEntitySubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().should.be.empty;
    });
  });

  describe('When rule context has baseName exception', () => {
    const ruleContext = {};
    addRuleContextPath(['baseName'], ruleContext, true);
    addRuleContextPath(['entityName'], ruleContext, false);

    const { leafContext: stringPropertyContext } = addPropertyArrayContext('stringProperty', ruleContext);
    const { leafContext: propertyAnnotationContext } =
      addRuleContextPath(['propertyComponents', 'propertyAnnotation'], stringPropertyContext, false);
    addArrayContext('identityRename', propertyAnnotationContext);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has entityName exception', () => {
    const ruleContext = {};
    addRuleContextPath(['baseName'], ruleContext, false);
    addRuleContextPath(['entityName'], ruleContext, true);

    const { leafContext: stringPropertyContext } = addPropertyArrayContext('stringProperty', ruleContext);
    const { leafContext: propertyAnnotationContext } =
      addRuleContextPath(['propertyComponents', 'propertyAnnotation'], stringPropertyContext, false);
    addArrayContext('identityRename', propertyAnnotationContext);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has propertyAnnotation exception', () => {
    const ruleContext = {};
    addRuleContextPath(['baseName'], ruleContext, false);
    addRuleContextPath(['entityName'], ruleContext, false);

    const { leafContext: stringPropertyContext } = addPropertyArrayContext('stringProperty', ruleContext);
    const { leafContext: propertyAnnotationContext } =
      addRuleContextPath(['propertyComponents', 'propertyAnnotation'], stringPropertyContext, true);
    addArrayContext('identityRename', propertyAnnotationContext);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
