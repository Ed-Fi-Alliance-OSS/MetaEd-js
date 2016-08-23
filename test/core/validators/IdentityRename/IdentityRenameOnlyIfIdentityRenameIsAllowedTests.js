var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var IdentityRename;
            (function (IdentityRename) {
                class IdentityRenameOnlyIfIdentityRenameIsAllowedTests {
                }
                IdentityRename.IdentityRenameOnlyIfIdentityRenameIsAllowedTests = IdentityRenameOnlyIfIdentityRenameIsAllowedTests;
                /*[TestFixture]*/
                class When_association_subclass_has_invalid_identity_rename_property extends Validator.ValidationRuleTestBase {
                    metaEdText() {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_subclass_has_invalid_identity_rename_property._entityName).WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithStringIdentityRename(When_association_subclass_has_invalid_identity_rename_property._propertyName, "BaseIdentifier", "Docs", 100).WithEndAssociation().WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    getRuleProvider() {
                        return __init(new TestRuleProvider(), { SuppliedRule: new IdentityRenameExistsOnlyIfIdentityRenameIsAllowed() });
                    }
                    should_have_validation_failure() {
                        _errorMessageCollection.Any().ShouldBeTrue();
                    }
                    should_have_validation_failure_message() {
                        _errorMessageCollection[0].Message.ShouldContain("Association");
                        _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_invalid_identity_rename_property._entityName);
                        _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_invalid_identity_rename_property._propertyName);
                        _errorMessageCollection[0].Message.ShouldContain("invalid");
                    }
                }
                When_association_subclass_has_invalid_identity_rename_property._entityName = "MyIdentifier";
                When_association_subclass_has_invalid_identity_rename_property._propertyName = "Identifier";
                IdentityRename.When_association_subclass_has_invalid_identity_rename_property = When_association_subclass_has_invalid_identity_rename_property;
                /*[TestFixture]*/
                class When_domain_entity_has_invalid_identity_rename_property extends Validator.ValidationRuleTestBase {
                    metaEdText() {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_has_invalid_identity_rename_property._entityName).WithDocumentation("doc").WithStringIdentityRename(When_domain_entity_has_invalid_identity_rename_property._propertyName, "BaseIdentifier", "doc", 100).WithEndDomainEntity().WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    getRuleProvider() {
                        return __init(new TestRuleProvider(), { SuppliedRule: new IdentityRenameExistsOnlyIfIdentityRenameIsAllowed() });
                    }
                    should_have_validation_failure() {
                        _errorMessageCollection.Any().ShouldBeTrue();
                    }
                    should_have_validation_failure_message() {
                        _errorMessageCollection[0].Message.ShouldContain("Domain Entity");
                        _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_has_invalid_identity_rename_property._entityName);
                        _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_has_invalid_identity_rename_property._propertyName);
                        _errorMessageCollection[0].Message.ShouldContain("invalid");
                    }
                }
                When_domain_entity_has_invalid_identity_rename_property._entityName = "MyIdentifier";
                When_domain_entity_has_invalid_identity_rename_property._propertyName = "Identifier";
                IdentityRename.When_domain_entity_has_invalid_identity_rename_property = When_domain_entity_has_invalid_identity_rename_property;
                (function (IdentityRenameOnlyIfIdentityRenameIsAllowedTests) {
                    /*[TestFixture]*/
                    class When_association_subclass_has_valid_identity_rename_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_subclass_has_valid_identity_rename_property._entityName).WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithStringIdentity("BaseIdentifier", "doc", 100).WithEndAssociation();
                            metaEdTextBuilder.WithStartAssociationSubclass("NewSubclass", When_association_subclass_has_valid_identity_rename_property._entityName).WithDocumentation("doc").WithStringIdentityRename("Identifier", "BaseIdentifier", "Docs", 100).WithEndAssociationSubclass().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IdentityRenameExistsOnlyIfIdentityRenameIsAllowed() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_association_subclass_has_valid_identity_rename_property._entityName = "MyIdentifier";
                    IdentityRenameOnlyIfIdentityRenameIsAllowedTests.When_association_subclass_has_valid_identity_rename_property = When_association_subclass_has_valid_identity_rename_property;
                })(IdentityRenameOnlyIfIdentityRenameIsAllowedTests = IdentityRename.IdentityRenameOnlyIfIdentityRenameIsAllowedTests || (IdentityRename.IdentityRenameOnlyIfIdentityRenameIsAllowedTests = {}));
                (function (IdentityRenameOnlyIfIdentityRenameIsAllowedTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_subclass_has_valid_identity_rename_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_subclass_has_valid_identity_rename_property._entityName).WithDocumentation("doc").WithStringIdentity("BaseIdentifier", "doc", 100).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntitySubclass("NewSubclass", When_domain_entity_subclass_has_valid_identity_rename_property._entityName).WithDocumentation("doc").WithStringIdentityRename("Identifier", "BaseIdentifier", "Docs", 100).WithEndDomainEntitySubclass().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new IdentityRenameExistsOnlyIfIdentityRenameIsAllowed() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_domain_entity_subclass_has_valid_identity_rename_property._entityName = "MyIdentifier";
                    IdentityRenameOnlyIfIdentityRenameIsAllowedTests.When_domain_entity_subclass_has_valid_identity_rename_property = When_domain_entity_subclass_has_valid_identity_rename_property;
                })(IdentityRenameOnlyIfIdentityRenameIsAllowedTests = IdentityRename.IdentityRenameOnlyIfIdentityRenameIsAllowedTests || (IdentityRename.IdentityRenameOnlyIfIdentityRenameIsAllowedTests = {}));
            })(IdentityRename = Validator.IdentityRename || (Validator.IdentityRename = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=IdentityRenameOnlyIfIdentityRenameIsAllowedTests.js.map