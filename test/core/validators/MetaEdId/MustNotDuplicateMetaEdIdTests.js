var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var MetaEdId;
            (function (MetaEdId) {
                class MustNotDuplicateMetaEdIdTests {
                }
                MetaEdId.MustNotDuplicateMetaEdIdTests = MustNotDuplicateMetaEdIdTests;
                (function (MustNotDuplicateMetaEdIdTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_has_valid_metaEdId extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_has_valid_metaEdId._entityName1).WithMetaEdId(When_domain_entity_has_valid_metaEdId._metaEdId1).WithDocumentation("doc").WithStringIdentity(When_domain_entity_has_valid_metaEdId._propertyName1, "doc", 100).WithEndDomainEntity().WithStartDomainEntity(When_domain_entity_has_valid_metaEdId._entityName2).WithMetaEdId(When_domain_entity_has_valid_metaEdId._metaEdId2).WithDocumentation("doc").WithStringIdentity(When_domain_entity_has_valid_metaEdId._propertyName2, "doc", 100).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new MustNotDuplicateMetaEdId() });
                        }
                        should_not_have_validation_failure() {
                            _errorMessageCollection.ShouldBeEmpty();
                        }
                    }
                    When_domain_entity_has_valid_metaEdId._metaEdId1 = "100";
                    When_domain_entity_has_valid_metaEdId._metaEdId2 = "101";
                    When_domain_entity_has_valid_metaEdId._entityName1 = "MyIdentifier1";
                    When_domain_entity_has_valid_metaEdId._propertyName1 = "Identifier1";
                    When_domain_entity_has_valid_metaEdId._entityName2 = "MyIdentifier2";
                    When_domain_entity_has_valid_metaEdId._propertyName2 = "Identifier2";
                    MustNotDuplicateMetaEdIdTests.When_domain_entity_has_valid_metaEdId = When_domain_entity_has_valid_metaEdId;
                })(MustNotDuplicateMetaEdIdTests = MetaEdId.MustNotDuplicateMetaEdIdTests || (MetaEdId.MustNotDuplicateMetaEdIdTests = {}));
                (function (MustNotDuplicateMetaEdIdTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_has_duplicate_metaEdId extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_has_duplicate_metaEdId._entityName1).WithMetaEdId(When_domain_entity_has_duplicate_metaEdId._metaEdId).WithDocumentation("doc").WithStringIdentity(When_domain_entity_has_duplicate_metaEdId._propertyName1, "doc", 100).WithEndDomainEntity().WithStartDomainEntity(When_domain_entity_has_duplicate_metaEdId._entityName2).WithMetaEdId(When_domain_entity_has_duplicate_metaEdId._metaEdId).WithDocumentation("doc").WithStringIdentity(When_domain_entity_has_duplicate_metaEdId._propertyName2, "doc", 100).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new MustNotDuplicateMetaEdId() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.ShouldNotBeEmpty();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("MetaEdId");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_has_duplicate_metaEdId._metaEdId);
                            _errorMessageCollection[0].Message.ShouldContain("All MetaEdIds must be globally unique.");
                        }
                    }
                    When_domain_entity_has_duplicate_metaEdId._metaEdId = "100";
                    When_domain_entity_has_duplicate_metaEdId._entityName1 = "MyIdentifier1";
                    When_domain_entity_has_duplicate_metaEdId._propertyName1 = "Identifier1";
                    When_domain_entity_has_duplicate_metaEdId._entityName2 = "MyIdentifier2";
                    When_domain_entity_has_duplicate_metaEdId._propertyName2 = "Identifier2";
                    MustNotDuplicateMetaEdIdTests.When_domain_entity_has_duplicate_metaEdId = When_domain_entity_has_duplicate_metaEdId;
                })(MustNotDuplicateMetaEdIdTests = MetaEdId.MustNotDuplicateMetaEdIdTests || (MetaEdId.MustNotDuplicateMetaEdIdTests = {}));
                (function (MustNotDuplicateMetaEdIdTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_has_duplicate_metaEdId_with_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_has_duplicate_metaEdId_with_property._entityName).WithMetaEdId(When_domain_entity_has_duplicate_metaEdId_with_property._metaEdId).WithDocumentation("doc").WithStringIdentity(When_domain_entity_has_duplicate_metaEdId_with_property._propertyName, "doc", 100, /*metaEdId:*/ When_domain_entity_has_duplicate_metaEdId_with_property._metaEdId).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new MustNotDuplicateMetaEdId() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.ShouldNotBeEmpty();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("MetaEdId");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_has_duplicate_metaEdId_with_property._metaEdId);
                            _errorMessageCollection[0].Message.ShouldContain("All MetaEdIds must be globally unique.");
                        }
                    }
                    When_domain_entity_has_duplicate_metaEdId_with_property._metaEdId = "100";
                    When_domain_entity_has_duplicate_metaEdId_with_property._entityName = "MyIdentifier";
                    When_domain_entity_has_duplicate_metaEdId_with_property._propertyName = "Identifier";
                    MustNotDuplicateMetaEdIdTests.When_domain_entity_has_duplicate_metaEdId_with_property = When_domain_entity_has_duplicate_metaEdId_with_property;
                })(MustNotDuplicateMetaEdIdTests = MetaEdId.MustNotDuplicateMetaEdIdTests || (MetaEdId.MustNotDuplicateMetaEdIdTests = {}));
                (function (MustNotDuplicateMetaEdIdTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity._entityName1).WithMetaEdId(When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity._metaEdId).WithDocumentation("doc").WithStringIdentity(When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity._propertyName1, "doc", 100).WithEndDomainEntity().WithStartDomainEntity(When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity._entityName2).WithDocumentation("doc").WithStringIdentity(When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity._propertyName2, "doc", 100, /*metaEdId:*/ When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity._metaEdId).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new MustNotDuplicateMetaEdId() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.ShouldNotBeEmpty();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("MetaEdId");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity._metaEdId);
                            _errorMessageCollection[0].Message.ShouldContain("All MetaEdIds must be globally unique.");
                        }
                    }
                    When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity._metaEdId = "100";
                    When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity._entityName1 = "MyIdentifier1";
                    When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity._propertyName1 = "Identifier1";
                    When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity._entityName2 = "MyIdentifier2";
                    When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity._propertyName2 = "Identifier2";
                    MustNotDuplicateMetaEdIdTests.When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity = When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity;
                })(MustNotDuplicateMetaEdIdTests = MetaEdId.MustNotDuplicateMetaEdIdTests || (MetaEdId.MustNotDuplicateMetaEdIdTests = {}));
            })(MetaEdId = Validator.MetaEdId || (Validator.MetaEdId = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=MustNotDuplicateMetaEdIdTests.js.map