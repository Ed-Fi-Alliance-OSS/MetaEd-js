var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var IncludeProperty;
            (function (IncludeProperty) {
                class IncludePropertyMustNotContainIdentityTests {
                }
                IncludeProperty.IncludePropertyMustNotContainIdentityTests = IncludePropertyMustNotContainIdentityTests;
                (function (IncludePropertyMustNotContainIdentityTests) {
                    /*[TestFixture]*/
                    class When_include_property_has_primary_key extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_include_property_has_primary_key._commonTypeName).WithDocumentation("doc").WithStringProperty("StringProperty", "doc", true, false, 100).WithEndCommonType();
                            metaEdTextBuilder.WithStartDomainEntity(When_include_property_has_primary_key._entityName).WithDocumentation("doc").WithIdentityProperty("include", When_include_property_has_primary_key._propertyName, "doc").WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IncludePropertyMustNotContainIdentity() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Include");
                            _errorMessageCollection[0].Message.ShouldContain(When_include_property_has_primary_key._propertyName);
                            _errorMessageCollection[0].Message.ShouldContain("invalid");
                        }
                    }
                    When_include_property_has_primary_key._commonTypeName = "CommonType";
                    When_include_property_has_primary_key._entityName = "MyIdentifier";
                    When_include_property_has_primary_key._propertyName = "Identifier";
                    IncludePropertyMustNotContainIdentityTests.When_include_property_has_primary_key = When_include_property_has_primary_key;
                })(IncludePropertyMustNotContainIdentityTests = IncludeProperty.IncludePropertyMustNotContainIdentityTests || (IncludeProperty.IncludePropertyMustNotContainIdentityTests = {}));
            })(IncludeProperty = Validator.IncludeProperty || (Validator.IncludeProperty = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=IncludePropertyMustNotContainIdentityTests.js.map