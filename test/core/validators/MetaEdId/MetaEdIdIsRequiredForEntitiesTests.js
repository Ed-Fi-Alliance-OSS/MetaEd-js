import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/MetaEdId/MetaEdIdIsRequiredForEntities';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

chai.should();

describe('MetaEdIdIsRequiredForEntitiesTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  const entityName: string = 'MyIdentifier';
  const propertyName: string = 'Identifier';

  describe('When_abstractEntity_is_missing_metaEdIdForEntity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc1')
      .withStringIdentity('Property1', 'doc2', 100)
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_association_is_missing_metaEdIdForEntity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('First', 'doc1')
      .withAssociationDomainEntityProperty('Second', 'doc2')
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_associationExtension_is_missing_metaEdIdForEntity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociationExtension(entityName)
      .withBooleanProperty('Property2', 'because a property is required', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_associationSubclass_is_missing_metaEdIdForEntity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociationSubclass(entityName, 'BaseClass')
      .withDocumentation('doc')
      .withBooleanProperty('Property2', 'doc', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_choiceType_is_missing_metaEdIdForEntity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartChoice(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withEndChoice()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_commonDecimal_is_missing_metaEdIdForEntity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedDecimal(entityName)
      .withDocumentation('doc')
      .withTotalDigits('10')
      .withDecimalPlaces('2')
      .withEndSharedDecimal()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_commonInteger_is_missing_metaEdIdForEntity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedInteger(entityName)
      .withDocumentation('doc')
      .withEndSharedInteger()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_commonShort_is_missing_metaEdIdForEntity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedShort(entityName)
      .withDocumentation('doc')
      .withEndSharedShort()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_commonString_is_missing_metaEdIdForEntity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedString(entityName)
      .withDocumentation('doc')
      .withMaxLength(100)
      .withEndSharedString()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_commonType_is_missing_metaEdIdForEntity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('Property1', 'doc', true, false)
      .withEndCommon()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_commonTypeExtension_is_missing_metaEdIdForEntity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonExtension(entityName)
      .withBooleanProperty('Property2', 'doc', true, false)
      .withEndCommonExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_descriptor_is_missing_metaEdIdForEntity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDescriptor(entityName)
      .withDocumentation('doc')
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

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_domain_is_missing_metaEdIdForEntity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomain(entityName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem(propertyName)
      .withEndDomain()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_domainEntity_is_missing_metaEdIdForEntity', () => {
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

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_domainEntityExtension_is_missing_metaEdIdForEntity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty('Property2', 'because a property is required', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_domainEntitySubclass_is_missing_metaEdIdForEntity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntitySubclass(entityName, 'BaseClass')
      .withDocumentation('doc')
      .withBooleanProperty('Property2', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_enumeration_is_missing_metaEdIdForEntity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartEnumeration(entityName)
      .withDocumentation('doc')
      .withEnumerationItem(propertyName, 'doc1')
      .withEndEnumeration()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_inlineCommonType_is_missing_metaEdIdForEntity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInlineCommon(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('Property1', 'doc', true, false)
      .withEndInlineCommon()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_interchange_is_missing_metaEdIdForEntity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange(entityName)
      .withDocumentation('doc')
      .withDomainEntityElement('DomainEntity')
      .withEndInterchange()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_interchangeExtension_is_missing_metaEdIdForEntity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchangeExtension(entityName)
      .withDomainEntityElement('DomainEntity')
      .withEndInterchangeExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_subdomain_is_missing_metaEdIdForEntity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSubdomain(entityName, 'ParentDomain')
      .withDocumentation('doc')
      .withDomainEntityElement(propertyName)
      .withEndSubdomain()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When rule context has DOMAIN_ENTITY exception', () => {
    const { ruleContext } = addRuleContextPath(['DOMAIN_ENTITY'], { ruleIndex: MetaEdGrammar.RULE_domainEntity }, true);
    addRuleContextPath(['entityName', 'ID'], ruleContext, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has entityName exception', () => {
    const { ruleContext } = addRuleContextPath(['DOMAIN_ENTITY'], { ruleIndex: MetaEdGrammar.RULE_domainEntity }, false);
    addRuleContextPath(['entityName', 'ID'], ruleContext, true);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
