var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var ReferenceProperty;
            (function (ReferenceProperty) {
                class ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests {
                }
                ReferenceProperty.ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests = ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests;
                (function (ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests) {
                    /*[TestFixture]*/
                    class When_reference_property_has_identifier_of_domain_entity extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_reference_property_has_identifier_of_domain_entity._entityName).WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("DomainEntity2").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithReferenceProperty(When_reference_property_has_identifier_of_domain_entity._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_reference_property_has_identifier_of_domain_entity._entityName = "MyIdentifier";
                    ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests.When_reference_property_has_identifier_of_domain_entity = When_reference_property_has_identifier_of_domain_entity;
                })(ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests = ReferenceProperty.ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests || (ReferenceProperty.ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests = {}));
                (function (ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests) {
                    /*[TestFixture]*/
                    class When_reference_property_has_identifier_of_domain_entity_subclass extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntityBase").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntitySubclass(When_reference_property_has_identifier_of_domain_entity_subclass._entityName, "DomainEntityBase").WithDocumentation("doc").WithDateProperty("BeginDate", "doc", true, false).WithEndDomainEntitySubclass();
                            metaEdTextBuilder.WithStartDomainEntity("DomainEntity2").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithReferenceProperty(When_reference_property_has_identifier_of_domain_entity_subclass._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_reference_property_has_identifier_of_domain_entity_subclass._entityName = "MyIdentifier";
                    ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests.When_reference_property_has_identifier_of_domain_entity_subclass = When_reference_property_has_identifier_of_domain_entity_subclass;
                })(ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests = ReferenceProperty.ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests || (ReferenceProperty.ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests = {}));
                (function (ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests) {
                    /*[TestFixture]*/
                    class When_reference_property_has_identifier_of_association extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_reference_property_has_identifier_of_association._entityName).WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndAssociation();
                            metaEdTextBuilder.WithStartDomainEntity("DomainEntity3").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithReferenceProperty(When_reference_property_has_identifier_of_association._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_reference_property_has_identifier_of_association._entityName = "MyIdentifier";
                    ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests.When_reference_property_has_identifier_of_association = When_reference_property_has_identifier_of_association;
                })(ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests = ReferenceProperty.ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests || (ReferenceProperty.ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests = {}));
                (function (ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests) {
                    /*[TestFixture]*/
                    class When_reference_property_has_identifier_of_association_subclass extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation("BaseName").WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "doc", true, false).WithEndAssociation();
                            metaEdTextBuilder.WithStartAssociationSubclass(When_reference_property_has_identifier_of_association_subclass._entityName, "BaseName").WithDocumentation("doc").WithBooleanProperty("Property2", "doc", true, false).WithEndAssociationSubclass();
                            metaEdTextBuilder.WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithReferenceProperty(When_reference_property_has_identifier_of_association_subclass._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_reference_property_has_identifier_of_association_subclass._entityName = "MyIdentifier";
                    ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests.When_reference_property_has_identifier_of_association_subclass = When_reference_property_has_identifier_of_association_subclass;
                })(ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests = ReferenceProperty.ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests || (ReferenceProperty.ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests = {}));
                (function (ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests) {
                    /*[TestFixture]*/
                    class When_reference_property_has_identifier_of_abstract_entity extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_reference_property_has_identifier_of_abstract_entity._entityName).WithDocumentation("doc").WithStringIdentity("Property1", "doc", 100).WithEndAbstractEntity();
                            metaEdTextBuilder.WithStartDomainEntity("DomainEntity2").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithReferenceProperty(When_reference_property_has_identifier_of_abstract_entity._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_reference_property_has_identifier_of_abstract_entity._entityName = "MyIdentifier";
                    ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests.When_reference_property_has_identifier_of_abstract_entity = When_reference_property_has_identifier_of_abstract_entity;
                })(ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests = ReferenceProperty.ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests || (ReferenceProperty.ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests = {}));
                (function (ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests) {
                    /*[TestFixture]*/
                    class When_reference_property_has_invalid_identifier extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithReferenceProperty(When_reference_property_has_invalid_identifier._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Reference");
                            _errorMessageCollection[0].Message.ShouldContain(When_reference_property_has_invalid_identifier._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("does not match");
                        }
                    }
                    When_reference_property_has_invalid_identifier._entityName = "MyIdentifier";
                    ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests.When_reference_property_has_invalid_identifier = When_reference_property_has_invalid_identifier;
                })(ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests = ReferenceProperty.ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests || (ReferenceProperty.ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests = {}));
            })(ReferenceProperty = Validator.ReferenceProperty || (Validator.ReferenceProperty = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests.js.map