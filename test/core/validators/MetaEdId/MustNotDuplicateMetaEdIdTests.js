import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/MetaEdId/MustNotDuplicateMetaEdId';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('MustNotDuplicateMetaEdId', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_domain_entity_has_valid_metaEdId', () => {
    const metaEdId1: string = '100';
    const metaEdId2: string = '101';
    const entityName1: string = 'MyIdentifier1';
    const propertyName1: string = 'Identifier1';
    const entityName2: string = 'MyIdentifier2';
    const propertyName2: string = 'Identifier2';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName1)
      .withMetaEdId(metaEdId1)
      .withDocumentation('doc')
      .withStringIdentity(propertyName1, 'doc', 100)
      .withEndDomainEntity()

      .withStartDomainEntity(entityName2)
      .withMetaEdId(metaEdId2)
      .withDocumentation('doc')
      .withStringIdentity(propertyName2, 'doc', 100)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_not_have_validation_failure()', () => {
      helper.errorMessages().should.be.empty;
    });
  });

  describe('When_domain_entity_has_duplicate_metaEdId', () => {
    const metaEdId: string = '100';
    const entityName1: string = 'MyIdentifier1';
    const propertyName1: string = 'Identifier1';
    const entityName2: string = 'MyIdentifier2';
    const propertyName2: string = 'Identifier2';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName1)
      .withMetaEdId(metaEdId)
      .withDocumentation('doc')
      .withStringIdentity(propertyName1, 'doc', 100)
      .withEndDomainEntity()

      .withStartDomainEntity(entityName2)
      .withMetaEdId(metaEdId)
      .withDocumentation('doc')
      .withStringIdentity(propertyName2, 'doc', 100)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('MetaEdId');
      helper.errorMessages()[0].message.should.include(metaEdId);
      helper.errorMessages()[0].message.should.include('All MetaEdIds must be globally unique.');
    });
  });

  describe('When_domain_entity_has_duplicate_metaEdId_with_property', () => {
    const metaEdId: string = '100';
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withMetaEdId(metaEdId)
      .withDocumentation('doc')
      .withStringIdentity(propertyName, 'doc', 100, null, null, metaEdId)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('MetaEdId');
      helper.errorMessages()[0].message.should.include(metaEdId);
      helper.errorMessages()[0].message.should.include('All MetaEdIds must be globally unique.');
    });
  });

  describe('When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity', () => {
    const metaEdId: string = '100';
    const entityName1: string = 'MyIdentifier1';
    const propertyName1: string = 'Identifier1';
    const entityName2: string = 'MyIdentifier2';
    const propertyName2: string = 'Identifier2';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName1)
      .withMetaEdId(metaEdId)
      .withDocumentation('doc')
      .withStringIdentity(propertyName1, 'doc', 100)
      .withEndDomainEntity()

      .withStartDomainEntity(entityName2)
      .withDocumentation('doc')
      .withStringIdentity(propertyName2, 'doc', 100, null, null, metaEdId)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('MetaEdId');
      helper.errorMessages()[0].message.should.include(metaEdId);
      helper.errorMessages()[0].message.should.include('All MetaEdIds must be globally unique.');
    });
  });

  describe('When rule context has METAED_ID exception', () => {
    const { ruleContext } = addRuleContextPath(['METAED_ID'], {}, true);
    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
