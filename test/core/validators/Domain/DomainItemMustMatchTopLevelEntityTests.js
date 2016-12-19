import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/Domain/DomainItemMustMatchTopLevelEntity';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('DomainItemMustMatchTopLevelEntityTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_domain_item_is_domain_entity', () => {
    const entityName: string = 'EntityName';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withEndDomainEntity()

      .withStartDomain('DomainName')
      .withDocumentation('doc')
      .withDomainItem(entityName)
      .withEndDomain()
      .withStartSubdomain('SubdomainName', 'DomainName')
      .withDocumentation('doc')
      .withDomainItem(entityName)
      .withEndSubdomain()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_domain_item_is_domain_entity_subclass', () => {
    const entityName: string = 'EntityName';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntityBase')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(entityName, 'DomainEntityBase')
      .withDocumentation('doc')
      .withDateProperty('BeginDate', 'doc', true, false)
      .withEndDomainEntitySubclass()

      .withStartDomain('DomainName')
      .withDocumentation('doc')
      .withDomainItem(entityName)
      .withEndDomain()
      .withStartSubdomain('SubdomainName', 'DomainName')
      .withDocumentation('doc')
      .withDomainItem(entityName)
      .withEndSubdomain()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_domain_item_is_association', () => {
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty('DomainEntity1', 'doc')
      .withDomainEntityProperty('DomainEntity2', 'doc')
      .withBooleanProperty('Property1', 'because a property is required', true, false)
      .withEndAssociation()

      .withStartDomain('DomainName')
      .withDocumentation('doc')
      .withDomainItem(entityName)
      .withEndDomain()
      .withStartSubdomain('SubdomainName', 'DomainName')
      .withDocumentation('doc')
      .withDomainItem(entityName)
      .withEndSubdomain()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_domain_item_is_association_subclass', () => {
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation('BaseName')
      .withDocumentation('doc')
      .withDomainEntityProperty('DomainEntity1', 'doc')
      .withDomainEntityProperty('DomainEntity2', 'doc')
      .withBooleanProperty('Property1', 'doc', true, false)
      .withEndAssociation()

      .withStartAssociationSubclass(entityName, 'BaseName')
      .withDocumentation('doc')
      .withBooleanProperty('Property2', 'doc', true, false)
      .withEndAssociationSubclass()

      .withStartDomain('DomainName')
      .withDocumentation('doc')
      .withDomainItem(entityName)
      .withEndDomain()
      .withStartSubdomain('SubdomainName', 'DomainName')
      .withDocumentation('doc')
      .withDomainItem(entityName)
      .withEndSubdomain()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_domain_item_is_common_type', () => {
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonType(entityName)
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withEndDescriptor()

      .withStartDomain('DomainName')
      .withDocumentation('doc')
      .withDomainItem(entityName)
      .withEndDomain()
      .withStartSubdomain('SubdomainName', 'DomainName')
      .withDocumentation('doc')
      .withDomainItem(entityName)
      .withEndSubdomain()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_domain_item_under_domain_is_descriptor', () => {
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDescriptor(entityName)
      .withDocumentation('doc')
      .withStartMapType()
      .withDocumentation('map type doc')
      .withEnumerationItem('this is short description 1', 'doc1')
      .withEndMapType()
      .withEndDescriptor()

      .withStartDomain('DomainName')
      .withDocumentation('doc')
      .withDomainItem(entityName)
      .withEndDomain()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_not_validate()', () => {
      helper.errorMessages().should.not.be.empty;
    });
  });

  describe('When_domain_item_under_subdomain_is_descriptor', () => {
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDescriptor(entityName)
      .withDocumentation('doc')
      .withStartMapType()
      .withDocumentation('map type doc')
      .withEnumerationItem('this is short description 1', 'doc1')
      .withEndMapType()
      .withEndDescriptor()

      .withStartSubdomain('SubdomainName', 'DomainName')
      .withDocumentation('doc')
      .withDomainItem(entityName)
      .withEndSubdomain()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_not_validate()', () => {
      helper.errorMessages().should.not.be.empty;
    });
  });

  describe('When_domain_item_under_domain_has_invalid_identifier', () => {
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomain('DomainName')
      .withDocumentation('doc')
      .withDomainItem(entityName)
      .withEndDomain()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Domain item');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('Domain');
      helper.errorMessages()[0].message.should.include('DomainName');
      helper.errorMessages()[0].message.should.include('does not match');
    });
  });

  describe('When_domain_item_under_subdomain_has_invalid_identifier', () => {
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSubdomain('SubdomainName', 'DomainName')
      .withDocumentation('doc')
      .withDomainItem(entityName)
      .withEndSubdomain()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Domain item');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('Subdomain');
      helper.errorMessages()[0].message.should.include('SubdomainName');
      helper.errorMessages()[0].message.should.include('does not match');
    });
  });
});
