var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var DomainEntityExtension;
            (function (DomainEntityExtension) {
                class DomainEntityExtensionExistsOnlyInExtensionNamespaceTests {
                }
                DomainEntityExtension.DomainEntityExtensionExistsOnlyInExtensionNamespaceTests = DomainEntityExtensionExistsOnlyInExtensionNamespaceTests;
                (function (DomainEntityExtensionExistsOnlyInExtensionNamespaceTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_extension_exists_in_extension extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_extension_exists_in_extension._entity_name).WithDocumentation("because documentation is required").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndDomainEntity().WithEndNamespace();
                            metaEdTextBuilder.WithBeginNamespace("extension", "projectExtension").WithStartDomainEntityExtension(When_domain_entity_extension_exists_in_extension._entity_name).WithBooleanProperty("Property2", "because a property is required", true, false).WithEndDomainEntityExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DomainEntityExtensionExistsOnlyInExtensionNamespace() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_domain_entity_extension_exists_in_extension._entity_name = "MyIdentifier";
                    When_domain_entity_extension_exists_in_extension._property_name = "Property1";
                    DomainEntityExtensionExistsOnlyInExtensionNamespaceTests.When_domain_entity_extension_exists_in_extension = When_domain_entity_extension_exists_in_extension;
                })(DomainEntityExtensionExistsOnlyInExtensionNamespaceTests = DomainEntityExtension.DomainEntityExtensionExistsOnlyInExtensionNamespaceTests || (DomainEntityExtension.DomainEntityExtensionExistsOnlyInExtensionNamespaceTests = {}));
                (function (DomainEntityExtensionExistsOnlyInExtensionNamespaceTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_extension_exists_in_core extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace(When_domain_entity_extension_exists_in_core._coreNamespace).WithStartDomainEntity(When_domain_entity_extension_exists_in_core._entity_name).WithDocumentation("because documentation is required").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntityExtension(When_domain_entity_extension_exists_in_core._entity_name).WithBooleanProperty("Property2", "because a property is required", true, false).WithEndDomainEntityExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DomainEntityExtensionExistsOnlyInExtensionNamespace() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Domain Entity additions");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_extension_exists_in_core._entity_name);
                            _errorMessageCollection[0].Message.ShouldContain("is not valid in core namespace");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_extension_exists_in_core._coreNamespace);
                        }
                    }
                    When_domain_entity_extension_exists_in_core._coreNamespace = "edfi";
                    When_domain_entity_extension_exists_in_core._entity_name = "MyIdentifier";
                    When_domain_entity_extension_exists_in_core._property_name = "Property1";
                    DomainEntityExtensionExistsOnlyInExtensionNamespaceTests.When_domain_entity_extension_exists_in_core = When_domain_entity_extension_exists_in_core;
                })(DomainEntityExtensionExistsOnlyInExtensionNamespaceTests = DomainEntityExtension.DomainEntityExtensionExistsOnlyInExtensionNamespaceTests || (DomainEntityExtension.DomainEntityExtensionExistsOnlyInExtensionNamespaceTests = {}));
            })(DomainEntityExtension = Validator.DomainEntityExtension || (Validator.DomainEntityExtension = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntityExtensionExistsOnlyInExtensionNamespaceTests.js.map