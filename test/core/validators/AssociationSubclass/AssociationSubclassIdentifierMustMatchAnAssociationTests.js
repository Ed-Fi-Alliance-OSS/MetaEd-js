var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var AssociationSubclass;
            (function (AssociationSubclass) {
                class AssociationSubclassIdentifierMustMatchAnAssociationTests {
                }
                AssociationSubclass.AssociationSubclassIdentifierMustMatchAnAssociationTests = AssociationSubclassIdentifierMustMatchAnAssociationTests;
                (function (AssociationSubclassIdentifierMustMatchAnAssociationTests) {
                    /*[TestFixture]*/
                    class When_association_subclass_has_valid_extendee extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_subclass_has_valid_extendee._entityName).WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "doc", true, false).WithEndAssociation();
                            metaEdTextBuilder.WithStartAssociationSubclass("NewSubclass", When_association_subclass_has_valid_extendee._entityName).WithDocumentation("doc").WithBooleanProperty("Property2", "doc", true, false).WithEndAssociationSubclass().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new AssociationSubclassIdentifierMustMatchAnAssociation(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_association_subclass_has_valid_extendee._entityName = "MyIdentifier";
                    AssociationSubclassIdentifierMustMatchAnAssociationTests.When_association_subclass_has_valid_extendee = When_association_subclass_has_valid_extendee;
                })(AssociationSubclassIdentifierMustMatchAnAssociationTests = AssociationSubclass.AssociationSubclassIdentifierMustMatchAnAssociationTests || (AssociationSubclass.AssociationSubclassIdentifierMustMatchAnAssociationTests = {}));
                (function (AssociationSubclassIdentifierMustMatchAnAssociationTests) {
                    /*[TestFixture]*/
                    class When_association_subclass_has_invalid_extendee extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociationSubclass(When_association_subclass_has_invalid_extendee._entityName, When_association_subclass_has_invalid_extendee._baseName).WithDocumentation("doc").WithBooleanProperty("Property1", "doc", true, false).WithEndAssociationSubclass().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new AssociationSubclassIdentifierMustMatchAnAssociation(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Association");
                            _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_invalid_extendee._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("based on");
                            _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_invalid_extendee._baseName);
                            _errorMessageCollection[0].Message.ShouldContain("does not match");
                        }
                    }
                    When_association_subclass_has_invalid_extendee._entityName = "MyIdentifier";
                    When_association_subclass_has_invalid_extendee._baseName = "NotAnAssociationIdentifier";
                    AssociationSubclassIdentifierMustMatchAnAssociationTests.When_association_subclass_has_invalid_extendee = When_association_subclass_has_invalid_extendee;
                })(AssociationSubclassIdentifierMustMatchAnAssociationTests = AssociationSubclass.AssociationSubclassIdentifierMustMatchAnAssociationTests || (AssociationSubclass.AssociationSubclassIdentifierMustMatchAnAssociationTests = {}));
            })(AssociationSubclass = Validator.AssociationSubclass || (Validator.AssociationSubclass = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=AssociationSubclassIdentifierMustMatchAnAssociationTests.js.map