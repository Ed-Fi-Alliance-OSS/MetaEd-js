import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/DomainEntity/DomainEntityMustContainNoMoreThanOneUniqueIdColumn';
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
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().should.be.empty;
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
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().should.be.empty;
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
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessageCollection().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection()[0].message.should.include('Domain Entity');
      helper.errorMessageCollection()[0].message.should.include(entityName);
      helper.errorMessageCollection()[0].message.should.include('has multiple properties with a property name of \'UniqueId\'');
    });
  });

  describe('When_validating_domain_entity_with_multiple_uniqueId_fields_in_extension_namespace', () => {
    const entityName: string = 'DomainEntity1';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('extension', 'projectExtension')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc1')
      .withStringIdentity('UniqueId', 'doc2', 100, null, 'Student')
      .withStringIdentity('UniqueId', 'doc2', 100, null, 'Staff')
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().should.be.empty;
    });
  });
});
