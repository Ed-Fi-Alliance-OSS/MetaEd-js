import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/IdentityRename/IdentityRenameExistsOnlyIfIdentityRenameIsAllowed';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('IdentityRenameExistsOnlyIfIdentityRenameIsAllowedTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_association_subclass_has_invalid_identity_rename_property', () => {
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty('DomainEntity1', 'doc')
      .withDomainEntityProperty('DomainEntity2', 'doc')
      .withStringIdentityRename(propertyName, 'BaseIdentifier', 'Docs', 100)
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessageCollection.should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection[0].message.should.include('Association');
      helper.errorMessageCollection[0].message.should.include(entityName);
      helper.errorMessageCollection[0].message.should.include(propertyName);
      helper.errorMessageCollection[0].message.should.include('invalid');
    });
  });

  describe('When_domain_entity_has_invalid_identity_rename_property', () => {
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentityRename(propertyName, 'BaseIdentifier', 'doc', 100)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessageCollection.should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection[0].message.should.include('Domain Entity');
      helper.errorMessageCollection[0].message.should.include(entityName);
      helper.errorMessageCollection[0].message.should.include(propertyName);
      helper.errorMessageCollection[0].message.should.include('invalid');
    });
  });

  describe('When_association_subclass_has_valid_identity_rename_property', () => {
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty('DomainEntity1', 'doc')
      .withDomainEntityProperty('DomainEntity2', 'doc')
      .withStringIdentity('BaseIdentifier', 'doc', 100)
      .withEndAssociation()

      .withStartAssociationSubclass('NewSubclass', entityName)
      .withDocumentation('doc')
      .withStringIdentityRename('Identifier', 'BaseIdentifier', 'Docs', 100)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection.length.should.equal(0);
    });
  });

  describe('When_domain_entity_subclass_has_valid_identity_rename_property', () => {
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('BaseIdentifier', 'doc', 100)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass('NewSubclass', entityName)
      .withDocumentation('doc')
      .withStringIdentityRename('Identifier', 'BaseIdentifier', 'Docs', 100)
      .withEndDomainEntitySubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection.length.should.equal(0);
    });
  });
});
