var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var Identity;
            (function (Identity) {
                class IdentityOnlyIfIdentityIsAllowedTests {
                }
                Identity.IdentityOnlyIfIdentityIsAllowedTests = IdentityOnlyIfIdentityIsAllowedTests;
                (function (IdentityOnlyIfIdentityIsAllowedTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_has_valid_identity_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_has_valid_identity_property._entityName).WithDocumentation("doc").WithStringIdentity(When_domain_entity_has_valid_identity_property._propertyName, "doc", 100).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IdentityExistsOnlyIfIdentityIsAllowed() });
                        }
                        should_not_have_validation_failure() {
                            _errorMessageCollection.ShouldBeEmpty();
                        }
                    }
                    When_domain_entity_has_valid_identity_property._entityName = "MyIdentifier";
                    When_domain_entity_has_valid_identity_property._propertyName = "Identifier";
                    IdentityOnlyIfIdentityIsAllowedTests.When_domain_entity_has_valid_identity_property = When_domain_entity_has_valid_identity_property;
                })(IdentityOnlyIfIdentityIsAllowedTests = Identity.IdentityOnlyIfIdentityIsAllowedTests || (Identity.IdentityOnlyIfIdentityIsAllowedTests = {}));
                (function (IdentityOnlyIfIdentityIsAllowedTests) {
                    /*[TestFixture]*/
                    class When_abstract_entity_has_valid_identity_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_abstract_entity_has_valid_identity_property._entityName).WithDocumentation("doc").WithStringIdentity(When_abstract_entity_has_valid_identity_property._propertyName, "doc", 100).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IdentityExistsOnlyIfIdentityIsAllowed() });
                        }
                        should_not_have_validation_failure() {
                            _errorMessageCollection.ShouldBeEmpty();
                        }
                    }
                    When_abstract_entity_has_valid_identity_property._entityName = "MyIdentifier";
                    When_abstract_entity_has_valid_identity_property._propertyName = "Identifier";
                    IdentityOnlyIfIdentityIsAllowedTests.When_abstract_entity_has_valid_identity_property = When_abstract_entity_has_valid_identity_property;
                })(IdentityOnlyIfIdentityIsAllowedTests = Identity.IdentityOnlyIfIdentityIsAllowedTests || (Identity.IdentityOnlyIfIdentityIsAllowedTests = {}));
                (function (IdentityOnlyIfIdentityIsAllowedTests) {
                    /*[TestFixture]*/
                    class When_association_has_valid_identity_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_has_valid_identity_property._entityName).WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithStringIdentity(When_association_has_valid_identity_property._propertyName, "doc", 100).WithEndAssociation().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IdentityExistsOnlyIfIdentityIsAllowed() });
                        }
                        should_not_have_validation_failure() {
                            _errorMessageCollection.ShouldBeEmpty();
                        }
                    }
                    When_association_has_valid_identity_property._entityName = "MyIdentifier";
                    When_association_has_valid_identity_property._propertyName = "Identifier";
                    IdentityOnlyIfIdentityIsAllowedTests.When_association_has_valid_identity_property = When_association_has_valid_identity_property;
                })(IdentityOnlyIfIdentityIsAllowedTests = Identity.IdentityOnlyIfIdentityIsAllowedTests || (Identity.IdentityOnlyIfIdentityIsAllowedTests = {}));
                (function (IdentityOnlyIfIdentityIsAllowedTests) {
                    /*[TestFixture]*/
                    class When_common_type_has_valid_identity_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_common_type_has_valid_identity_property._entityName).WithDocumentation("doc").WithStringIdentity(When_common_type_has_valid_identity_property._propertyName, "doc", 100).WithEndCommonType().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IdentityExistsOnlyIfIdentityIsAllowed() });
                        }
                        should_not_have_validation_failure() {
                            _errorMessageCollection.ShouldBeEmpty();
                        }
                    }
                    When_common_type_has_valid_identity_property._entityName = "MyIdentifier";
                    When_common_type_has_valid_identity_property._propertyName = "Identifier";
                    IdentityOnlyIfIdentityIsAllowedTests.When_common_type_has_valid_identity_property = When_common_type_has_valid_identity_property;
                })(IdentityOnlyIfIdentityIsAllowedTests = Identity.IdentityOnlyIfIdentityIsAllowedTests || (Identity.IdentityOnlyIfIdentityIsAllowedTests = {}));
                (function (IdentityOnlyIfIdentityIsAllowedTests) {
                    /*[TestFixture]*/
                    class When_inline_common_type_has_valid_identity_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInlineCommonType(When_inline_common_type_has_valid_identity_property._entityName).WithDocumentation("doc").WithStringIdentity(When_inline_common_type_has_valid_identity_property._propertyName, "doc", 100).WithEndInlineCommonType().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IdentityExistsOnlyIfIdentityIsAllowed() });
                        }
                        should_not_have_validation_failure() {
                            _errorMessageCollection.ShouldBeEmpty();
                        }
                    }
                    When_inline_common_type_has_valid_identity_property._entityName = "MyIdentifier";
                    When_inline_common_type_has_valid_identity_property._propertyName = "Identifier";
                    IdentityOnlyIfIdentityIsAllowedTests.When_inline_common_type_has_valid_identity_property = When_inline_common_type_has_valid_identity_property;
                })(IdentityOnlyIfIdentityIsAllowedTests = Identity.IdentityOnlyIfIdentityIsAllowedTests || (Identity.IdentityOnlyIfIdentityIsAllowedTests = {}));
                (function (IdentityOnlyIfIdentityIsAllowedTests) {
                    /*[TestFixture]*/
                    class When_association_extension_has_invalid_identity_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_extension_has_invalid_identity_property._entityName).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndAssociation();
                            metaEdTextBuilder.WithStartAssociationExtension(When_association_extension_has_invalid_identity_property._entityName).WithStringIdentity(When_association_extension_has_invalid_identity_property._propertyName, "doc", 100).WithEndAssociationExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IdentityExistsOnlyIfIdentityIsAllowed() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.ShouldNotBeEmpty();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Association");
                            _errorMessageCollection[0].Message.ShouldContain("additions");
                            _errorMessageCollection[0].Message.ShouldContain(When_association_extension_has_invalid_identity_property._entityName);
                            _errorMessageCollection[0].Message.ShouldContain(When_association_extension_has_invalid_identity_property._propertyName);
                            _errorMessageCollection[0].Message.ShouldContain("invalid");
                        }
                    }
                    When_association_extension_has_invalid_identity_property._entityName = "MyIdentifier";
                    When_association_extension_has_invalid_identity_property._propertyName = "Identifier";
                    IdentityOnlyIfIdentityIsAllowedTests.When_association_extension_has_invalid_identity_property = When_association_extension_has_invalid_identity_property;
                })(IdentityOnlyIfIdentityIsAllowedTests = Identity.IdentityOnlyIfIdentityIsAllowedTests || (Identity.IdentityOnlyIfIdentityIsAllowedTests = {}));
                (function (IdentityOnlyIfIdentityIsAllowedTests) {
                    /*[TestFixture]*/
                    class When_association_subclass_has_invalid_identity_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_subclass_has_invalid_identity_property._entityName).WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithEndAssociation();
                            metaEdTextBuilder.WithStartAssociationSubclass(When_association_subclass_has_invalid_identity_property._subClassName, When_association_subclass_has_invalid_identity_property._entityName).WithDocumentation("doc").WithStringIdentity(When_association_subclass_has_invalid_identity_property._propertyName, "doc", 100).WithEndAssociationSubclass().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IdentityExistsOnlyIfIdentityIsAllowed() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.ShouldNotBeEmpty();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Association");
                            _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_invalid_identity_property._entityName);
                            _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_invalid_identity_property._subClassName);
                            _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_invalid_identity_property._propertyName);
                            _errorMessageCollection[0].Message.ShouldContain("invalid");
                        }
                    }
                    When_association_subclass_has_invalid_identity_property._entityName = "MyIdentifier";
                    When_association_subclass_has_invalid_identity_property._subClassName = "NewSubclass";
                    When_association_subclass_has_invalid_identity_property._propertyName = "Identifier";
                    IdentityOnlyIfIdentityIsAllowedTests.When_association_subclass_has_invalid_identity_property = When_association_subclass_has_invalid_identity_property;
                })(IdentityOnlyIfIdentityIsAllowedTests = Identity.IdentityOnlyIfIdentityIsAllowedTests || (Identity.IdentityOnlyIfIdentityIsAllowedTests = {}));
                (function (IdentityOnlyIfIdentityIsAllowedTests) {
                    /*[TestFixture]*/
                    class When_descriptor_has_invalid_identity_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDescriptor(When_descriptor_has_invalid_identity_property._entityName).WithDocumentation("doc").WithStringIdentity(When_descriptor_has_invalid_identity_property._propertyName, "doc", 100).WithStartMapType().WithDocumentation("map type doc").WithEnumerationItem("this is short description 1", "doc1").WithEnumerationItem("this is short description 2", "doc2").WithEndMapType().WithEndDescriptor().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IdentityExistsOnlyIfIdentityIsAllowed() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.ShouldNotBeEmpty();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Descriptor");
                            _errorMessageCollection[0].Message.ShouldContain(When_descriptor_has_invalid_identity_property._entityName);
                            _errorMessageCollection[0].Message.ShouldContain(When_descriptor_has_invalid_identity_property._propertyName);
                            _errorMessageCollection[0].Message.ShouldContain("invalid");
                        }
                    }
                    When_descriptor_has_invalid_identity_property._entityName = "MyIdentifier";
                    When_descriptor_has_invalid_identity_property._propertyName = "Identifier";
                    IdentityOnlyIfIdentityIsAllowedTests.When_descriptor_has_invalid_identity_property = When_descriptor_has_invalid_identity_property;
                })(IdentityOnlyIfIdentityIsAllowedTests = Identity.IdentityOnlyIfIdentityIsAllowedTests || (Identity.IdentityOnlyIfIdentityIsAllowedTests = {}));
                (function (IdentityOnlyIfIdentityIsAllowedTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_extension_has_invalid_identity_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_extension_has_invalid_identity_property._entityName).WithDocumentation("because documentation is required").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntityExtension(When_domain_entity_extension_has_invalid_identity_property._entityName).WithStringIdentity(When_domain_entity_extension_has_invalid_identity_property._propertyName, "doc", 100).WithEndDomainEntityExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IdentityExistsOnlyIfIdentityIsAllowed() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.ShouldNotBeEmpty();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Domain Entity");
                            _errorMessageCollection[0].Message.ShouldContain("additions");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_extension_has_invalid_identity_property._entityName);
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_extension_has_invalid_identity_property._propertyName);
                            _errorMessageCollection[0].Message.ShouldContain("invalid");
                        }
                    }
                    When_domain_entity_extension_has_invalid_identity_property._entityName = "MyIdentifier";
                    When_domain_entity_extension_has_invalid_identity_property._propertyName = "Identifier";
                    IdentityOnlyIfIdentityIsAllowedTests.When_domain_entity_extension_has_invalid_identity_property = When_domain_entity_extension_has_invalid_identity_property;
                })(IdentityOnlyIfIdentityIsAllowedTests = Identity.IdentityOnlyIfIdentityIsAllowedTests || (Identity.IdentityOnlyIfIdentityIsAllowedTests = {}));
                (function (IdentityOnlyIfIdentityIsAllowedTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_subclass_has_invalid_identity_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_subclass_has_invalid_identity_property._entityName).WithDocumentation("doc").WithStringIdentity("BaseIdentifier", "doc", 100).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntitySubclass(When_domain_entity_subclass_has_invalid_identity_property._subClassName, When_domain_entity_subclass_has_invalid_identity_property._entityName).WithDocumentation("doc").WithStringIdentity(When_domain_entity_subclass_has_invalid_identity_property._propertyName, "doc", 100).WithEndDomainEntitySubclass().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IdentityExistsOnlyIfIdentityIsAllowed() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.ShouldNotBeEmpty();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Domain Entity");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_invalid_identity_property._entityName);
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_invalid_identity_property._subClassName);
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_invalid_identity_property._propertyName);
                            _errorMessageCollection[0].Message.ShouldContain("invalid");
                        }
                    }
                    When_domain_entity_subclass_has_invalid_identity_property._entityName = "MyIdentifier";
                    When_domain_entity_subclass_has_invalid_identity_property._subClassName = "NewSubclass";
                    When_domain_entity_subclass_has_invalid_identity_property._propertyName = "Identifier";
                    IdentityOnlyIfIdentityIsAllowedTests.When_domain_entity_subclass_has_invalid_identity_property = When_domain_entity_subclass_has_invalid_identity_property;
                })(IdentityOnlyIfIdentityIsAllowedTests = Identity.IdentityOnlyIfIdentityIsAllowedTests || (Identity.IdentityOnlyIfIdentityIsAllowedTests = {}));
            })(Identity = Validator.Identity || (Validator.Identity = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=IdentityOnlyIfIdentityIsAllowedTests.js.map