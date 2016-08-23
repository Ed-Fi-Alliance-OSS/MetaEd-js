var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var AssociationExtension;
            (function (AssociationExtension) {
                class AssociationExtensionExistsOnlyInExtensionNamespaceTests {
                }
                AssociationExtension.AssociationExtensionExistsOnlyInExtensionNamespaceTests = AssociationExtensionExistsOnlyInExtensionNamespaceTests;
                (function (AssociationExtensionExistsOnlyInExtensionNamespaceTests) {
                    /*[TestFixture]*/
                    class When_association_extension_exists_in_extension extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_extension_exists_in_extension._entity_name).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndAssociation().WithEndNamespace();
                            metaEdTextBuilder.WithBeginNamespace("extension", "projectExtension").WithStartAssociationExtension(When_association_extension_exists_in_extension._entity_name).WithBooleanProperty("Property2", "because a property is required", true, false).WithEndAssociationExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new AssociationExtensionExistsOnlyInExtensionNamespace() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_association_extension_exists_in_extension._entity_name = "MyIdentifier";
                    When_association_extension_exists_in_extension._property_name = "Property1";
                    AssociationExtensionExistsOnlyInExtensionNamespaceTests.When_association_extension_exists_in_extension = When_association_extension_exists_in_extension;
                })(AssociationExtensionExistsOnlyInExtensionNamespaceTests = AssociationExtension.AssociationExtensionExistsOnlyInExtensionNamespaceTests || (AssociationExtension.AssociationExtensionExistsOnlyInExtensionNamespaceTests = {}));
                (function (AssociationExtensionExistsOnlyInExtensionNamespaceTests) {
                    /*[TestFixture]*/
                    class When_association_extension_has_invalid_extendee extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_extension_has_invalid_extendee._entity_name).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndAssociation();
                            metaEdTextBuilder.WithStartAssociationExtension(When_association_extension_has_invalid_extendee._entity_name).WithBooleanProperty("Property2", "because a property is required", true, false).WithEndAssociationExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new AssociationExtensionExistsOnlyInExtensionNamespace() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Association additions");
                            _errorMessageCollection[0].Message.ShouldContain(When_association_extension_has_invalid_extendee._entity_name);
                            _errorMessageCollection[0].Message.ShouldContain("is not valid in core namespace");
                            _errorMessageCollection[0].Message.ShouldContain(When_association_extension_has_invalid_extendee._coreNamespace);
                        }
                    }
                    When_association_extension_has_invalid_extendee._coreNamespace = "edfi";
                    When_association_extension_has_invalid_extendee._entity_name = "MyIdentifier";
                    When_association_extension_has_invalid_extendee._property_name = "Property1";
                    AssociationExtensionExistsOnlyInExtensionNamespaceTests.When_association_extension_has_invalid_extendee = When_association_extension_has_invalid_extendee;
                })(AssociationExtensionExistsOnlyInExtensionNamespaceTests = AssociationExtension.AssociationExtensionExistsOnlyInExtensionNamespaceTests || (AssociationExtension.AssociationExtensionExistsOnlyInExtensionNamespaceTests = {}));
            })(AssociationExtension = Validator.AssociationExtension || (Validator.AssociationExtension = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=AssociationExtensionExistsOnlyInExtensionNamespaceTests.js.map