import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/DomainEntitySubclass/DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClassTests', () => {
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
      helper.errorMessageCollection().should.be.empty;
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
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(entityName, baseName)
      .withDocumentation('because documentation is required')
      .withStringProperty('Property2', 'because a property is required', true, false, 100)
      .withEndDomainEntitySubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().should.be.empty;
    });
  });

  describe('When_domain_entity_subclass_renames_base_identity_that_does_not_exist', () => {
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
      .withStringIdentityRename('Property2', 'Property3', 'because a property is required', 100)
      .withEndDomainEntitySubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessageCollection().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection()[0].message.should.equal('Domain Entity \'SubclassIdentifier\' based on \'BaseDomainEntityIdentifier\' tries to rename Property3 which is not part of the identity.');
    });
  });

  describe('When_domain_entity_subclass_renames_base_property_that_is_not_identity', () => {
    const entityName: string = 'SubclassIdentifier';
    const baseName: string = 'BaseDomainEntityIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(baseName)
      .withDocumentation('because documentation is required')
      .withStringIdentity('Property1', 'because a property is required', 100)
      .withStringProperty('Property3', 'foo', true, false, 100)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(entityName, baseName)
      .withDocumentation('because documentation is required')
      .withStringIdentityRename('Property2', 'Property3', 'because a property is required', 100)
      .withEndDomainEntitySubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessageCollection().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection()[0].message.should.equal('Domain Entity \'SubclassIdentifier\' based on \'BaseDomainEntityIdentifier\' tries to rename Property3 which is not part of the identity.');
    });
  });

  describe('When_domain_entity_subclass_extends_non_existant_entity', () => {
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
      helper.errorMessageCollection().should.be.empty;
    });
  });
});
