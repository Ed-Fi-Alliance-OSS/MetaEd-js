var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var EnumerationProperty;
            (function (EnumerationProperty) {
                class EnumerationPropertyMustMatchAnEnumerationTests {
                }
                EnumerationProperty.EnumerationPropertyMustMatchAnEnumerationTests = EnumerationPropertyMustMatchAnEnumerationTests;
                (function (EnumerationPropertyMustMatchAnEnumerationTests) {
                    /*[TestFixture]*/
                    class When_enumeration_property_has_valid_identifier extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartEnumeration(When_enumeration_property_has_valid_identifier._entityName).WithDocumentation("doc").WithEnumerationItem("required", "doc").WithEndEnumeration();
                            metaEdTextBuilder.WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEnumerationProperty(When_enumeration_property_has_valid_identifier._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new EnumerationPropertyMustMatchAnEnumeration(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_enumeration_property_has_valid_identifier._entityName = "MyIdentifier";
                    EnumerationPropertyMustMatchAnEnumerationTests.When_enumeration_property_has_valid_identifier = When_enumeration_property_has_valid_identifier;
                })(EnumerationPropertyMustMatchAnEnumerationTests = EnumerationProperty.EnumerationPropertyMustMatchAnEnumerationTests || (EnumerationProperty.EnumerationPropertyMustMatchAnEnumerationTests = {}));
                (function (EnumerationPropertyMustMatchAnEnumerationTests) {
                    /*[TestFixture]*/
                    class When_enumeration_property_has_invalid_identifier extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEnumerationProperty(When_enumeration_property_has_invalid_identifier._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new EnumerationPropertyMustMatchAnEnumeration(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Enumeration");
                            _errorMessageCollection[0].Message.ShouldContain(When_enumeration_property_has_invalid_identifier._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("does not match");
                        }
                    }
                    When_enumeration_property_has_invalid_identifier._entityName = "MyIdentifier";
                    EnumerationPropertyMustMatchAnEnumerationTests.When_enumeration_property_has_invalid_identifier = When_enumeration_property_has_invalid_identifier;
                })(EnumerationPropertyMustMatchAnEnumerationTests = EnumerationProperty.EnumerationPropertyMustMatchAnEnumerationTests || (EnumerationProperty.EnumerationPropertyMustMatchAnEnumerationTests = {}));
            })(EnumerationProperty = Validator.EnumerationProperty || (Validator.EnumerationProperty = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=EnumerationPropertyMustMatchAnEnumerationTests.js.map