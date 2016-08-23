var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var IntegerProperty;
            (function (IntegerProperty) {
                class IntegerPropertyMustNotMatchACommonSimpleTypeTests {
                }
                IntegerProperty.IntegerPropertyMustNotMatchACommonSimpleTypeTests = IntegerPropertyMustNotMatchACommonSimpleTypeTests;
                (function (IntegerPropertyMustNotMatchACommonSimpleTypeTests) {
                    /*[TestFixture]*/
                    class When_integer_property_has_identifier_matching_no_common_simple_types extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_integer_property_has_identifier_matching_no_common_simple_types._entityName).WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithIntegerProperty(When_integer_property_has_identifier_matching_no_common_simple_types._propertyName, "doc", false, false, 10, 2).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IntegerPropertyMustNotMatchACommonSimpleType(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_integer_property_has_identifier_matching_no_common_simple_types._entityName = "EntityName";
                    When_integer_property_has_identifier_matching_no_common_simple_types._propertyName = "PropertyName";
                    IntegerPropertyMustNotMatchACommonSimpleTypeTests.When_integer_property_has_identifier_matching_no_common_simple_types = When_integer_property_has_identifier_matching_no_common_simple_types;
                })(IntegerPropertyMustNotMatchACommonSimpleTypeTests = IntegerProperty.IntegerPropertyMustNotMatchACommonSimpleTypeTests || (IntegerProperty.IntegerPropertyMustNotMatchACommonSimpleTypeTests = {}));
                (function (IntegerPropertyMustNotMatchACommonSimpleTypeTests) {
                    /*[TestFixture]*/
                    class When_integer_property_has_identifier_matching_common_decimal extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonDecimal(When_integer_property_has_identifier_matching_common_decimal._commonEntityName).WithDocumentation("doc").WithTotalDigits(10).WithDecimalPlaces(2).WithEndCommonDecimal();
                            metaEdTextBuilder.WithStartDomainEntity("EntityName").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithIntegerProperty(When_integer_property_has_identifier_matching_common_decimal._commonEntityName, "doc", false, false, 10, 2).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IntegerPropertyMustNotMatchACommonSimpleType(_symbolTable) });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Integer property");
                            _errorMessageCollection[0].Message.ShouldContain(When_integer_property_has_identifier_matching_common_decimal._commonEntityName);
                            _errorMessageCollection[0].Message.ShouldContain("has the same name");
                        }
                    }
                    When_integer_property_has_identifier_matching_common_decimal._commonEntityName = "CommonEntityName";
                    IntegerPropertyMustNotMatchACommonSimpleTypeTests.When_integer_property_has_identifier_matching_common_decimal = When_integer_property_has_identifier_matching_common_decimal;
                })(IntegerPropertyMustNotMatchACommonSimpleTypeTests = IntegerProperty.IntegerPropertyMustNotMatchACommonSimpleTypeTests || (IntegerProperty.IntegerPropertyMustNotMatchACommonSimpleTypeTests = {}));
                (function (IntegerPropertyMustNotMatchACommonSimpleTypeTests) {
                    class When_integer_property_has_identifier_matching_common_integer extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonInteger(When_integer_property_has_identifier_matching_common_integer._commonEntityName).WithDocumentation("doc").WithMaxValue(100).WithEndCommonInteger();
                            metaEdTextBuilder.WithStartDomainEntity("EntityName").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithIntegerProperty(When_integer_property_has_identifier_matching_common_integer._commonEntityName, "doc", false, false, 10, 2).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IntegerPropertyMustNotMatchACommonSimpleType(_symbolTable) });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Integer property");
                            _errorMessageCollection[0].Message.ShouldContain(When_integer_property_has_identifier_matching_common_integer._commonEntityName);
                            _errorMessageCollection[0].Message.ShouldContain("has the same name");
                        }
                    }
                    When_integer_property_has_identifier_matching_common_integer._commonEntityName = "CommonEntityName";
                    IntegerPropertyMustNotMatchACommonSimpleTypeTests.When_integer_property_has_identifier_matching_common_integer = When_integer_property_has_identifier_matching_common_integer;
                })(IntegerPropertyMustNotMatchACommonSimpleTypeTests = IntegerProperty.IntegerPropertyMustNotMatchACommonSimpleTypeTests || (IntegerProperty.IntegerPropertyMustNotMatchACommonSimpleTypeTests = {}));
                (function (IntegerPropertyMustNotMatchACommonSimpleTypeTests) {
                    class When_integer_property_has_identifier_matching_common_short extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonShort(When_integer_property_has_identifier_matching_common_short._commonEntityName).WithDocumentation("doc").WithMaxValue(100).WithEndCommonShort();
                            metaEdTextBuilder.WithStartDomainEntity("EntityName").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithIntegerProperty(When_integer_property_has_identifier_matching_common_short._commonEntityName, "doc", false, false, 10, 2).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IntegerPropertyMustNotMatchACommonSimpleType(_symbolTable) });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Integer property");
                            _errorMessageCollection[0].Message.ShouldContain(When_integer_property_has_identifier_matching_common_short._commonEntityName);
                            _errorMessageCollection[0].Message.ShouldContain("has the same name");
                        }
                    }
                    When_integer_property_has_identifier_matching_common_short._commonEntityName = "CommonEntityName";
                    IntegerPropertyMustNotMatchACommonSimpleTypeTests.When_integer_property_has_identifier_matching_common_short = When_integer_property_has_identifier_matching_common_short;
                })(IntegerPropertyMustNotMatchACommonSimpleTypeTests = IntegerProperty.IntegerPropertyMustNotMatchACommonSimpleTypeTests || (IntegerProperty.IntegerPropertyMustNotMatchACommonSimpleTypeTests = {}));
                (function (IntegerPropertyMustNotMatchACommonSimpleTypeTests) {
                    class When_integer_property_has_identifier_matching_common_string extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonString(When_integer_property_has_identifier_matching_common_string._commonEntityName).WithDocumentation("doc").WithMaxLength(100).WithEndCommonString();
                            metaEdTextBuilder.WithStartDomainEntity("EntityName").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithIntegerProperty(When_integer_property_has_identifier_matching_common_string._commonEntityName, "doc", false, false, 10, 2).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IntegerPropertyMustNotMatchACommonSimpleType(_symbolTable) });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Integer property");
                            _errorMessageCollection[0].Message.ShouldContain(When_integer_property_has_identifier_matching_common_string._commonEntityName);
                            _errorMessageCollection[0].Message.ShouldContain("has the same name");
                        }
                    }
                    When_integer_property_has_identifier_matching_common_string._commonEntityName = "CommonEntityName";
                    IntegerPropertyMustNotMatchACommonSimpleTypeTests.When_integer_property_has_identifier_matching_common_string = When_integer_property_has_identifier_matching_common_string;
                })(IntegerPropertyMustNotMatchACommonSimpleTypeTests = IntegerProperty.IntegerPropertyMustNotMatchACommonSimpleTypeTests || (IntegerProperty.IntegerPropertyMustNotMatchACommonSimpleTypeTests = {}));
            })(IntegerProperty = Validator.IntegerProperty || (Validator.IntegerProperty = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=IntegerPropertyMustNotMatchACommonSimpleTypeTests.js.map