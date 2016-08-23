var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var DomainEntity;
            (function (DomainEntity) {
                class DomainEntityMustContainAnIdentityTests {
                }
                DomainEntity.DomainEntityMustContainAnIdentityTests = DomainEntityMustContainAnIdentityTests;
                (function (DomainEntityMustContainAnIdentityTests) {
                    /*[TestFixture]*/
                    class When_validating_domain_entity_with_identity_fields extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity1").WithDocumentation("doc1").WithStringIdentity("Property1", "doc2", 100).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DomainEntityMustContainAnIdentity() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    DomainEntityMustContainAnIdentityTests.When_validating_domain_entity_with_identity_fields = When_validating_domain_entity_with_identity_fields;
                })(DomainEntityMustContainAnIdentityTests = DomainEntity.DomainEntityMustContainAnIdentityTests || (DomainEntity.DomainEntityMustContainAnIdentityTests = {}));
                (function (DomainEntityMustContainAnIdentityTests) {
                    /*[TestFixture]*/
                    class When_validating_domain_entity_with_no_identity_fields extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_validating_domain_entity_with_no_identity_fields._entity_name).WithDocumentation("doc1").WithDateProperty("Property1", "doc2", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DomainEntityMustContainAnIdentity() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Domain Entity");
                            _errorMessageCollection[0].Message.ShouldContain(When_validating_domain_entity_with_no_identity_fields._entity_name);
                            _errorMessageCollection[0].Message.ShouldContain("does not have an identity");
                        }
                    }
                    When_validating_domain_entity_with_no_identity_fields._entity_name = "MyIdentifier";
                    DomainEntityMustContainAnIdentityTests.When_validating_domain_entity_with_no_identity_fields = When_validating_domain_entity_with_no_identity_fields;
                })(DomainEntityMustContainAnIdentityTests = DomainEntity.DomainEntityMustContainAnIdentityTests || (DomainEntity.DomainEntityMustContainAnIdentityTests = {}));
            })(DomainEntity = Validator.DomainEntity || (Validator.DomainEntity = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntityMustContainAnIdentityTests.js.map