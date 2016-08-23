var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var DomainEntitySubclass;
            (function (DomainEntitySubclass) {
                class DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests {
                }
                DomainEntitySubclass.DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests = DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests;
                (function (DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_subclass_extends_domain_entity extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_subclass_extends_domain_entity._entityName).WithDocumentation("doc").WithBooleanProperty("Property1", "doc", true, false).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntitySubclass("NewSubclassName", When_domain_entity_subclass_extends_domain_entity._entityName).WithDocumentation("doc").WithBooleanProperty("Property2", "doc", true, false).WithEndDomainEntitySubclass().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_domain_entity_subclass_extends_domain_entity._entityName = "MyIdentifier";
                    DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests.When_domain_entity_subclass_extends_domain_entity = When_domain_entity_subclass_extends_domain_entity;
                })(DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests = DomainEntitySubclass.DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests || (DomainEntitySubclass.DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests = {}));
                (function (DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_subclass_extends_abstract_entity extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_domain_entity_subclass_extends_abstract_entity._entityName).WithDocumentation("doc").WithStringIdentity("Property1", "doc", 100).WithEndAbstractEntity();
                            metaEdTextBuilder.WithStartDomainEntitySubclass("NewSubclassName", When_domain_entity_subclass_extends_abstract_entity._entityName).WithDocumentation("doc").WithBooleanProperty("Property2", "doc", true, false).WithEndDomainEntitySubclass().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_domain_entity_subclass_extends_abstract_entity._entityName = "MyIdentifier";
                    DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests.When_domain_entity_subclass_extends_abstract_entity = When_domain_entity_subclass_extends_abstract_entity;
                })(DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests = DomainEntitySubclass.DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests || (DomainEntitySubclass.DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests = {}));
                (function (DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_subclass_has_invalid_extendee extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntitySubclass(When_domain_entity_subclass_has_invalid_extendee._entityName, When_domain_entity_subclass_has_invalid_extendee._baseName).WithDocumentation("doc").WithBooleanProperty("Property1", "doc", true, false).WithEndDomainEntitySubclass().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("DomainEntity");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_invalid_extendee._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("based on");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_invalid_extendee._baseName);
                            _errorMessageCollection[0].Message.ShouldContain("does not match");
                        }
                    }
                    When_domain_entity_subclass_has_invalid_extendee._entityName = "MyIdentifier";
                    When_domain_entity_subclass_has_invalid_extendee._baseName = "NotAnDomainEntityIdentifier";
                    DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests.When_domain_entity_subclass_has_invalid_extendee = When_domain_entity_subclass_has_invalid_extendee;
                })(DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests = DomainEntitySubclass.DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests || (DomainEntitySubclass.DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests = {}));
            })(DomainEntitySubclass = Validator.DomainEntitySubclass || (Validator.DomainEntitySubclass = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests.js.map