var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var AssociationExtension;
            (function (AssociationExtension) {
                class AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests {
                }
                AssociationExtension.AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests = AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests;
                (function (AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests) {
                    /*[TestFixture]*/
                    class When_association_extension_has_valid_extendee extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_extension_has_valid_extendee._entity_name).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndAssociation();
                            metaEdTextBuilder.WithStartAssociationExtension(When_association_extension_has_valid_extendee._entity_name).WithBooleanProperty("Property2", "because a property is required", true, false).WithEndAssociationExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_association_extension_has_valid_extendee._entity_name = "MyIdentifier";
                    When_association_extension_has_valid_extendee._property_name = "Property1";
                    AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests.When_association_extension_has_valid_extendee = When_association_extension_has_valid_extendee;
                })(AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests = AssociationExtension.AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests || (AssociationExtension.AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests = {}));
                (function (AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests) {
                    /*[TestFixture]*/
                    class When_association_extension_has_invalid_extendee extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociationExtension(When_association_extension_has_invalid_extendee._entity_name).WithBooleanProperty("Property2", "because a property is required", false, false).WithEndAssociationExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Association additions");
                            _errorMessageCollection[0].Message.ShouldContain(When_association_extension_has_invalid_extendee._entity_name);
                            _errorMessageCollection[0].Message.ShouldContain("does not match");
                        }
                    }
                    When_association_extension_has_invalid_extendee._entity_name = "NotAnAssociationIdentifier";
                    AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests.When_association_extension_has_invalid_extendee = When_association_extension_has_invalid_extendee;
                })(AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests = AssociationExtension.AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests || (AssociationExtension.AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests = {}));
                (function (AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests) {
                    /*[TestFixture]*/
                    class When_association_extension_extends_association_subclass extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_extension_extends_association_subclass._entity_name).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndAssociation();
                            metaEdTextBuilder.WithStartAssociationSubclass(When_association_extension_extends_association_subclass._subclass_name, When_association_extension_extends_association_subclass._entity_name).WithDocumentation("because documentation is required").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndAssociationSubclass();
                            metaEdTextBuilder.WithStartAssociationExtension(When_association_extension_extends_association_subclass._subclass_name).WithBooleanProperty("Property2", "because a property is required", true, false).WithEndAssociationExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_association_extension_extends_association_subclass._entity_name = "MyIdentifier";
                    When_association_extension_extends_association_subclass._subclass_name = "MyIdentifierSubclass";
                    AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests.When_association_extension_extends_association_subclass = When_association_extension_extends_association_subclass;
                })(AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests = AssociationExtension.AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests || (AssociationExtension.AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests = {}));
            })(AssociationExtension = Validator.AssociationExtension || (Validator.AssociationExtension = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests.js.map