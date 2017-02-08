import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath, addPropertyArrayContext } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/DomainEntity/DomainEntityMustContainNoMoreThanOneUniqueIdColumn';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_validating_domain_entity_with_no_uniqueId_fields', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntity1')
      .withDocumentation('doc1')
      .withStringIdentity('Property1', 'doc2', 100)
      .withStringProperty('Property2', 'doc', true, false, 50)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().should.be.empty;
    });
  });

  describe('When_validating_domain_entity_with_one_uniqueId_field', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntity1')
      .withDocumentation('doc1')
      .withStringIdentity('UniqueId', 'doc2', 100)
      .withStringProperty('Property2', 'doc', true, false, 50)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().should.be.empty;
    });
  });

  describe('When_validating_domain_entity_with_multiple_uniqueId_fields', () => {
    const entityName: string = 'DomainEntity1';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc1')
      .withStringIdentity('UniqueId', 'doc2', 100, null, 'Student')
      .withStringIdentity('UniqueId', 'doc2', 100, null, 'Staff')
      .withStringProperty('Property2', 'doc', true, false, 50)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Domain Entity');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('has multiple properties with a property name of \'UniqueId\'');
    });
  });

  describe('When_validating_domain_entity_with_multiple_uniqueId_fields_in_extension_namespace', () => {
    const entityName: string = 'DomainEntity1';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc1')
      .withStringIdentity('UniqueId', 'doc2', 100, null, 'Student')
      .withStringIdentity('UniqueId', 'doc2', 100, null, 'Staff')
      .withStringProperty('Property2', 'doc', true, false, 50)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().should.be.empty;
    });
  });

  describe('When rule context has entityName exception', () => {
    const { ruleContext } = addRuleContextPath(['entityName', 'ID'], {}, true);

    const { leafContext: stringPropertyContext } = addPropertyArrayContext('stringProperty', ruleContext);
    addRuleContextPath(['propertyName', 'ID'], stringPropertyContext, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has identity exception', () => {
    const { ruleContext } = addRuleContextPath(['entityName', 'ID'], {}, false);

    const { leafContext: stringPropertyContext } = addPropertyArrayContext('stringProperty', ruleContext);
    addRuleContextPath(['propertyName', 'ID'], stringPropertyContext, true);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
