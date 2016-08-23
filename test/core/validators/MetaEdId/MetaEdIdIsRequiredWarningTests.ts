module MetaEd.Tests.Validator.MetaEdId {
    export class MetaEdIdIsRequiredWarningTests {

    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class MetaEdIdIsRequiredWarningTestBase<TTestContext extends ParserRuleContext> extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<TTestContext>(), { SuppliedRule: <IValidationRule<TTestContext>>new MetaEdIdIsRequiredWarning() });
            }
            public should_not_have_validation_failure(): void {
                _errorMessageCollection.ShouldBeEmpty();
            }
            public should_have_validation_warning(): void {
                _warningMessageCollection.ShouldNotBeEmpty();
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        export class MetaEdIdIsRequiredWarningTestBaseForEntity<TTestContext extends ParserRuleContext> extends MetaEdIdIsRequiredWarningTestBase<TTestContext>
        {
            public should_have_validation_warning_message(): void {
                _warningMessageCollection[0].Message.ShouldContain(MetaEdIdIsRequiredWarningTestBaseForEntity._entityName);
                _warningMessageCollection[0].Message.ShouldContain("missing MetaEdId");
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        export class MetaEdIdIsRequiredWarningTestBaseForProperty<TTestContext extends ParserRuleContext> extends MetaEdIdIsRequiredWarningTestBase<TTestContext>
        {
            public should_have_validation_warning_message(): void {
                _warningMessageCollection[0].Message.ShouldContain(MetaEdIdIsRequiredWarningTestBaseForProperty._propertyName);
                _warningMessageCollection[0].Message.ShouldContain(MetaEdIdIsRequiredWarningTestBaseForProperty._entityName);
                _warningMessageCollection[0].Message.ShouldContain("missing MetaEdId");
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_abstractEntity_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.AbstractEntityContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_abstractEntity_is_missing_metaEdId._entityName).WithDocumentation("doc1").WithStringIdentity("Property1", "doc2", 100).WithEndAbstractEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_association_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.AssociationContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_is_missing_metaEdId._entityName).WithDocumentation("doc").WithDomainEntityProperty("First", "doc1").WithDomainEntityProperty("Second", "doc2").WithEndAssociation().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_associationExtension_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.AssociationExtensionContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociationExtension(When_associationExtension_is_missing_metaEdId._entityName).WithBooleanProperty("Property2", "because a property is required", true, false).WithEndAssociationExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_associationSubclass_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.AssociationSubclassContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociationSubclass(When_associationSubclass_is_missing_metaEdId._entityName, "BaseClass").WithDocumentation("doc").WithBooleanProperty("Property2", "doc", true, false).WithEndAssociationSubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_booleanProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.BooleanPropertyContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_booleanProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithBooleanProperty(When_booleanProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_choiceType_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.ChoiceTypeContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartChoiceType(When_choiceType_is_missing_metaEdId._entityName).WithDocumentation("doc").WithBooleanProperty(When_choiceType_is_missing_metaEdId._propertyName, "doc", true, false).WithEndChoiceType().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_commonDecimal_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.CommonDecimalContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonDecimal(When_commonDecimal_is_missing_metaEdId._entityName).WithDocumentation("doc").WithTotalDigits(10).WithDecimalPlaces(2).WithEndCommonDecimal().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_commonInteger_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.CommonIntegerContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonInteger(When_commonInteger_is_missing_metaEdId._entityName).WithDocumentation("doc").WithEndCommonInteger().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_commonShort_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.CommonShortContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonShort(When_commonShort_is_missing_metaEdId._entityName).WithDocumentation("doc").WithEndCommonShort().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_commonString_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.CommonStringContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonString(When_commonString_is_missing_metaEdId._entityName).WithDocumentation("doc").WithMaxLength(100).WithEndCommonString().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_commonType_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.CommonTypeContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_commonType_is_missing_metaEdId._entityName).WithDocumentation("doc").WithBooleanProperty("Property1", "doc", true, false).WithEndCommonType().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_commonTypeExtension_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.CommonTypeExtensionContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonTypeExtension(When_commonTypeExtension_is_missing_metaEdId._entityName).WithBooleanProperty("Property2", "doc", true, false).WithEndCommonTypeExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_currencyProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.CurrencyPropertyContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_currencyProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithCurrencyProperty(When_currencyProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_dateProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.DatePropertyContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_dateProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithDateProperty(When_dateProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_decimalProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.DecimalPropertyContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_decimalProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithDecimalProperty(When_decimalProperty_is_missing_metaEdId._propertyName, "doc", true, false, 10, 2).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_descriptor_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.DescriptorContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDescriptor(When_descriptor_is_missing_metaEdId._entityName).WithDocumentation("doc").WithStartMapType().WithDocumentation("map type doc").WithEnumerationItem("this is short description 1", "doc1").WithEnumerationItem("this is short description 2", "doc2").WithEndMapType().WithEndDescriptor().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_descriptorProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.DescriptorPropertyContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_descriptorProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithDescriptorProperty(When_descriptorProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_domain_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.DomainContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomain(When_domain_is_missing_metaEdId._entityName).WithDocumentation("doc").WithDomainItem(When_domain_is_missing_metaEdId._propertyName).WithEndDomain().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_domainEntity_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.DomainEntityContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domainEntity_is_missing_metaEdId._entityName).WithDocumentation("doc").WithStringIdentity(When_domainEntity_is_missing_metaEdId._propertyName, "doc", 100).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_domainEntityExtension_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.DomainEntityExtensionContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntityExtension(When_domainEntityExtension_is_missing_metaEdId._entityName).WithBooleanProperty("Property2", "because a property is required", true, false).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_domainEntitySubclass_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.DomainEntitySubclassContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntitySubclass(When_domainEntitySubclass_is_missing_metaEdId._entityName, "BaseClass").WithDocumentation("doc").WithBooleanProperty("Property2", "doc", true, false).WithEndDomainEntitySubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_domainItem_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.DomainItemContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomain(When_domainItem_is_missing_metaEdId._entityName).WithDocumentation("doc").WithDomainItem(When_domainItem_is_missing_metaEdId._propertyName).WithEndDomain().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_durationProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.DurationPropertyContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_durationProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithDurationProperty(When_durationProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_enumeration_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.EnumerationContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartEnumeration(When_enumeration_is_missing_metaEdId._entityName).WithDocumentation("doc").WithEnumerationItem(When_enumeration_is_missing_metaEdId._propertyName, "doc1").WithEndEnumeration().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_enumerationItem_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBase<MetaEdGrammar.EnumerationItemContext>
        {
            public should_have_validation_warning_message(): void {
                _warningMessageCollection[0].Message.ShouldContain("Item");
                _warningMessageCollection[0].Message.ShouldContain(When_enumerationItem_is_missing_metaEdId._propertyName);
                _warningMessageCollection[0].Message.ShouldContain(When_enumerationItem_is_missing_metaEdId._entityName);
                _warningMessageCollection[0].Message.ShouldContain("missing MetaEdId");
            }
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartEnumeration(When_enumerationItem_is_missing_metaEdId._entityName).WithDocumentation("doc").WithEnumerationItem(When_enumerationItem_is_missing_metaEdId._propertyName, "doc1").WithEndEnumeration().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_enumerationProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.EnumerationPropertyContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_enumerationProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithEnumerationProperty(When_enumerationProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_firstDomainEntity_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.FirstDomainEntityContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_firstDomainEntity_is_missing_metaEdId._entityName).WithDocumentation("doc").WithDomainEntityProperty("First", "doc1").WithDomainEntityProperty("Second", "doc2").WithEndAssociation().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_includeProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.IncludePropertyContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_includeProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithIncludeProperty(When_includeProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_inlineCommonType_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.InlineCommonTypeContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInlineCommonType(When_inlineCommonType_is_missing_metaEdId._entityName).WithDocumentation("doc").WithBooleanProperty("Property1", "doc", true, false).WithEndInlineCommonType().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_integerProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.IntegerPropertyContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_integerProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithIntegerProperty(When_integerProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_interchange_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.InterchangeContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInterchange(When_interchange_is_missing_metaEdId._entityName).WithDocumentation("doc").WithElement("DomainEntity").WithEndInterchange().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_interchangeElement_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBase<MetaEdGrammar.InterchangeElementContext>
        {
            public should_have_validation_warning_message(): void {
                _warningMessageCollection[0].Message.ShouldContain("Item");
                _warningMessageCollection[0].Message.ShouldContain(When_interchangeElement_is_missing_metaEdId._propertyName);
                _warningMessageCollection[0].Message.ShouldContain(When_interchangeElement_is_missing_metaEdId._entityName);
                _warningMessageCollection[0].Message.ShouldContain("missing MetaEdId");
            }
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInterchange(When_interchangeElement_is_missing_metaEdId._entityName).WithDocumentation("doc").WithElement(When_interchangeElement_is_missing_metaEdId._propertyName).WithEndInterchange().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_interchangeExtension_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.InterchangeExtensionContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInterchangeExtension(When_interchangeExtension_is_missing_metaEdId._entityName).WithElement("DomainEntity").WithEndInterchangeExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_interchangeIdentityTemplate_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBase<MetaEdGrammar.InterchangeIdentityTemplateContext>
        {
            public should_have_validation_warning_message(): void {
                _warningMessageCollection[0].Message.ShouldContain("Item");
                _warningMessageCollection[0].Message.ShouldContain(When_interchangeIdentityTemplate_is_missing_metaEdId._propertyName);
                _warningMessageCollection[0].Message.ShouldContain(When_interchangeIdentityTemplate_is_missing_metaEdId._entityName);
                _warningMessageCollection[0].Message.ShouldContain("missing MetaEdId");
            }
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInterchange(When_interchangeIdentityTemplate_is_missing_metaEdId._entityName).WithDocumentation("doc").WithElement("DomainEntity").WithIdentityTemplate(When_interchangeIdentityTemplate_is_missing_metaEdId._propertyName).WithEndInterchange().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_percentProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.PercentPropertyContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_percentProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithPercentProperty(When_percentProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_referenceProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.ReferencePropertyContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_referenceProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithReferenceProperty(When_referenceProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_secondDomainEntity_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.SecondDomainEntityContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_secondDomainEntity_is_missing_metaEdId._entityName).WithDocumentation("doc").WithDomainEntityProperty("First", "doc1").WithDomainEntityProperty("Second", "doc2").WithEndAssociation().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_sharedDecimalProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.SharedDecimalPropertyContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_sharedDecimalProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithSharedDecimalProperty(When_sharedDecimalProperty_is_missing_metaEdId._propertyName, "SharedProperty", "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_sharedIntegerProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.SharedIntegerPropertyContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_sharedIntegerProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithSharedIntegerProperty(When_sharedIntegerProperty_is_missing_metaEdId._propertyName, "SharedProperty", "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_sharedShortProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.SharedShortPropertyContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_sharedShortProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithSharedShortProperty(When_sharedShortProperty_is_missing_metaEdId._propertyName, "SharedProperty", "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_sharedStringProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.SharedStringPropertyContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_sharedStringProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithSharedStringProperty(When_sharedStringProperty_is_missing_metaEdId._propertyName, "SharedProperty", "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_shortProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.ShortPropertyContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_shortProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithShortProperty(When_shortProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_stringProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.StringPropertyContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_stringProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithStringProperty(When_stringProperty_is_missing_metaEdId._propertyName, "doc", true, false, 100).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_subdomain_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForEntity<MetaEdGrammar.SubdomainContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartSubdomain(When_subdomain_is_missing_metaEdId._entityName, "ParentDomain").WithDocumentation("doc").WithDomainItem(When_subdomain_is_missing_metaEdId._propertyName).WithEndSubdomain().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_timeProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.TimePropertyContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_timeProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithTimeProperty(When_timeProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
    export module MetaEdIdIsRequiredWarningTests {
        /*[TestFixture]*/
        export class When_yearProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTestBaseForProperty<MetaEdGrammar.YearPropertyContext>
        {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_yearProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithYearProperty(When_yearProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
        }
    }
}