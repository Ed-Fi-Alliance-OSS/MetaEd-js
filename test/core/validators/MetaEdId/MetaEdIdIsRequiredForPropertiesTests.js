import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/MetaEdId/MetaEdIdIsRequiredForProperties';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

chai.should();

describe('MetaEdIdIsRequiredForPropertiesTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  const entityName: string = 'MyIdentifier';
  const propertyName: string = 'Identifier';

  describe('When_booleanProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_currencyProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withCurrencyProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_dateProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDateProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_decimalProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDecimalProperty(propertyName, 'doc', true, false, 10, 2)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_descriptorProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDescriptorProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_durationProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDurationProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_enumerationProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withEnumerationProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_firstDomainEntity_is_missing_metaEdId', () => {
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
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_commonProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withCommonProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_integerProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_percentProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withPercentProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_referenceProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_secondDomainEntity_is_missing_metaEdId', () => {
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
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_sharedDecimalProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedDecimalProperty(propertyName, 'SharedProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_sharedIntegerProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedIntegerProperty(propertyName, 'SharedProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_sharedShortProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedShortProperty(propertyName, 'SharedProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_sharedStringProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedStringProperty(propertyName, 'SharedProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_shortProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withShortProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_stringProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringProperty(propertyName, 'doc', true, false, 100)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_timeProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withTimeProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_yearProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withYearProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
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
