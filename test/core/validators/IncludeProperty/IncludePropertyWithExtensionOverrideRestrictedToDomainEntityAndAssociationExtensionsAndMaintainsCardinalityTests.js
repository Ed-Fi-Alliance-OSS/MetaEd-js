import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/IncludeProperty/IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

chai.should();

describe('IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_include_property_does_not_have_extension_override', () => {
    const commonTypeName: string = 'CommonType';
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonType(commonTypeName)
      .withDocumentation('doc')
      .withStringProperty('StringProperty', 'doc', true, false, 100)
      .withEndCommonType()

      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withIncludeIdentity(propertyName, 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_not_have_validation_failure()', () => {
      helper.errorMessages().should.be.empty;
    });
  });

  describe('When_include_property_has_extension_override_on_non_domain_entity_or_association_extensions', () => {
    const commonTypeName: string = 'CommonType';
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonType(commonTypeName)
      .withDocumentation('doc')
      .withStringProperty('StringProperty', 'doc', true, false, 100)
      .withEndCommonType()

      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withIncludeExtensionOverrideProperty(commonTypeName, 'doc', true, true)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('include extension');
      helper.errorMessages()[0].message.should.include(propertyName);
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('invalid');
    });
  });

  describe('When_include_property_has_extension_override_on_domain_entity_extension_without_include_on_extendee', () => {
    const commonTypeName: string = 'CommonType';
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonType(commonTypeName)
      .withDocumentation('doc')
      .withBooleanProperty('DummyProperty1', 'doc', true, false)
      .withEndCommonType()

      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('DummyProperty2', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .withBeginNamespace('extension', 'EXTENSION')
      .withStartDomainEntityExtension(entityName)
      .withIncludeExtensionOverrideProperty(commonTypeName, 'doc', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('include extension');
      helper.errorMessages()[0].message.should.include(propertyName);
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('invalid');
    });
  });

  describe('When_include_property_has_extension_override_on_association_extension_without_include_on_extendee', () => {
    const commonTypeName: string = 'CommonType';
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonType(commonTypeName)
      .withDocumentation('doc')
      .withBooleanProperty('DummyProperty1', 'doc', true, false)
      .withEndCommonType()

      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty('DummyEntity1', 'doc')
      .withDomainEntityProperty('DummyEntity2', 'doc')
      .withBooleanProperty('DummyProperty2', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .withBeginNamespace('extension', 'EXTENSION')
      .withStartAssociationExtension(entityName)
      .withIncludeExtensionOverrideProperty(commonTypeName, 'doc', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('include extension');
      helper.errorMessages()[0].message.should.include(propertyName);
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('invalid');
    });
  });

  describe('When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_matching_cardinality', () => {
    const commonTypeName: string = 'CommonType';
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonType(commonTypeName)
      .withDocumentation('doc')
      .withBooleanProperty('DummyProperty1', 'doc', true, false)
      .withEndCommonType()

      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('DummyProperty2', 'doc', true, false)
      .withIncludeProperty(commonTypeName, 'doc', true, true)
      .withEndDomainEntity()
      .withEndNamespace()
      .withBeginNamespace('extension', 'EXTENSION')
      .withStartDomainEntityExtension(entityName)
      .withIncludeExtensionOverrideProperty(commonTypeName, 'doc', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_not_have_validation_failure()', () => {
      helper.errorMessages().should.be.empty;
    });
  });

  describe('When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_with_matching_cardinality', () => {
    const commonTypeName: string = 'CommonType';
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonType(commonTypeName)
      .withDocumentation('doc')
      .withBooleanProperty('DummyProperty1', 'doc', true, false)
      .withEndCommonType()

      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty('DummyEntity1', 'doc')
      .withDomainEntityProperty('DummyEntity2', 'doc')
      .withIncludeProperty(commonTypeName, 'doc', true, true)
      .withBooleanProperty('DummyProperty2', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .withBeginNamespace('extension', 'EXTENSION')
      .withStartAssociationExtension(entityName)
      .withIncludeExtensionOverrideProperty(commonTypeName, 'doc', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_not_have_validation_failure()', () => {
      helper.errorMessages().should.be.empty;
    });
  });

  describe('When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_collection_cardinality', () => {
    const commonTypeName: string = 'CommonType';
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonType(commonTypeName)
      .withDocumentation('doc')
      .withBooleanProperty('DummyProperty1', 'doc', true, false)
      .withEndCommonType()

      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('DummyProperty2', 'doc', true, false)
      .withIncludeProperty(commonTypeName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .withBeginNamespace('extension', 'EXTENSION')
      .withStartDomainEntityExtension(entityName)
      .withIncludeExtensionOverrideProperty(commonTypeName, 'doc', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('include extension');
      helper.errorMessages()[0].message.should.include(propertyName);
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('invalid');
    });
  });

  describe('When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_nullability', () => {
    const commonTypeName: string = 'CommonType';
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonType(commonTypeName)
      .withDocumentation('doc')
      .withBooleanProperty('DummyProperty1', 'doc', true, false)
      .withEndCommonType()

      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('DummyProperty2', 'doc', true, false)
      .withIncludeProperty(commonTypeName, 'doc', false, true)
      .withEndDomainEntity()
      .withEndNamespace()
      .withBeginNamespace('extension', 'EXTENSION')
      .withStartDomainEntityExtension(entityName)
      .withIncludeExtensionOverrideProperty(commonTypeName, 'doc', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('include extension');
      helper.errorMessages()[0].message.should.include(propertyName);
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('invalid');
    });
  });

  describe('When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_collection_cardinality', () => {
    const commonTypeName: string = 'CommonType';
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonType(commonTypeName)
      .withDocumentation('doc')
      .withBooleanProperty('DummyProperty1', 'doc', true, false)
      .withEndCommonType()

      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty('DummyEntity1', 'doc')
      .withDomainEntityProperty('DummyEntity2', 'doc')
      .withIncludeProperty(commonTypeName, 'doc', true, false)
      .withBooleanProperty('DummyProperty2', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .withBeginNamespace('extension', 'EXTENSION')
      .withStartAssociationExtension(entityName)
      .withIncludeExtensionOverrideProperty(commonTypeName, 'doc', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('include extension');
      helper.errorMessages()[0].message.should.include(propertyName);
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('invalid');
    });
  });

  describe('When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_nullability', () => {
    const commonTypeName: string = 'CommonType';
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonType(commonTypeName)
      .withDocumentation('doc')
      .withBooleanProperty('DummyProperty1', 'doc', true, false)
      .withEndCommonType()

      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty('DummyEntity1', 'doc')
      .withDomainEntityProperty('DummyEntity2', 'doc')
      .withIncludeProperty(commonTypeName, 'doc', false, true)
      .withBooleanProperty('DummyProperty2', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .withBeginNamespace('extension', 'EXTENSION')
      .withStartAssociationExtension(entityName)
      .withIncludeExtensionOverrideProperty(commonTypeName, 'doc', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('include extension');
      helper.errorMessages()[0].message.should.include(propertyName);
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('invalid');
    });
  });

  describe('When rule context has propertyName exception', () => {
    const { ruleContext } = addRuleContextPath(['propertyName', 'ID'],
      {
        ruleIndex: MetaEdGrammar.RULE_stringProperty,
        includeExtensionOverride: () => ({}),
      }, true);

    const { ruleContext: parentContext } = addRuleContextPath(['DOMAIN_ENTITY'], { ruleIndex: MetaEdGrammar.RULE_domainEntityExtension }, false);
    ruleContext.parentCtx = parentContext;
    addRuleContextPath(['extendeeName', 'ID'], parentContext, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has DOMAIN_ENTITY exception', () => {
    const { ruleContext } = addRuleContextPath(['propertyName', 'ID'],
      {
        ruleIndex: MetaEdGrammar.RULE_stringProperty,
        includeExtensionOverride: () => ({}),
      }, false);

    const { ruleContext: parentContext } = addRuleContextPath(['DOMAIN_ENTITY'], { ruleIndex: MetaEdGrammar.RULE_domainEntityExtension }, true);
    ruleContext.parentCtx = parentContext;
    addRuleContextPath(['extendeeName', 'ID'], parentContext, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has extendeeName exception', () => {
    const { ruleContext } = addRuleContextPath(['propertyName', 'ID'],
      {
        ruleIndex: MetaEdGrammar.RULE_stringProperty,
        includeExtensionOverride: () => ({}),
      }, false);

    const { ruleContext: parentContext } = addRuleContextPath(['DOMAIN_ENTITY'], { ruleIndex: MetaEdGrammar.RULE_domainEntityExtension }, false);
    ruleContext.parentCtx = parentContext;
    addRuleContextPath(['extendeeName', 'ID'], parentContext, true);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
