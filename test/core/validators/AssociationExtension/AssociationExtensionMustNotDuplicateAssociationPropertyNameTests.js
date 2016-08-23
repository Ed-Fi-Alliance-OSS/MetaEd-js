var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var AssociationExtension;
            (function (AssociationExtension) {
                class AssociationExtensionMustNotDuplicateAssociationPropertyNameTests {
                }
                AssociationExtension.AssociationExtensionMustNotDuplicateAssociationPropertyNameTests = AssociationExtensionMustNotDuplicateAssociationPropertyNameTests;
                (function (AssociationExtensionMustNotDuplicateAssociationPropertyNameTests) {
                    /*[TestFixture]*/
                    class When_association_extension_has_different_property_name extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_extension_has_different_property_name._entity_name).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndAssociation();
                            metaEdTextBuilder.WithStartAssociationExtension(When_association_extension_has_different_property_name._entity_name).WithBooleanProperty("Property2", "because a property is required", true, false).WithEndAssociationExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new AssociationExtensionMustNotDuplicateAssociationPropertyName(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_association_extension_has_different_property_name._entity_name = "MyIdentifier";
                    AssociationExtensionMustNotDuplicateAssociationPropertyNameTests.When_association_extension_has_different_property_name = When_association_extension_has_different_property_name;
                })(AssociationExtensionMustNotDuplicateAssociationPropertyNameTests = AssociationExtension.AssociationExtensionMustNotDuplicateAssociationPropertyNameTests || (AssociationExtension.AssociationExtensionMustNotDuplicateAssociationPropertyNameTests = {}));
                (function (AssociationExtensionMustNotDuplicateAssociationPropertyNameTests) {
                    /*[TestFixture]*/
                    class When_association_extension_has_duplicate_property_name extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_extension_has_duplicate_property_name._entity_name).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty(When_association_extension_has_duplicate_property_name._duplicate_property_name, "because a property is required", true, false).WithEndAssociation();
                            metaEdTextBuilder.WithStartAssociationExtension(When_association_extension_has_duplicate_property_name._entity_name).WithBooleanProperty(When_association_extension_has_duplicate_property_name._duplicate_property_name, "because a property is required", true, false).WithEndAssociationExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new AssociationExtensionMustNotDuplicateAssociationPropertyName(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Association additions");
                            _errorMessageCollection[0].Message.ShouldContain(When_association_extension_has_duplicate_property_name._entity_name);
                            _errorMessageCollection[0].Message.ShouldContain(When_association_extension_has_duplicate_property_name._duplicate_property_name);
                            _errorMessageCollection[0].Message.ShouldContain("already in property list");
                        }
                    }
                    When_association_extension_has_duplicate_property_name._entity_name = "MyIdentifier";
                    When_association_extension_has_duplicate_property_name._duplicate_property_name = "Property1";
                    AssociationExtensionMustNotDuplicateAssociationPropertyNameTests.When_association_extension_has_duplicate_property_name = When_association_extension_has_duplicate_property_name;
                })(AssociationExtensionMustNotDuplicateAssociationPropertyNameTests = AssociationExtension.AssociationExtensionMustNotDuplicateAssociationPropertyNameTests || (AssociationExtension.AssociationExtensionMustNotDuplicateAssociationPropertyNameTests = {}));
                (function (AssociationExtensionMustNotDuplicateAssociationPropertyNameTests) {
                    /*[TestFixture]*/
                    class When_association_extension_has_multiple_association_names extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_extension_has_multiple_association_names._entity_name).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty(When_association_extension_has_multiple_association_names._duplicate_property_name1, "because a property is required", true, false).WithBooleanProperty(When_association_extension_has_multiple_association_names._duplicate_property_name2, "because a property is required", true, false).WithEndAssociation();
                            metaEdTextBuilder.WithStartAssociationExtension(When_association_extension_has_multiple_association_names._entity_name).WithBooleanProperty(When_association_extension_has_multiple_association_names._duplicate_property_name1, "because a property is required", true, false).WithBooleanProperty(When_association_extension_has_multiple_association_names._duplicate_property_name2, "because a property is required", true, false).WithBooleanProperty(When_association_extension_has_multiple_association_names._not_duplicate_property_name, "because a property is required", true, false).WithEndAssociationExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new AssociationExtensionMustNotDuplicateAssociationPropertyName(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Association additions");
                            _errorMessageCollection[0].Message.ShouldContain(When_association_extension_has_multiple_association_names._entity_name);
                            _errorMessageCollection[0].Message.ShouldContain(When_association_extension_has_multiple_association_names._duplicate_property_name1);
                            _errorMessageCollection[0].Message.ShouldContain(When_association_extension_has_multiple_association_names._duplicate_property_name2);
                            _errorMessageCollection[0].Message.ShouldContain("already in property list");
                            _errorMessageCollection[0].Message.ShouldNotContain(When_association_extension_has_multiple_association_names._not_duplicate_property_name);
                        }
                    }
                    When_association_extension_has_multiple_association_names._entity_name = "MyIdentifier";
                    When_association_extension_has_multiple_association_names._not_duplicate_property_name = "NotADuplicate";
                    When_association_extension_has_multiple_association_names._duplicate_property_name1 = "Property1";
                    When_association_extension_has_multiple_association_names._duplicate_property_name2 = "Property2";
                    AssociationExtensionMustNotDuplicateAssociationPropertyNameTests.When_association_extension_has_multiple_association_names = When_association_extension_has_multiple_association_names;
                })(AssociationExtensionMustNotDuplicateAssociationPropertyNameTests = AssociationExtension.AssociationExtensionMustNotDuplicateAssociationPropertyNameTests || (AssociationExtension.AssociationExtensionMustNotDuplicateAssociationPropertyNameTests = {}));
                (function (AssociationExtensionMustNotDuplicateAssociationPropertyNameTests) {
                    /*[TestFixture]*/
                    class When_association_extension_has_duplicate_include_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_extension_has_duplicate_include_property._entity_name).WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithIncludeProperty(When_association_extension_has_duplicate_include_property._duplicate_property_name, "doc", true, false).WithEndAssociation();
                            metaEdTextBuilder.WithStartAssociationExtension(When_association_extension_has_duplicate_include_property._entity_name).WithIncludeProperty(When_association_extension_has_duplicate_include_property._duplicate_property_name, "doc", true, false).WithEndAssociationExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new AssociationExtensionMustNotDuplicateAssociationPropertyName(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                    }
                    When_association_extension_has_duplicate_include_property._entity_name = "MyIdentifier";
                    When_association_extension_has_duplicate_include_property._duplicate_property_name = "Property1";
                    AssociationExtensionMustNotDuplicateAssociationPropertyNameTests.When_association_extension_has_duplicate_include_property = When_association_extension_has_duplicate_include_property;
                })(AssociationExtensionMustNotDuplicateAssociationPropertyNameTests = AssociationExtension.AssociationExtensionMustNotDuplicateAssociationPropertyNameTests || (AssociationExtension.AssociationExtensionMustNotDuplicateAssociationPropertyNameTests = {}));
                (function (AssociationExtensionMustNotDuplicateAssociationPropertyNameTests) {
                    /*[TestFixture]*/
                    class When_association_extension_has_duplicate_include_extension_override_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_extension_has_duplicate_include_extension_override_property._entity_name).WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithIncludeProperty(When_association_extension_has_duplicate_include_extension_override_property._duplicate_property_name, "doc", true, false).WithEndAssociation();
                            metaEdTextBuilder.WithStartAssociationExtension(When_association_extension_has_duplicate_include_extension_override_property._entity_name).WithIncludeExtensionOverrideProperty(When_association_extension_has_duplicate_include_extension_override_property._duplicate_property_name, "doc", true, false).WithEndAssociationExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new AssociationExtensionMustNotDuplicateAssociationPropertyName(_symbolTable) });
                        }
                        should_not_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeFalse();
                        }
                    }
                    When_association_extension_has_duplicate_include_extension_override_property._entity_name = "MyIdentifier";
                    When_association_extension_has_duplicate_include_extension_override_property._duplicate_property_name = "Property1";
                    AssociationExtensionMustNotDuplicateAssociationPropertyNameTests.When_association_extension_has_duplicate_include_extension_override_property = When_association_extension_has_duplicate_include_extension_override_property;
                })(AssociationExtensionMustNotDuplicateAssociationPropertyNameTests = AssociationExtension.AssociationExtensionMustNotDuplicateAssociationPropertyNameTests || (AssociationExtension.AssociationExtensionMustNotDuplicateAssociationPropertyNameTests = {}));
            })(AssociationExtension = Validator.AssociationExtension || (Validator.AssociationExtension = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=AssociationExtensionMustNotDuplicateAssociationPropertyNameTests.js.map