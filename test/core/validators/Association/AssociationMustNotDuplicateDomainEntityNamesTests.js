var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var Association;
            (function (Association) {
                class AssociationMustNotDuplicateDomainEntityNamesTests {
                }
                Association.AssociationMustNotDuplicateDomainEntityNamesTests = AssociationMustNotDuplicateDomainEntityNamesTests;
                (function (AssociationMustNotDuplicateDomainEntityNamesTests) {
                    /*[TestFixture]*/
                    class When_validating_association_with_different_domain_entity_names extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation("Association1").WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc1").WithDomainEntityProperty("DomainEntity2", "doc2").WithEndAssociation().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new AssociationMustNotDuplicateDomainEntityNames() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    AssociationMustNotDuplicateDomainEntityNamesTests.When_validating_association_with_different_domain_entity_names = When_validating_association_with_different_domain_entity_names;
                })(AssociationMustNotDuplicateDomainEntityNamesTests = Association.AssociationMustNotDuplicateDomainEntityNamesTests || (Association.AssociationMustNotDuplicateDomainEntityNamesTests = {}));
                (function (AssociationMustNotDuplicateDomainEntityNamesTests) {
                    /*[TestFixture]*/
                    class When_validating_association_with_same_domain_entity_names extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_validating_association_with_same_domain_entity_names._associationName).WithDocumentation("doc").WithDomainEntityProperty(When_validating_association_with_same_domain_entity_names._domainEntityName, "doc1").WithDomainEntityProperty(When_validating_association_with_same_domain_entity_names._domainEntityName, "doc2").WithEndAssociation().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new AssociationMustNotDuplicateDomainEntityNames() });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Association");
                            _errorMessageCollection[0].Message.ShouldContain(When_validating_association_with_same_domain_entity_names._associationName);
                            _errorMessageCollection[0].Message.ShouldContain(When_validating_association_with_same_domain_entity_names._domainEntityName);
                            _errorMessageCollection[0].Message.ShouldContain("duplicate declarations");
                        }
                    }
                    When_validating_association_with_same_domain_entity_names._associationName = "Association1";
                    When_validating_association_with_same_domain_entity_names._domainEntityName = "DomainEntity1";
                    AssociationMustNotDuplicateDomainEntityNamesTests.When_validating_association_with_same_domain_entity_names = When_validating_association_with_same_domain_entity_names;
                })(AssociationMustNotDuplicateDomainEntityNamesTests = Association.AssociationMustNotDuplicateDomainEntityNamesTests || (Association.AssociationMustNotDuplicateDomainEntityNamesTests = {}));
                (function (AssociationMustNotDuplicateDomainEntityNamesTests) {
                    /*[TestFixture]*/
                    class When_validating_association_with_same_domain_entity_names_and_same_contexts extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_validating_association_with_same_domain_entity_names_and_same_contexts._associationName).WithDocumentation("doc").WithDomainEntityProperty(When_validating_association_with_same_domain_entity_names_and_same_contexts._domainEntityName, "doc1", When_validating_association_with_same_domain_entity_names_and_same_contexts._contextName).WithDomainEntityProperty(When_validating_association_with_same_domain_entity_names_and_same_contexts._domainEntityName, "doc2", When_validating_association_with_same_domain_entity_names_and_same_contexts._contextName).WithEndAssociation().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new AssociationMustNotDuplicateDomainEntityNames() });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Association");
                            _errorMessageCollection[0].Message.ShouldContain(When_validating_association_with_same_domain_entity_names_and_same_contexts._associationName);
                            _errorMessageCollection[0].Message.ShouldContain(When_validating_association_with_same_domain_entity_names_and_same_contexts._domainEntityName);
                            _errorMessageCollection[0].Message.ShouldContain("duplicate declarations");
                        }
                    }
                    When_validating_association_with_same_domain_entity_names_and_same_contexts._associationName = "Association1";
                    When_validating_association_with_same_domain_entity_names_and_same_contexts._domainEntityName = "DomainEntity1";
                    When_validating_association_with_same_domain_entity_names_and_same_contexts._contextName = "Context1";
                    AssociationMustNotDuplicateDomainEntityNamesTests.When_validating_association_with_same_domain_entity_names_and_same_contexts = When_validating_association_with_same_domain_entity_names_and_same_contexts;
                })(AssociationMustNotDuplicateDomainEntityNamesTests = Association.AssociationMustNotDuplicateDomainEntityNamesTests || (Association.AssociationMustNotDuplicateDomainEntityNamesTests = {}));
                (function (AssociationMustNotDuplicateDomainEntityNamesTests) {
                    /*[TestFixture]*/
                    class When_validating_association_with_same_domain_entity_names_and_different_contexts extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation("Association1").WithDocumentation("doc").WithDomainEntityProperty(When_validating_association_with_same_domain_entity_names_and_different_contexts._domainEntityName, "doc1", "Context1").WithDomainEntityProperty(When_validating_association_with_same_domain_entity_names_and_different_contexts._domainEntityName, "doc2", "Context2").WithEndAssociation().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new AssociationMustNotDuplicateDomainEntityNames() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_validating_association_with_same_domain_entity_names_and_different_contexts._domainEntityName = "DomainEntity1";
                    AssociationMustNotDuplicateDomainEntityNamesTests.When_validating_association_with_same_domain_entity_names_and_different_contexts = When_validating_association_with_same_domain_entity_names_and_different_contexts;
                })(AssociationMustNotDuplicateDomainEntityNamesTests = Association.AssociationMustNotDuplicateDomainEntityNamesTests || (Association.AssociationMustNotDuplicateDomainEntityNamesTests = {}));
                (function (AssociationMustNotDuplicateDomainEntityNamesTests) {
                    /*[TestFixture]*/
                    class When_validating_association_with_different_domain_entity_names_and_same_contexts extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation("Association1").WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc1", When_validating_association_with_different_domain_entity_names_and_same_contexts._contextName).WithDomainEntityProperty("DomainEntity2", "doc2", When_validating_association_with_different_domain_entity_names_and_same_contexts._contextName).WithEndAssociation().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new AssociationMustNotDuplicateDomainEntityNames() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_validating_association_with_different_domain_entity_names_and_same_contexts._contextName = "Context1";
                    AssociationMustNotDuplicateDomainEntityNamesTests.When_validating_association_with_different_domain_entity_names_and_same_contexts = When_validating_association_with_different_domain_entity_names_and_same_contexts;
                })(AssociationMustNotDuplicateDomainEntityNamesTests = Association.AssociationMustNotDuplicateDomainEntityNamesTests || (Association.AssociationMustNotDuplicateDomainEntityNamesTests = {}));
            })(Association = Validator.Association || (Validator.Association = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=AssociationMustNotDuplicateDomainEntityNamesTests.js.map