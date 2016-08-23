var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var Association;
            (function (Association) {
                class FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests {
                }
                Association.FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests = FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests;
                (function (FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_property_has_domain_entity_identifier extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("First").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Second").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartAssociation("Association1").WithDocumentation("doc").WithDomainEntityProperty("First", "doc1").WithDomainEntityProperty("Second", "doc2").WithEndAssociation().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests.When_domain_entity_property_has_domain_entity_identifier = When_domain_entity_property_has_domain_entity_identifier;
                })(FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests = Association.FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests || (Association.FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests = {}));
                (function (FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_property_has_abstract_entity_identifier extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("First").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndAbstractEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Second").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartAssociation("Association1").WithDocumentation("doc").WithDomainEntityProperty("First", "doc1").WithDomainEntityProperty("Second", "doc2").WithEndAssociation().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests.When_domain_entity_property_has_abstract_entity_identifier = When_domain_entity_property_has_abstract_entity_identifier;
                })(FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests = Association.FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests || (Association.FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests = {}));
                (function (FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_property_has_subclass_entity_identifier extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("First").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndAbstractEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Second").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntitySubclass("Third", "First").WithDocumentation("doc").WithStringProperty("RequirePrimaryKey", "doc", true, false, 100).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartAssociation("Association1").WithDocumentation("doc").WithDomainEntityProperty("Third", "doc1").WithDomainEntityProperty("Second", "doc2").WithEndAssociation().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests.When_domain_entity_property_has_subclass_entity_identifier = When_domain_entity_property_has_subclass_entity_identifier;
                })(FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests = Association.FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests || (Association.FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests = {}));
                (function (FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_property_has_invalid_identifier extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Second").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartAssociation("Association1").WithDocumentation("doc").WithDomainEntityProperty(When_domain_entity_property_has_invalid_identifier._entityName, "doc1").WithDomainEntityProperty("Second", "doc2").WithEndAssociation().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Domain Entity");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_property_has_invalid_identifier._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("does not match");
                        }
                    }
                    When_domain_entity_property_has_invalid_identifier._entityName = "MyIdentifier";
                    FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests.When_domain_entity_property_has_invalid_identifier = When_domain_entity_property_has_invalid_identifier;
                })(FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests = Association.FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests || (Association.FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests = {}));
            })(Association = Validator.Association || (Validator.Association = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests.js.map