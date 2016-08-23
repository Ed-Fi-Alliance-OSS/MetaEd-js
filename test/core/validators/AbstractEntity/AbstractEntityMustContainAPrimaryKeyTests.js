var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var AbstractEntity;
            (function (AbstractEntity) {
                class AbstractEntityMustContainAnIdentityTests {
                }
                AbstractEntity.AbstractEntityMustContainAnIdentityTests = AbstractEntityMustContainAnIdentityTests;
                (function (AbstractEntityMustContainAnIdentityTests) {
                    /*[TestFixture]*/
                    class When_validating_domain_entity_with_identity_fields extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("AbstractEntity1").WithDocumentation("doc1").WithStringIdentity("Property1", "doc2", 100).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new AbstractEntityMustContainAnIdentity() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    AbstractEntityMustContainAnIdentityTests.When_validating_domain_entity_with_identity_fields = When_validating_domain_entity_with_identity_fields;
                })(AbstractEntityMustContainAnIdentityTests = AbstractEntity.AbstractEntityMustContainAnIdentityTests || (AbstractEntity.AbstractEntityMustContainAnIdentityTests = {}));
                (function (AbstractEntityMustContainAnIdentityTests) {
                    /*[TestFixture]*/
                    class When_validating_domain_entity_with_no_identity_fields extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_validating_domain_entity_with_no_identity_fields._entity_name).WithDocumentation("doc1").WithDateProperty("Property1", "doc2", true, false).WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new AbstractEntityMustContainAnIdentity() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Abstract Entity");
                            _errorMessageCollection[0].Message.ShouldContain(When_validating_domain_entity_with_no_identity_fields._entity_name);
                            _errorMessageCollection[0].Message.ShouldContain("does not have an identity");
                        }
                    }
                    When_validating_domain_entity_with_no_identity_fields._entity_name = "MyIdentifier";
                    AbstractEntityMustContainAnIdentityTests.When_validating_domain_entity_with_no_identity_fields = When_validating_domain_entity_with_no_identity_fields;
                })(AbstractEntityMustContainAnIdentityTests = AbstractEntity.AbstractEntityMustContainAnIdentityTests || (AbstractEntity.AbstractEntityMustContainAnIdentityTests = {}));
            })(AbstractEntity = Validator.AbstractEntity || (Validator.AbstractEntity = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=AbstractEntityMustContainAPrimaryKeyTests.js.map