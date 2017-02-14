import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/Identity/IdentityExistsOnlyIfIdentityIsAllowed';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

chai.should();

describe('IdentityExistsOnlyIfIdentityIsAllowedTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_domain_entity_has_valid_identity_property', () => {
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity(propertyName, 'doc', 100)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_not_have_validation_failure()', () => {
      helper.errorMessages().should.be.empty;
    });
  });

  describe('When_abstract_entity_has_valid_identity_property', () => {
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity(propertyName, 'doc', 100)
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_not_have_validation_failure()', () => {
      helper.errorMessages().should.be.empty;
    });
  });

  describe('When_association_has_valid_identity_property', () => {
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withStringIdentity(propertyName, 'doc', 100)
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_not_have_validation_failure()', () => {
      helper.errorMessages().should.be.empty;
    });
  });

  describe('When_common_type_has_valid_identity_property', () => {
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon(entityName)
      .withDocumentation('doc')
      .withStringIdentity(propertyName, 'doc', 100)
      .withEndCommon()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_not_have_validation_failure()', () => {
      helper.errorMessages().should.be.empty;
    });
  });

  describe('When_inline_common_type_has_valid_identity_property', () => {
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInlineCommon(entityName)
      .withDocumentation('doc')
      .withStringIdentity(propertyName, 'doc', 100)
      .withEndInlineCommon()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_not_have_validation_failure()', () => {
      helper.errorMessages().should.be.empty;
    });
  });

  describe('When_association_extension_has_invalid_identity_property', () => {
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('because documentation is required')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withBooleanProperty('Property1', 'because a property is required', true, false)
      .withEndAssociation()

      .withStartAssociationExtension(entityName)
      .withStringIdentity(propertyName, 'doc', 100)
      .withEndAssociationExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Association');
      helper.errorMessages()[0].message.should.include('additions');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include(propertyName);
      helper.errorMessages()[0].message.should.include('invalid');
    });
  });

  describe('When_association_subclass_has_invalid_identity_property', () => {
    const entityName: string = 'MyIdentifier';
    const subClassName: string = 'NewSubclass';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withEndAssociation()

      .withStartAssociationSubclass(subClassName, entityName)
      .withDocumentation('doc')
      .withStringIdentity(propertyName, 'doc', 100)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Association');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include(subClassName);
      helper.errorMessages()[0].message.should.include(propertyName);
      helper.errorMessages()[0].message.should.include('invalid');
    });
  });

  describe('When_descriptor_has_invalid_identity_property', () => {
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDescriptor(entityName)
      .withDocumentation('doc')
      .withStringIdentity(propertyName, 'doc', 100)
      .withStartMapType()
      .withDocumentation('map type doc')
      .withEnumerationItem('this is short description 1', 'doc1')
      .withEnumerationItem('this is short description 2', 'doc2')
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Descriptor');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include(propertyName);
      helper.errorMessages()[0].message.should.include('invalid');
    });
  });

  describe('When_domain_entity_extension_has_invalid_identity_property', () => {
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('because documentation is required')
      .withBooleanProperty('Property1', 'because a property is required', true, false)
      .withEndDomainEntity()

      .withStartDomainEntityExtension(entityName)
      .withStringIdentity(propertyName, 'doc', 100)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Domain Entity');
      helper.errorMessages()[0].message.should.include('additions');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include(propertyName);
      helper.errorMessages()[0].message.should.include('invalid');
    });
  });

  describe('When_domain_entity_subclass_has_invalid_identity_property', () => {
    const entityName: string = 'MyIdentifier';
    const subClassName: string = 'NewSubclass';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('BaseIdentifier', 'doc', 100)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(subClassName, entityName)
      .withDocumentation('doc')
      .withStringIdentity(propertyName, 'doc', 100)
      .withEndDomainEntitySubclass()
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
      helper.errorMessages()[0].message.should.include(subClassName);
      helper.errorMessages()[0].message.should.include(propertyName);
      helper.errorMessages()[0].message.should.include('invalid');
    });
  });

  describe('When rule context has propertyName exception', () => {
    const { ruleContext } = addRuleContextPath(['propertyName', 'ID'], { ruleIndex: MetaEdGrammar.RULE_stringProperty }, true);

    const { ruleContext: parentContext } = addRuleContextPath(['DOMAIN_ENTITY'], { ruleIndex: MetaEdGrammar.RULE_domainEntity }, false);
    ruleContext.parentCtx = parentContext;
    addRuleContextPath(['entityName', 'ID'], parentContext, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has DOMAIN_ENTITY exception', () => {
    const { ruleContext } = addRuleContextPath(['propertyName', 'ID'], { ruleIndex: MetaEdGrammar.RULE_stringProperty }, false);

    const { ruleContext: parentContext } = addRuleContextPath(['DOMAIN_ENTITY'], { ruleIndex: MetaEdGrammar.RULE_domainEntity }, true);
    ruleContext.parentCtx = parentContext;
    addRuleContextPath(['entityName', 'ID'], parentContext, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has entityName exception', () => {
    const { ruleContext } = addRuleContextPath(['propertyName', 'ID'], { ruleIndex: MetaEdGrammar.RULE_stringProperty }, false);

    const { ruleContext: parentContext } = addRuleContextPath(['DOMAIN_ENTITY'], { ruleIndex: MetaEdGrammar.RULE_domainEntity }, false);
    ruleContext.parentCtx = parentContext;
    addRuleContextPath(['entityName', 'ID'], parentContext, true);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
