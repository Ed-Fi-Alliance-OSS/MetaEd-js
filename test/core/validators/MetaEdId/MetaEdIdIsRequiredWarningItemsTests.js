import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/MetaEdId/MetaEdIdIsRequiredForEntities';
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
      helper.errorMessageCollection.should.be.empty;
    });
  });

  describe('MetaEdIdIsRequiredWarning', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<TTestContext>(
            new MetaEdIdIsRequiredWarning<TTestContext>()));


    describe('MetaEdIdIsRequiredWarningTestBase<TTestContext extends ParserRuleContext>', () => {
        let entityName: string = "MyIdentifier";
        let propertyName: string = "Identifier";
        it('should_not_have_validation_failure()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
        it('should_have_validation_warning()', () => {
            _warningMessageCollection.should.not.be.empty;
        });
    });

    describe('MetaEdIdIsRequiredWarningTestBaseForEntity<TTestContext extends ParserRuleContext> extends MetaEdIdIsRequiredWarningTestBase<TTestContext>
        {
            it('should_have_validation_warning_message()', () => {
            _warningMessageCollection[0].message.should.include(entityName);
            _warningMessageCollection[0].message.should.include("missing MetaEdId");
        });
});

describe('MetaEdIdIsRequiredWarningTestBaseForProperty<TTestContext extends ParserRuleContext> extends MetaEdIdIsRequiredWarningTestBase<TTestContext>
        {
        it('should_have_validation_warning_message()', () => {
        _warningMessageCollection[0].message.should.include(propertyName);
        _warningMessageCollection[0].message.should.include(entityName);
        _warningMessageCollection[0].message.should.include("missing MetaEdId");
    });
});


describe('When_abstractEntity_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.AbstractEntityContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartAbstractEntity(entityName)
            .withDocumentation("doc1")
            .withStringIdentity("Property1", "doc2", 100)
            .withEndAbstractEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_association_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.AssociationContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartAssociation(entityName)
            .withDocumentation("doc")
            .withDomainEntityProperty("First", "doc1")
            .withDomainEntityProperty("Second", "doc2")
            .withEndAssociation()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_associationExtension_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.AssociationExtensionContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartAssociationExtension(entityName)
            .withBooleanProperty("Property2", "because a property is required", true, false)
            .withEndAssociationExtension()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_associationSubclass_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.AssociationSubclassContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartAssociationSubclass(entityName, "BaseClass")
            .withDocumentation("doc")
            .withBooleanProperty("Property2", "doc", true, false)
            .withEndAssociationSubclass()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_booleanProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.BooleanPropertyContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withBooleanProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_choiceType_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.ChoiceTypeContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartChoiceType(entityName)
            .withDocumentation("doc")
            .withBooleanProperty(propertyName, "doc", true, false)
            .withEndChoiceType()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_commonDecimal_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.CommonDecimalContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartCommonDecimal(entityName)
            .withDocumentation("doc")
            .withTotalDigits("10")
            .withDecimalPlaces("2")
            .withEndCommonDecimal()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_commonInteger_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.CommonIntegerContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartCommonInteger(entityName)
            .withDocumentation("doc")
            .withEndCommonInteger()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_commonShort_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.CommonShortContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartCommonShort(entityName)
            .withDocumentation("doc")
            .withEndCommonShort()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_commonString_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.CommonStringContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartCommonString(entityName)
            .withDocumentation("doc")
            .withMaxLength(100)
            .withEndCommonString()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_commonType_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.CommonTypeContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartCommonType(entityName)
            .withDocumentation("doc")
            .withBooleanProperty("Property1", "doc", true, false)
            .withEndCommonType()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_commonTypeExtension_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.CommonTypeExtensionContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartCommonTypeExtension(entityName)
            .withBooleanProperty("Property2", "doc", true, false)
            .withEndCommonTypeExtension()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_currencyProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.CurrencyPropertyContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withCurrencyProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_dateProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.DatePropertyContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withDateProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_decimalProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.DecimalPropertyContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withDecimalProperty(propertyName, "doc", true, false, 10, 2)
            .withEndDomainEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_descriptor_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.DescriptorContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDescriptor(entityName)
            .withDocumentation("doc")
            .withStartMapType()
            .withDocumentation("map type doc")
            .withEnumerationItem("this is short description 1", "doc1")
            .withEnumerationItem("this is short description 2", "doc2")
            .withEndMapType()
            .withEndDescriptor()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_descriptorProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.DescriptorPropertyContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withDescriptorProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_domain_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.DomainContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomain(entityName)
            .withDocumentation("doc")
            .withDomainItem(propertyName)
            .withEndDomain()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_domainEntity_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.DomainEntityContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withStringIdentity(propertyName, "doc", 100)
            .withEndDomainEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_domainEntityExtension_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.DomainEntityExtensionContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntityExtension(entityName)
            .withBooleanProperty("Property2", "because a property is required", true, false)
            .withEndDomainEntityExtension()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_domainEntitySubclass_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.DomainEntitySubclassContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntitySubclass(entityName, "BaseClass")
            .withDocumentation("doc")
            .withBooleanProperty("Property2", "doc", true, false)
            .withEndDomainEntitySubclass()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_domainItem_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.DomainItemContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomain(entityName)
            .withDocumentation("doc")
            .withDomainItem(propertyName)
            .withEndDomain()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_durationProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.DurationPropertyContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withDurationProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_enumeration_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.EnumerationContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartEnumeration(entityName)
            .withDocumentation("doc")
            .withEnumerationItem(propertyName, "doc1")
            .withEndEnumeration()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_enumerationItem_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBase<MetaEdGrammar.EnumerationItemContext>
        {
        it('should_have_validation_warning_message()', () => {
        _warningMessageCollection[0].message.should.include("Item");
        _warningMessageCollection[0].message.should.include(propertyName);
        _warningMessageCollection[0].message.should.include(entityName);
        _warningMessageCollection[0].message.should.include("missing MetaEdId");
    });
const helper: ValidatorTestHelper = new ValidatorTestHelper();
before(() => {
    const metaEdText = MetaEdTextBuilder.build()

        .withBeginNamespace("edfi")
        .withStartEnumeration(entityName)
        .withDocumentation("doc")
        .withEnumerationItem(propertyName, "doc1")
        .withEndEnumeration()
        .withEndNamespace().toString();
    helper.setup(metaEdText, validatorListener);
});
});


describe('When_enumerationProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.EnumerationPropertyContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withEnumerationProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_firstDomainEntity_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.FirstDomainEntityContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartAssociation(entityName)
            .withDocumentation("doc")
            .withDomainEntityProperty("First", "doc1")
            .withDomainEntityProperty("Second", "doc2")
            .withEndAssociation()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_includeProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.IncludePropertyContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withIncludeProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_inlineCommonType_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.InlineCommonTypeContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartInlineCommonType(entityName)
            .withDocumentation("doc")
            .withBooleanProperty("Property1", "doc", true, false)
            .withEndInlineCommonType()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_integerProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.IntegerPropertyContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withIntegerProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_interchange_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.InterchangeContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartInterchange(entityName)
            .withDocumentation("doc")
            .withElement("DomainEntity")
            .withEndInterchange()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_interchangeElement_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBase<MetaEdGrammar.InterchangeElementContext>
        {
        it('should_have_validation_warning_message()', () => {
        _warningMessageCollection[0].message.should.include("Item");
        _warningMessageCollection[0].message.should.include(propertyName);
        _warningMessageCollection[0].message.should.include(entityName);
        _warningMessageCollection[0].message.should.include("missing MetaEdId");
    });
const helper: ValidatorTestHelper = new ValidatorTestHelper();
before(() => {
    const metaEdText = MetaEdTextBuilder.build()

        .withBeginNamespace("edfi")
        .withStartInterchange(entityName)
        .withDocumentation("doc")
        .withElement(propertyName)
        .withEndInterchange()
        .withEndNamespace().toString();
    helper.setup(metaEdText, validatorListener);
});
});


describe('When_interchangeExtension_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.InterchangeExtensionContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartInterchangeExtension(entityName)
            .withElement("DomainEntity")
            .withEndInterchangeExtension()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_interchangeIdentityTemplate_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBase<MetaEdGrammar.InterchangeIdentityTemplateContext>
        {
        it('should_have_validation_warning_message()', () => {
        _warningMessageCollection[0].message.should.include("Item");
        _warningMessageCollection[0].message.should.include(propertyName);
        _warningMessageCollection[0].message.should.include(entityName);
        _warningMessageCollection[0].message.should.include("missing MetaEdId");
    });
const helper: ValidatorTestHelper = new ValidatorTestHelper();
before(() => {
    const metaEdText = MetaEdTextBuilder.build()

        .withBeginNamespace("edfi")
        .withStartInterchange(entityName)
        .withDocumentation("doc")
        .withElement("DomainEntity")
        .withIdentityTemplate(propertyName)
        .withEndInterchange()
        .withEndNamespace().toString();
    helper.setup(metaEdText, validatorListener);
});
});


describe('When_percentProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.PercentPropertyContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withPercentProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_referenceProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.ReferencePropertyContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withReferenceProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_secondDomainEntity_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.SecondDomainEntityContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartAssociation(entityName)
            .withDocumentation("doc")
            .withDomainEntityProperty("First", "doc1")
            .withDomainEntityProperty("Second", "doc2")
            .withEndAssociation()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_sharedDecimalProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.SharedDecimalPropertyContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withSharedDecimalProperty(propertyName, "SharedProperty", "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_sharedIntegerProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.SharedIntegerPropertyContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withSharedIntegerProperty(propertyName, "SharedProperty", "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_sharedShortProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.SharedShortPropertyContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withSharedShortProperty(propertyName, "SharedProperty", "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_sharedStringProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.SharedStringPropertyContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withSharedStringProperty(propertyName, "SharedProperty", "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_shortProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.ShortPropertyContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withShortProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_stringProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.StringPropertyContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withStringProperty(propertyName, "doc", true, false, 100)
            .withEndDomainEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_subdomain_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.SubdomainContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartSubdomain(entityName, "ParentDomain")
            .withDocumentation("doc")
            .withDomainItem(propertyName)
            .withEndSubdomain()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_timeProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.TimePropertyContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withTimeProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_yearProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.YearPropertyContext>
        {
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
        const metaEdText = MetaEdTextBuilder.build()

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withYearProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace().toString();
        helper.setup(metaEdText, validatorListener);
    });
});
});