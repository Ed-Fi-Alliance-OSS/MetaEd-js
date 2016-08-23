var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var DomainEntity;
            (function (DomainEntity) {
                class DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests {
                }
                DomainEntity.DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests = DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests;
                (function (DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests) {
                    /*[TestFixture]*/
                    class When_validating_domain_entity_with_no_uniqueId_fields extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity1").WithDocumentation("doc1").WithStringIdentity("Property1", "doc2", 100).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DomainEntityMustContainNoMoreThanOneUniqueIdColumn() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.ShouldBeEmpty();
                        }
                    }
                    DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests.When_validating_domain_entity_with_no_uniqueId_fields = When_validating_domain_entity_with_no_uniqueId_fields;
                })(DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests = DomainEntity.DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests || (DomainEntity.DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests = {}));
                (function (DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests) {
                    /*[TestFixture]*/
                    class When_validating_domain_entity_with_one_uniqueId_field extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity1").WithDocumentation("doc1").WithStringIdentity("UniqueId", "doc2", 100).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DomainEntityMustContainNoMoreThanOneUniqueIdColumn() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.ShouldBeEmpty();
                        }
                    }
                    DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests.When_validating_domain_entity_with_one_uniqueId_field = When_validating_domain_entity_with_one_uniqueId_field;
                })(DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests = DomainEntity.DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests || (DomainEntity.DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests = {}));
                (function (DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests) {
                    /*[TestFixture]*/
                    class When_validating_domain_entity_with_multiple_uniqueId_fields extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_validating_domain_entity_with_multiple_uniqueId_fields._entityName).WithDocumentation("doc1").WithStringIdentity("UniqueId", "doc2", 100, /*context:*/ "Student").WithStringIdentity("UniqueId", "doc2", 100, /*context:*/ "Staff").WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DomainEntityMustContainNoMoreThanOneUniqueIdColumn() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.ShouldNotBeEmpty();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Domain Entity");
                            _errorMessageCollection[0].Message.ShouldContain(When_validating_domain_entity_with_multiple_uniqueId_fields._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("has multiple properties with a property name of 'UniqueId'");
                        }
                    }
                    When_validating_domain_entity_with_multiple_uniqueId_fields._entityName = "DomainEntity1";
                    DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests.When_validating_domain_entity_with_multiple_uniqueId_fields = When_validating_domain_entity_with_multiple_uniqueId_fields;
                })(DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests = DomainEntity.DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests || (DomainEntity.DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests = {}));
                (function (DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests) {
                    /*[TestFixture]*/
                    class When_validating_domain_entity_with_multiple_uniqueId_fields_in_extension_namespace extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("extension", "projectExtension").WithStartDomainEntity(When_validating_domain_entity_with_multiple_uniqueId_fields_in_extension_namespace._entityName).WithDocumentation("doc1").WithStringIdentity("UniqueId", "doc2", 100, /*context:*/ "Student").WithStringIdentity("UniqueId", "doc2", 100, /*context:*/ "Staff").WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DomainEntityMustContainNoMoreThanOneUniqueIdColumn() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.ShouldBeEmpty();
                        }
                    }
                    When_validating_domain_entity_with_multiple_uniqueId_fields_in_extension_namespace._entityName = "DomainEntity1";
                    DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests.When_validating_domain_entity_with_multiple_uniqueId_fields_in_extension_namespace = When_validating_domain_entity_with_multiple_uniqueId_fields_in_extension_namespace;
                })(DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests = DomainEntity.DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests || (DomainEntity.DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests = {}));
            })(DomainEntity = Validator.DomainEntity || (Validator.DomainEntity = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests.js.map