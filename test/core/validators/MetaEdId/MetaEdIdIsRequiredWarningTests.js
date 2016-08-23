var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var MetaEdId;
            (function (MetaEdId) {
                class MetaEdIdIsRequiredWarningTests {
                }
                MetaEdId.MetaEdIdIsRequiredWarningTests = MetaEdIdIsRequiredWarningTests;
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class MetaEdIdIsRequiredWarningTestBase extends Validator.ValidationRuleTestBase {
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new MetaEdIdIsRequiredWarning() });
                        }
                        should_not_have_validation_failure() {
                            _errorMessageCollection.ShouldBeEmpty();
                        }
                        should_have_validation_warning() {
                            _warningMessageCollection.ShouldNotBeEmpty();
                        }
                    }
                    MetaEdIdIsRequiredWarningTestBase._entityName = "MyIdentifier";
                    MetaEdIdIsRequiredWarningTestBase._propertyName = "Identifier";
                    MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBase = MetaEdIdIsRequiredWarningTestBase;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    class MetaEdIdIsRequiredWarningTestBaseForEntity extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBase {
                        should_have_validation_warning_message() {
                            _warningMessageCollection[0].Message.ShouldContain(MetaEdIdIsRequiredWarningTestBaseForEntity._entityName);
                            _warningMessageCollection[0].Message.ShouldContain("missing MetaEdId");
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity = MetaEdIdIsRequiredWarningTestBaseForEntity;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    class MetaEdIdIsRequiredWarningTestBaseForProperty extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBase {
                        should_have_validation_warning_message() {
                            _warningMessageCollection[0].Message.ShouldContain(MetaEdIdIsRequiredWarningTestBaseForProperty._propertyName);
                            _warningMessageCollection[0].Message.ShouldContain(MetaEdIdIsRequiredWarningTestBaseForProperty._entityName);
                            _warningMessageCollection[0].Message.ShouldContain("missing MetaEdId");
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForProperty = MetaEdIdIsRequiredWarningTestBaseForProperty;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_abstractEntity_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_abstractEntity_is_missing_metaEdId._entityName).WithDocumentation("doc1").WithStringIdentity("Property1", "doc2", 100).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_abstractEntity_is_missing_metaEdId = When_abstractEntity_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_association_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_is_missing_metaEdId._entityName).WithDocumentation("doc").WithDomainEntityProperty("First", "doc1").WithDomainEntityProperty("Second", "doc2").WithEndAssociation().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_association_is_missing_metaEdId = When_association_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_associationExtension_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociationExtension(When_associationExtension_is_missing_metaEdId._entityName).WithBooleanProperty("Property2", "because a property is required", true, false).WithEndAssociationExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_associationExtension_is_missing_metaEdId = When_associationExtension_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_associationSubclass_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociationSubclass(When_associationSubclass_is_missing_metaEdId._entityName, "BaseClass").WithDocumentation("doc").WithBooleanProperty("Property2", "doc", true, false).WithEndAssociationSubclass().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_associationSubclass_is_missing_metaEdId = When_associationSubclass_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_booleanProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForProperty {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_booleanProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithBooleanProperty(When_booleanProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_booleanProperty_is_missing_metaEdId = When_booleanProperty_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_choiceType_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartChoiceType(When_choiceType_is_missing_metaEdId._entityName).WithDocumentation("doc").WithBooleanProperty(When_choiceType_is_missing_metaEdId._propertyName, "doc", true, false).WithEndChoiceType().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_choiceType_is_missing_metaEdId = When_choiceType_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_commonDecimal_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonDecimal(When_commonDecimal_is_missing_metaEdId._entityName).WithDocumentation("doc").WithTotalDigits(10).WithDecimalPlaces(2).WithEndCommonDecimal().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_commonDecimal_is_missing_metaEdId = When_commonDecimal_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_commonInteger_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonInteger(When_commonInteger_is_missing_metaEdId._entityName).WithDocumentation("doc").WithEndCommonInteger().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_commonInteger_is_missing_metaEdId = When_commonInteger_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_commonShort_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonShort(When_commonShort_is_missing_metaEdId._entityName).WithDocumentation("doc").WithEndCommonShort().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_commonShort_is_missing_metaEdId = When_commonShort_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_commonString_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonString(When_commonString_is_missing_metaEdId._entityName).WithDocumentation("doc").WithMaxLength(100).WithEndCommonString().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_commonString_is_missing_metaEdId = When_commonString_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_commonType_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_commonType_is_missing_metaEdId._entityName).WithDocumentation("doc").WithBooleanProperty("Property1", "doc", true, false).WithEndCommonType().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_commonType_is_missing_metaEdId = When_commonType_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_commonTypeExtension_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonTypeExtension(When_commonTypeExtension_is_missing_metaEdId._entityName).WithBooleanProperty("Property2", "doc", true, false).WithEndCommonTypeExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_commonTypeExtension_is_missing_metaEdId = When_commonTypeExtension_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_currencyProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForProperty {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_currencyProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithCurrencyProperty(When_currencyProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_currencyProperty_is_missing_metaEdId = When_currencyProperty_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_dateProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForProperty {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_dateProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithDateProperty(When_dateProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_dateProperty_is_missing_metaEdId = When_dateProperty_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_decimalProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForProperty {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_decimalProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithDecimalProperty(When_decimalProperty_is_missing_metaEdId._propertyName, "doc", true, false, 10, 2).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_decimalProperty_is_missing_metaEdId = When_decimalProperty_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_descriptor_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDescriptor(When_descriptor_is_missing_metaEdId._entityName).WithDocumentation("doc").WithStartMapType().WithDocumentation("map type doc").WithEnumerationItem("this is short description 1", "doc1").WithEnumerationItem("this is short description 2", "doc2").WithEndMapType().WithEndDescriptor().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_descriptor_is_missing_metaEdId = When_descriptor_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_descriptorProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForProperty {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_descriptorProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithDescriptorProperty(When_descriptorProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_descriptorProperty_is_missing_metaEdId = When_descriptorProperty_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_domain_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomain(When_domain_is_missing_metaEdId._entityName).WithDocumentation("doc").WithDomainItem(When_domain_is_missing_metaEdId._propertyName).WithEndDomain().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_domain_is_missing_metaEdId = When_domain_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_domainEntity_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domainEntity_is_missing_metaEdId._entityName).WithDocumentation("doc").WithStringIdentity(When_domainEntity_is_missing_metaEdId._propertyName, "doc", 100).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_domainEntity_is_missing_metaEdId = When_domainEntity_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_domainEntityExtension_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntityExtension(When_domainEntityExtension_is_missing_metaEdId._entityName).WithBooleanProperty("Property2", "because a property is required", true, false).WithEndDomainEntityExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_domainEntityExtension_is_missing_metaEdId = When_domainEntityExtension_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_domainEntitySubclass_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntitySubclass(When_domainEntitySubclass_is_missing_metaEdId._entityName, "BaseClass").WithDocumentation("doc").WithBooleanProperty("Property2", "doc", true, false).WithEndDomainEntitySubclass().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_domainEntitySubclass_is_missing_metaEdId = When_domainEntitySubclass_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_domainItem_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomain(When_domainItem_is_missing_metaEdId._entityName).WithDocumentation("doc").WithDomainItem(When_domainItem_is_missing_metaEdId._propertyName).WithEndDomain().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_domainItem_is_missing_metaEdId = When_domainItem_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_durationProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForProperty {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_durationProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithDurationProperty(When_durationProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_durationProperty_is_missing_metaEdId = When_durationProperty_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_enumeration_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartEnumeration(When_enumeration_is_missing_metaEdId._entityName).WithDocumentation("doc").WithEnumerationItem(When_enumeration_is_missing_metaEdId._propertyName, "doc1").WithEndEnumeration().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_enumeration_is_missing_metaEdId = When_enumeration_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_enumerationItem_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBase {
                        should_have_validation_warning_message() {
                            _warningMessageCollection[0].Message.ShouldContain("Item");
                            _warningMessageCollection[0].Message.ShouldContain(When_enumerationItem_is_missing_metaEdId._propertyName);
                            _warningMessageCollection[0].Message.ShouldContain(When_enumerationItem_is_missing_metaEdId._entityName);
                            _warningMessageCollection[0].Message.ShouldContain("missing MetaEdId");
                        }
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartEnumeration(When_enumerationItem_is_missing_metaEdId._entityName).WithDocumentation("doc").WithEnumerationItem(When_enumerationItem_is_missing_metaEdId._propertyName, "doc1").WithEndEnumeration().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_enumerationItem_is_missing_metaEdId = When_enumerationItem_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_enumerationProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForProperty {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_enumerationProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithEnumerationProperty(When_enumerationProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_enumerationProperty_is_missing_metaEdId = When_enumerationProperty_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_firstDomainEntity_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_firstDomainEntity_is_missing_metaEdId._entityName).WithDocumentation("doc").WithDomainEntityProperty("First", "doc1").WithDomainEntityProperty("Second", "doc2").WithEndAssociation().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_firstDomainEntity_is_missing_metaEdId = When_firstDomainEntity_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_includeProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForProperty {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_includeProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithIncludeProperty(When_includeProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_includeProperty_is_missing_metaEdId = When_includeProperty_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_inlineCommonType_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInlineCommonType(When_inlineCommonType_is_missing_metaEdId._entityName).WithDocumentation("doc").WithBooleanProperty("Property1", "doc", true, false).WithEndInlineCommonType().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_inlineCommonType_is_missing_metaEdId = When_inlineCommonType_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_integerProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForProperty {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_integerProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithIntegerProperty(When_integerProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_integerProperty_is_missing_metaEdId = When_integerProperty_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_interchange_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInterchange(When_interchange_is_missing_metaEdId._entityName).WithDocumentation("doc").WithElement("DomainEntity").WithEndInterchange().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_interchange_is_missing_metaEdId = When_interchange_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_interchangeElement_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBase {
                        should_have_validation_warning_message() {
                            _warningMessageCollection[0].Message.ShouldContain("Item");
                            _warningMessageCollection[0].Message.ShouldContain(When_interchangeElement_is_missing_metaEdId._propertyName);
                            _warningMessageCollection[0].Message.ShouldContain(When_interchangeElement_is_missing_metaEdId._entityName);
                            _warningMessageCollection[0].Message.ShouldContain("missing MetaEdId");
                        }
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInterchange(When_interchangeElement_is_missing_metaEdId._entityName).WithDocumentation("doc").WithElement(When_interchangeElement_is_missing_metaEdId._propertyName).WithEndInterchange().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_interchangeElement_is_missing_metaEdId = When_interchangeElement_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_interchangeExtension_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInterchangeExtension(When_interchangeExtension_is_missing_metaEdId._entityName).WithElement("DomainEntity").WithEndInterchangeExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_interchangeExtension_is_missing_metaEdId = When_interchangeExtension_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_interchangeIdentityTemplate_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBase {
                        should_have_validation_warning_message() {
                            _warningMessageCollection[0].Message.ShouldContain("Item");
                            _warningMessageCollection[0].Message.ShouldContain(When_interchangeIdentityTemplate_is_missing_metaEdId._propertyName);
                            _warningMessageCollection[0].Message.ShouldContain(When_interchangeIdentityTemplate_is_missing_metaEdId._entityName);
                            _warningMessageCollection[0].Message.ShouldContain("missing MetaEdId");
                        }
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInterchange(When_interchangeIdentityTemplate_is_missing_metaEdId._entityName).WithDocumentation("doc").WithElement("DomainEntity").WithIdentityTemplate(When_interchangeIdentityTemplate_is_missing_metaEdId._propertyName).WithEndInterchange().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_interchangeIdentityTemplate_is_missing_metaEdId = When_interchangeIdentityTemplate_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_percentProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForProperty {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_percentProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithPercentProperty(When_percentProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_percentProperty_is_missing_metaEdId = When_percentProperty_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_referenceProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForProperty {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_referenceProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithReferenceProperty(When_referenceProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_referenceProperty_is_missing_metaEdId = When_referenceProperty_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_secondDomainEntity_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_secondDomainEntity_is_missing_metaEdId._entityName).WithDocumentation("doc").WithDomainEntityProperty("First", "doc1").WithDomainEntityProperty("Second", "doc2").WithEndAssociation().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_secondDomainEntity_is_missing_metaEdId = When_secondDomainEntity_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_sharedDecimalProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForProperty {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_sharedDecimalProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithSharedDecimalProperty(When_sharedDecimalProperty_is_missing_metaEdId._propertyName, "SharedProperty", "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_sharedDecimalProperty_is_missing_metaEdId = When_sharedDecimalProperty_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_sharedIntegerProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForProperty {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_sharedIntegerProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithSharedIntegerProperty(When_sharedIntegerProperty_is_missing_metaEdId._propertyName, "SharedProperty", "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_sharedIntegerProperty_is_missing_metaEdId = When_sharedIntegerProperty_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_sharedShortProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForProperty {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_sharedShortProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithSharedShortProperty(When_sharedShortProperty_is_missing_metaEdId._propertyName, "SharedProperty", "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_sharedShortProperty_is_missing_metaEdId = When_sharedShortProperty_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_sharedStringProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForProperty {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_sharedStringProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithSharedStringProperty(When_sharedStringProperty_is_missing_metaEdId._propertyName, "SharedProperty", "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_sharedStringProperty_is_missing_metaEdId = When_sharedStringProperty_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_shortProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForProperty {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_shortProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithShortProperty(When_shortProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_shortProperty_is_missing_metaEdId = When_shortProperty_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_stringProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForProperty {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_stringProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithStringProperty(When_stringProperty_is_missing_metaEdId._propertyName, "doc", true, false, 100).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_stringProperty_is_missing_metaEdId = When_stringProperty_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_subdomain_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForEntity {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartSubdomain(When_subdomain_is_missing_metaEdId._entityName, "ParentDomain").WithDocumentation("doc").WithDomainItem(When_subdomain_is_missing_metaEdId._propertyName).WithEndSubdomain().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_subdomain_is_missing_metaEdId = When_subdomain_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_timeProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForProperty {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_timeProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithTimeProperty(When_timeProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_timeProperty_is_missing_metaEdId = When_timeProperty_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
                (function (MetaEdIdIsRequiredWarningTests) {
                    /*[TestFixture]*/
                    class When_yearProperty_is_missing_metaEdId extends MetaEdIdIsRequiredWarningTests.MetaEdIdIsRequiredWarningTestBaseForProperty {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_yearProperty_is_missing_metaEdId._entityName).WithDocumentation("doc").WithYearProperty(When_yearProperty_is_missing_metaEdId._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                    }
                    MetaEdIdIsRequiredWarningTests.When_yearProperty_is_missing_metaEdId = When_yearProperty_is_missing_metaEdId;
                })(MetaEdIdIsRequiredWarningTests = MetaEdId.MetaEdIdIsRequiredWarningTests || (MetaEdId.MetaEdIdIsRequiredWarningTests = {}));
            })(MetaEdId = Validator.MetaEdId || (Validator.MetaEdId = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=MetaEdIdIsRequiredWarningTests.js.map