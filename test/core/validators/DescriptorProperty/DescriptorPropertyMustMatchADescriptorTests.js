var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var DescriptorProperty;
            (function (DescriptorProperty) {
                class DescriptorPropertyMustMatchADescriptorTests {
                }
                DescriptorProperty.DescriptorPropertyMustMatchADescriptorTests = DescriptorPropertyMustMatchADescriptorTests;
                (function (DescriptorPropertyMustMatchADescriptorTests) {
                    /*[TestFixture]*/
                    class When_descriptor_property_has_valid_identifier extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDescriptor(When_descriptor_property_has_valid_identifier._entityName).WithDocumentation("doc").WithEndDescriptor();
                            metaEdTextBuilder.WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithDescriptorProperty(When_descriptor_property_has_valid_identifier._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DescriptorPropertyMustMatchADescriptor(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_descriptor_property_has_valid_identifier._entityName = "MyIdentifier";
                    DescriptorPropertyMustMatchADescriptorTests.When_descriptor_property_has_valid_identifier = When_descriptor_property_has_valid_identifier;
                })(DescriptorPropertyMustMatchADescriptorTests = DescriptorProperty.DescriptorPropertyMustMatchADescriptorTests || (DescriptorProperty.DescriptorPropertyMustMatchADescriptorTests = {}));
                (function (DescriptorPropertyMustMatchADescriptorTests) {
                    /*[TestFixture]*/
                    class When_descriptor_property_has_invalid_identifier extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithDescriptorProperty(When_descriptor_property_has_invalid_identifier._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DescriptorPropertyMustMatchADescriptor(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Descriptor");
                            _errorMessageCollection[0].Message.ShouldContain(When_descriptor_property_has_invalid_identifier._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("does not match");
                        }
                    }
                    When_descriptor_property_has_invalid_identifier._entityName = "MyIdentifier";
                    DescriptorPropertyMustMatchADescriptorTests.When_descriptor_property_has_invalid_identifier = When_descriptor_property_has_invalid_identifier;
                })(DescriptorPropertyMustMatchADescriptorTests = DescriptorProperty.DescriptorPropertyMustMatchADescriptorTests || (DescriptorProperty.DescriptorPropertyMustMatchADescriptorTests = {}));
            })(DescriptorProperty = Validator.DescriptorProperty || (Validator.DescriptorProperty = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DescriptorPropertyMustMatchADescriptorTests.js.map