import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/Domain/DomainItemMustMatchTopLevelEntity';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

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
      .withDomainEntityDomainItem(entityName)
      .withEndDomain()
      .withStartSubdomain('SubdomainName', 'DomainName')
      .withDocumentation('doc')
      .withDomainEntityDomainItem(entityName)
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
      .withDomainEntityDomainItem(entityName)
      .withEndDomain()
      .withStartSubdomain('SubdomainName', 'DomainName')
      .withDocumentation('doc')
      .withDomainEntityDomainItem(entityName)
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
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withBooleanProperty('Property1', 'because a property is required', true, false)
      .withEndAssociation()

      .withStartDomain('DomainName')
      .withDocumentation('doc')
      .withAssociationDomainItem(entityName)
      .withEndDomain()
      .withStartSubdomain('SubdomainName', 'DomainName')
      .withDocumentation('doc')
      .withAssociationDomainItem(entityName)
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
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withBooleanProperty('Property1', 'doc', true, false)
      .withEndAssociation()

      .withStartAssociationSubclass(entityName, 'BaseName')
      .withDocumentation('doc')
      .withBooleanProperty('Property2', 'doc', true, false)
      .withEndAssociationSubclass()

      .withStartDomain('DomainName')
      .withDocumentation('doc')
      .withAssociationDomainItem(entityName)
      .withEndDomain()
      .withStartSubdomain('SubdomainName', 'DomainName')
      .withDocumentation('doc')
      .withAssociationDomainItem(entityName)
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
      .withStartCommon(entityName)
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withEndDescriptor()

      .withStartDomain('DomainName')
      .withDocumentation('doc')
      .withCommonDomainItem(entityName)
      .withEndDomain()
      .withStartSubdomain('SubdomainName', 'DomainName')
      .withDocumentation('doc')
      .withCommonDomainItem(entityName)
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
      .withDescriptorDomainItem(entityName)
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
      .withDescriptorDomainItem(entityName)
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
      .withDomainEntityDomainItem(entityName)
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
      .withDomainEntityDomainItem(entityName)
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

  describe('When rule context has ID exception', () => {
    const { ruleContext } = addRuleContextPath(['ID'], { ruleIndex: MetaEdGrammar.RULE_domainItem }, true);

    const { ruleContext: parentContext } = addRuleContextPath(['DOMAIN'], { ruleIndex: MetaEdGrammar.RULE_domain }, false);
    ruleContext.parentCtx = parentContext;
    addRuleContextPath(['entityName', 'ID'], parentContext, false);

    const { invalidPath, validatorName } = validatable('DomainItemMustMatchTopLevelEntityTests', ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has DOMAIN_ENTITY exception', () => {
    const { ruleContext } = addRuleContextPath(['ID'], { ruleIndex: MetaEdGrammar.RULE_domainItem }, false);

    const { ruleContext: parentContext } = addRuleContextPath(['DOMAIN'], { ruleIndex: MetaEdGrammar.RULE_domain }, true);
    ruleContext.parentCtx = parentContext;
    addRuleContextPath(['entityName', 'ID'], parentContext, false);

    const { invalidPath, validatorName } = validatable('DomainItemMustMatchTopLevelEntityTests', ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has entityName exception', () => {
    const { ruleContext } = addRuleContextPath(['ID'], { ruleIndex: MetaEdGrammar.RULE_domainItem }, false);

    const { ruleContext: parentContext } = addRuleContextPath(['DOMAIN'], { ruleIndex: MetaEdGrammar.RULE_domain }, false);
    ruleContext.parentCtx = parentContext;
    addRuleContextPath(['entityName', 'ID'], parentContext, true);

    const { invalidPath, validatorName } = validatable('DomainItemMustMatchTopLevelEntityTests', ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
