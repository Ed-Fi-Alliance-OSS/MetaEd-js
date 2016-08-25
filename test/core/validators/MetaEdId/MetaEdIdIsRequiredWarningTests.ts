/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {MetaEdIdIsRequiredWarning}from "../../../../src/core/validators/MetaEdId/MetaEdIdIsRequiredWarning"

//TOOD: special case ?

let should = chai.should();

describe('MetaEdIdIsRequiredWarning', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<TTestContext>(
            new MetaEdIdIsRequiredWarning<TTestContext>()));


    describe('MetaEdIdIsRequiredWarningTestBase<TTestContext extends ParserRuleContext>', () => {
        let entityName: string = "MyIdentifier";
        let propertyName: string = "Identifier";
        it('should_not_have_validation_failure()', () => {
            helper.errorMessageCollection.ShouldBeEmpty();
        });
        it('should_have_validation_warning()', () => {
            _warningMessageCollection.ShouldNotBeEmpty();
        });
    });

    describe('MetaEdIdIsRequiredWarningTestBaseForEntity<TTestContext extends ParserRuleContext> extends MetaEdIdIsRequiredWarningTestBase<TTestContext>
        {
            it('should_have_validation_warning_message()', () => {
            _warningMessageCollection[0].Message.ShouldContain(entityName);
            _warningMessageCollection[0].Message.ShouldContain("missing MetaEdId");
        });
});

describe('MetaEdIdIsRequiredWarningTestBaseForProperty<TTestContext extends ParserRuleContext> extends MetaEdIdIsRequiredWarningTestBase<TTestContext>
        {
        it('should_have_validation_warning_message()', () => {
        _warningMessageCollection[0].Message.ShouldContain(propertyName);
        _warningMessageCollection[0].Message.ShouldContain(entityName);
        _warningMessageCollection[0].Message.ShouldContain("missing MetaEdId");
    });
});


describe('When_abstractEntity_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.AbstractEntityContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartAbstractEntity(entityName)
            .withDocumentation("doc1")
            .withStringIdentity("Property1", "doc2", 100)
            .withEndAbstractEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_association_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.AssociationContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartAssociation(entityName)
            .withDocumentation("doc")
            .withDomainEntityProperty("First", "doc1")
            .withDomainEntityProperty("Second", "doc2")
            .withEndAssociation()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_associationExtension_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.AssociationExtensionContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartAssociationExtension(entityName)
            .withBooleanProperty("Property2", "because a property is required", true, false)
            .withEndAssociationExtension()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_associationSubclass_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.AssociationSubclassContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartAssociationSubclass(entityName, "BaseClass")
            .withDocumentation("doc")
            .withBooleanProperty("Property2", "doc", true, false)
            .withEndAssociationSubclass()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_booleanProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.BooleanPropertyContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withBooleanProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_choiceType_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.ChoiceTypeContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartChoiceType(entityName)
            .withDocumentation("doc")
            .withBooleanProperty(propertyName, "doc", true, false)
            .withEndChoiceType()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_commonDecimal_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.CommonDecimalContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartCommonDecimal(entityName)
            .withDocumentation("doc")
            .withTotalDigits("10")
            .withDecimalPlaces("2")
            .withEndCommonDecimal()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_commonInteger_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.CommonIntegerContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartCommonInteger(entityName)
            .withDocumentation("doc")
            .withEndCommonInteger()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_commonShort_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.CommonShortContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartCommonShort(entityName)
            .withDocumentation("doc")
            .withEndCommonShort()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_commonString_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.CommonStringContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartCommonString(entityName)
            .withDocumentation("doc")
            .withMaxLength(100)
            .withEndCommonString()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_commonType_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.CommonTypeContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartCommonType(entityName)
            .withDocumentation("doc")
            .withBooleanProperty("Property1", "doc", true, false)
            .withEndCommonType()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_commonTypeExtension_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.CommonTypeExtensionContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartCommonTypeExtension(entityName)
            .withBooleanProperty("Property2", "doc", true, false)
            .withEndCommonTypeExtension()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_currencyProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.CurrencyPropertyContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withCurrencyProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_dateProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.DatePropertyContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withDateProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_decimalProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.DecimalPropertyContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withDecimalProperty(propertyName, "doc", true, false, 10, 2)
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_descriptor_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.DescriptorContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDescriptor(entityName)
            .withDocumentation("doc")
            .withStartMapType()
            .withDocumentation("map type doc")
            .withEnumerationItem("this is short description 1", "doc1")
            .withEnumerationItem("this is short description 2", "doc2")
            .withEndMapType()
            .withEndDescriptor()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_descriptorProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.DescriptorPropertyContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withDescriptorProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_domain_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.DomainContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomain(entityName)
            .withDocumentation("doc")
            .withDomainItem(propertyName)
            .withEndDomain()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_domainEntity_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.DomainEntityContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withStringIdentity(propertyName, "doc", 100)
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_domainEntityExtension_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.DomainEntityExtensionContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntityExtension(entityName)
            .withBooleanProperty("Property2", "because a property is required", true, false)
            .withEndDomainEntityExtension()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_domainEntitySubclass_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.DomainEntitySubclassContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntitySubclass(entityName, "BaseClass")
            .withDocumentation("doc")
            .withBooleanProperty("Property2", "doc", true, false)
            .withEndDomainEntitySubclass()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_domainItem_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.DomainItemContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomain(entityName)
            .withDocumentation("doc")
            .withDomainItem(propertyName)
            .withEndDomain()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_durationProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.DurationPropertyContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withDurationProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_enumeration_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.EnumerationContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartEnumeration(entityName)
            .withDocumentation("doc")
            .withEnumerationItem(propertyName, "doc1")
            .withEndEnumeration()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_enumerationItem_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBase<MetaEdGrammar.EnumerationItemContext>
        {
        it('should_have_validation_warning_message()', () => {
        _warningMessageCollection[0].Message.ShouldContain("Item");
        _warningMessageCollection[0].Message.ShouldContain(propertyName);
        _warningMessageCollection[0].Message.ShouldContain(entityName);
        _warningMessageCollection[0].Message.ShouldContain("missing MetaEdId");
    });
let helper: ValidationTestHelper = new ValidationTestHelper();
before(() => {
    let metaEdText = MetaEdTextBuilder.buildIt

        .withBeginNamespace("edfi")
        .withStartEnumeration(entityName)
        .withDocumentation("doc")
        .withEnumerationItem(propertyName, "doc1")
        .withEndEnumeration()
        .withEndNamespace();
    helper.setup(metaEdText, validatorListener);
});
});


describe('When_enumerationProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.EnumerationPropertyContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withEnumerationProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_firstDomainEntity_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.FirstDomainEntityContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartAssociation(entityName)
            .withDocumentation("doc")
            .withDomainEntityProperty("First", "doc1")
            .withDomainEntityProperty("Second", "doc2")
            .withEndAssociation()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_includeProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.IncludePropertyContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withIncludeProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_inlineCommonType_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.InlineCommonTypeContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartInlineCommonType(entityName)
            .withDocumentation("doc")
            .withBooleanProperty("Property1", "doc", true, false)
            .withEndInlineCommonType()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_integerProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.IntegerPropertyContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withIntegerProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_interchange_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.InterchangeContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartInterchange(entityName)
            .withDocumentation("doc")
            .withElement("DomainEntity")
            .withEndInterchange()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_interchangeElement_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBase<MetaEdGrammar.InterchangeElementContext>
        {
        it('should_have_validation_warning_message()', () => {
        _warningMessageCollection[0].Message.ShouldContain("Item");
        _warningMessageCollection[0].Message.ShouldContain(propertyName);
        _warningMessageCollection[0].Message.ShouldContain(entityName);
        _warningMessageCollection[0].Message.ShouldContain("missing MetaEdId");
    });
let helper: ValidationTestHelper = new ValidationTestHelper();
before(() => {
    let metaEdText = MetaEdTextBuilder.buildIt

        .withBeginNamespace("edfi")
        .withStartInterchange(entityName)
        .withDocumentation("doc")
        .withElement(propertyName)
        .withEndInterchange()
        .withEndNamespace();
    helper.setup(metaEdText, validatorListener);
});
});


describe('When_interchangeExtension_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.InterchangeExtensionContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartInterchangeExtension(entityName)
            .withElement("DomainEntity")
            .withEndInterchangeExtension()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_interchangeIdentityTemplate_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBase<MetaEdGrammar.InterchangeIdentityTemplateContext>
        {
        it('should_have_validation_warning_message()', () => {
        _warningMessageCollection[0].Message.ShouldContain("Item");
        _warningMessageCollection[0].Message.ShouldContain(propertyName);
        _warningMessageCollection[0].Message.ShouldContain(entityName);
        _warningMessageCollection[0].Message.ShouldContain("missing MetaEdId");
    });
let helper: ValidationTestHelper = new ValidationTestHelper();
before(() => {
    let metaEdText = MetaEdTextBuilder.buildIt

        .withBeginNamespace("edfi")
        .withStartInterchange(entityName)
        .withDocumentation("doc")
        .withElement("DomainEntity")
        .withIdentityTemplate(propertyName)
        .withEndInterchange()
        .withEndNamespace();
    helper.setup(metaEdText, validatorListener);
});
});


describe('When_percentProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.PercentPropertyContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withPercentProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_referenceProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.ReferencePropertyContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withReferenceProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_secondDomainEntity_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.SecondDomainEntityContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartAssociation(entityName)
            .withDocumentation("doc")
            .withDomainEntityProperty("First", "doc1")
            .withDomainEntityProperty("Second", "doc2")
            .withEndAssociation()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_sharedDecimalProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.SharedDecimalPropertyContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withSharedDecimalProperty(propertyName, "SharedProperty", "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_sharedIntegerProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.SharedIntegerPropertyContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withSharedIntegerProperty(propertyName, "SharedProperty", "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_sharedShortProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.SharedShortPropertyContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withSharedShortProperty(propertyName, "SharedProperty", "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_sharedStringProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.SharedStringPropertyContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withSharedStringProperty(propertyName, "SharedProperty", "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_shortProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.ShortPropertyContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withShortProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_stringProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.StringPropertyContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withStringProperty(propertyName, "doc", true, false, 100)
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_subdomain_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.SubdomainContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartSubdomain(entityName, "ParentDomain")
            .withDocumentation("doc")
            .withDomainItem(propertyName)
            .withEndSubdomain()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_timeProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.TimePropertyContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withTimeProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});


describe('When_yearProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.YearPropertyContext>
        {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt

            .withBeginNamespace("edfi")
            .withStartDomainEntity(entityName)
            .withDocumentation("doc")
            .withYearProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
});
});