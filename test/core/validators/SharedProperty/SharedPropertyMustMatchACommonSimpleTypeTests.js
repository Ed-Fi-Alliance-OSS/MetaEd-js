var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var SharedProperty;
            (function (SharedProperty) {
                class SharedPropertyMustMatchACommonSimpleTypeTests {
                }
                SharedProperty.SharedPropertyMustMatchACommonSimpleTypeTests = SharedPropertyMustMatchACommonSimpleTypeTests;
                (function (SharedPropertyMustMatchACommonSimpleTypeTests) {
                    /*[TestFixture]*/
                    class When_shared_property_has_identifier_of_common_simple_decimal extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonDecimal(When_shared_property_has_identifier_of_common_simple_decimal._entityName).WithDocumentation("doc").WithTotalDigits("10").WithDecimalPlaces("2").WithEndCommonDecimal();
                            metaEdTextBuilder.WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithSharedDecimalProperty(When_shared_property_has_identifier_of_common_simple_decimal._entityName, When_shared_property_has_identifier_of_common_simple_decimal._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_shared_property_has_identifier_of_common_simple_decimal._entityName = "EntityName";
                    When_shared_property_has_identifier_of_common_simple_decimal._propertyName = "PropertyName";
                    SharedPropertyMustMatchACommonSimpleTypeTests.When_shared_property_has_identifier_of_common_simple_decimal = When_shared_property_has_identifier_of_common_simple_decimal;
                })(SharedPropertyMustMatchACommonSimpleTypeTests = SharedProperty.SharedPropertyMustMatchACommonSimpleTypeTests || (SharedProperty.SharedPropertyMustMatchACommonSimpleTypeTests = {}));
                (function (SharedPropertyMustMatchACommonSimpleTypeTests) {
                    /*[TestFixture]*/
                    class When_shared_property_has_identifier_of_common_simple_integer extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonInteger(When_shared_property_has_identifier_of_common_simple_integer._entityName).WithDocumentation("doc").WithMinValue("0").WithMaxValue("1000").WithEndCommonInteger();
                            metaEdTextBuilder.WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithSharedDecimalProperty(When_shared_property_has_identifier_of_common_simple_integer._entityName, When_shared_property_has_identifier_of_common_simple_integer._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new SharedIntegerPropertyTypeMustMatchACommonSimpleInteger(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_shared_property_has_identifier_of_common_simple_integer._entityName = "EntityName";
                    When_shared_property_has_identifier_of_common_simple_integer._propertyName = "PropertyName";
                    SharedPropertyMustMatchACommonSimpleTypeTests.When_shared_property_has_identifier_of_common_simple_integer = When_shared_property_has_identifier_of_common_simple_integer;
                })(SharedPropertyMustMatchACommonSimpleTypeTests = SharedProperty.SharedPropertyMustMatchACommonSimpleTypeTests || (SharedProperty.SharedPropertyMustMatchACommonSimpleTypeTests = {}));
                (function (SharedPropertyMustMatchACommonSimpleTypeTests) {
                    /*[TestFixture]*/
                    class When_shared_property_has_identifier_of_common_simple_short extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonShort(When_shared_property_has_identifier_of_common_simple_short._entityName).WithDocumentation("doc").WithMinValue("0").WithMaxValue("1000").WithEndCommonShort();
                            metaEdTextBuilder.WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithSharedDecimalProperty(When_shared_property_has_identifier_of_common_simple_short._entityName, When_shared_property_has_identifier_of_common_simple_short._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new SharedShortPropertyTypeMustMatchACommonSimpleShort(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_shared_property_has_identifier_of_common_simple_short._entityName = "EntityName";
                    When_shared_property_has_identifier_of_common_simple_short._propertyName = "PropertyName";
                    SharedPropertyMustMatchACommonSimpleTypeTests.When_shared_property_has_identifier_of_common_simple_short = When_shared_property_has_identifier_of_common_simple_short;
                })(SharedPropertyMustMatchACommonSimpleTypeTests = SharedProperty.SharedPropertyMustMatchACommonSimpleTypeTests || (SharedProperty.SharedPropertyMustMatchACommonSimpleTypeTests = {}));
                (function (SharedPropertyMustMatchACommonSimpleTypeTests) {
                    /*[TestFixture]*/
                    class When_shared_property_has_identifier_of_common_simple_string extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonString(When_shared_property_has_identifier_of_common_simple_string._entityName).WithDocumentation("doc").WithMaxLength("100").WithEndCommonString();
                            metaEdTextBuilder.WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithSharedDecimalProperty(When_shared_property_has_identifier_of_common_simple_string._entityName, When_shared_property_has_identifier_of_common_simple_string._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new SharedStringPropertyTypeMustMatchACommonSimpleString(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_shared_property_has_identifier_of_common_simple_string._entityName = "EntityName";
                    When_shared_property_has_identifier_of_common_simple_string._propertyName = "PropertyName";
                    SharedPropertyMustMatchACommonSimpleTypeTests.When_shared_property_has_identifier_of_common_simple_string = When_shared_property_has_identifier_of_common_simple_string;
                })(SharedPropertyMustMatchACommonSimpleTypeTests = SharedProperty.SharedPropertyMustMatchACommonSimpleTypeTests || (SharedProperty.SharedPropertyMustMatchACommonSimpleTypeTests = {}));
                (function (SharedPropertyMustMatchACommonSimpleTypeTests) {
                    /*[TestFixture]*/
                    class When_shared_decimal_property_has_invalid_identifier extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithSharedDecimalProperty(When_shared_decimal_property_has_invalid_identifier._entityName, When_shared_decimal_property_has_invalid_identifier._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Shared property");
                            _errorMessageCollection[0].Message.ShouldContain(When_shared_decimal_property_has_invalid_identifier._propertyName);
                            _errorMessageCollection[0].Message.ShouldContain("does not match");
                        }
                    }
                    When_shared_decimal_property_has_invalid_identifier._entityName = "DoesNotExist";
                    When_shared_decimal_property_has_invalid_identifier._propertyName = "PropertyName";
                    SharedPropertyMustMatchACommonSimpleTypeTests.When_shared_decimal_property_has_invalid_identifier = When_shared_decimal_property_has_invalid_identifier;
                })(SharedPropertyMustMatchACommonSimpleTypeTests = SharedProperty.SharedPropertyMustMatchACommonSimpleTypeTests || (SharedProperty.SharedPropertyMustMatchACommonSimpleTypeTests = {}));
                (function (SharedPropertyMustMatchACommonSimpleTypeTests) {
                    /*[TestFixture]*/
                    class When_shared_integer_property_has_invalid_identifier extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithSharedIntegerProperty(When_shared_integer_property_has_invalid_identifier._entityName, When_shared_integer_property_has_invalid_identifier._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new SharedIntegerPropertyTypeMustMatchACommonSimpleInteger(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Shared property");
                            _errorMessageCollection[0].Message.ShouldContain(When_shared_integer_property_has_invalid_identifier._propertyName);
                            _errorMessageCollection[0].Message.ShouldContain("does not match");
                        }
                    }
                    When_shared_integer_property_has_invalid_identifier._entityName = "DoesNotExist";
                    When_shared_integer_property_has_invalid_identifier._propertyName = "PropertyName";
                    SharedPropertyMustMatchACommonSimpleTypeTests.When_shared_integer_property_has_invalid_identifier = When_shared_integer_property_has_invalid_identifier;
                })(SharedPropertyMustMatchACommonSimpleTypeTests = SharedProperty.SharedPropertyMustMatchACommonSimpleTypeTests || (SharedProperty.SharedPropertyMustMatchACommonSimpleTypeTests = {}));
                (function (SharedPropertyMustMatchACommonSimpleTypeTests) {
                    /*[TestFixture]*/
                    class When_shared_short_property_has_invalid_identifier extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithSharedShortProperty(When_shared_short_property_has_invalid_identifier._entityName, When_shared_short_property_has_invalid_identifier._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new SharedShortPropertyTypeMustMatchACommonSimpleShort(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Shared property");
                            _errorMessageCollection[0].Message.ShouldContain(When_shared_short_property_has_invalid_identifier._propertyName);
                            _errorMessageCollection[0].Message.ShouldContain("does not match");
                        }
                    }
                    When_shared_short_property_has_invalid_identifier._entityName = "DoesNotExist";
                    When_shared_short_property_has_invalid_identifier._propertyName = "PropertyName";
                    SharedPropertyMustMatchACommonSimpleTypeTests.When_shared_short_property_has_invalid_identifier = When_shared_short_property_has_invalid_identifier;
                })(SharedPropertyMustMatchACommonSimpleTypeTests = SharedProperty.SharedPropertyMustMatchACommonSimpleTypeTests || (SharedProperty.SharedPropertyMustMatchACommonSimpleTypeTests = {}));
                (function (SharedPropertyMustMatchACommonSimpleTypeTests) {
                    /*[TestFixture]*/
                    class When_shared_string_property_has_invalid_identifier extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithSharedStringProperty(When_shared_string_property_has_invalid_identifier._entityName, When_shared_string_property_has_invalid_identifier._propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new SharedStringPropertyTypeMustMatchACommonSimpleString(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Shared property");
                            _errorMessageCollection[0].Message.ShouldContain(When_shared_string_property_has_invalid_identifier._propertyName);
                            _errorMessageCollection[0].Message.ShouldContain("does not match");
                        }
                    }
                    When_shared_string_property_has_invalid_identifier._entityName = "DoesNotExist";
                    When_shared_string_property_has_invalid_identifier._propertyName = "PropertyName";
                    SharedPropertyMustMatchACommonSimpleTypeTests.When_shared_string_property_has_invalid_identifier = When_shared_string_property_has_invalid_identifier;
                })(SharedPropertyMustMatchACommonSimpleTypeTests = SharedProperty.SharedPropertyMustMatchACommonSimpleTypeTests || (SharedProperty.SharedPropertyMustMatchACommonSimpleTypeTests = {}));
            })(SharedProperty = Validator.SharedProperty || (Validator.SharedProperty = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=SharedPropertyMustMatchACommonSimpleTypeTests.js.map