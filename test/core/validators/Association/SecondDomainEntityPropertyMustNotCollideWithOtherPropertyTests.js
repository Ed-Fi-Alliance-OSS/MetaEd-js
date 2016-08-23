var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var Association;
            (function (Association) {
                class SecondDomainEntityPropertyMustNotCollideWithOtherPropertyTests {
                }
                Association.SecondDomainEntityPropertyMustNotCollideWithOtherPropertyTests = SecondDomainEntityPropertyMustNotCollideWithOtherPropertyTests;
                (function (SecondDomainEntityPropertyMustNotCollideWithOtherPropertyTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_property_does_not_collide extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("First").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Second").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartAssociation("Association1").WithDocumentation("doc").WithDomainEntityProperty("First", "doc1").WithDomainEntityProperty("Second", "doc2").WithIntegerProperty("Third", "doc3", false, false).WithEndAssociation().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new SecondDomainEntityPropertyMustNotCollideWithOtherProperty(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    SecondDomainEntityPropertyMustNotCollideWithOtherPropertyTests.When_domain_entity_property_does_not_collide = When_domain_entity_property_does_not_collide;
                })(SecondDomainEntityPropertyMustNotCollideWithOtherPropertyTests = Association.SecondDomainEntityPropertyMustNotCollideWithOtherPropertyTests || (Association.SecondDomainEntityPropertyMustNotCollideWithOtherPropertyTests = {}));
                (function (SecondDomainEntityPropertyMustNotCollideWithOtherPropertyTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_property_does_collide extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("First").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Second").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartAssociation("Association1").WithDocumentation("doc").WithDomainEntityProperty("First", "doc1").WithDomainEntityProperty("Second", "doc2").WithIntegerProperty("Second", "doc3", false, false).WithEndAssociation().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new SecondDomainEntityPropertyMustNotCollideWithOtherProperty(_symbolTable) });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(1);
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldEqual("Entity Association1 has duplicate properties named Second");
                        }
                    }
                    SecondDomainEntityPropertyMustNotCollideWithOtherPropertyTests.When_domain_entity_property_does_collide = When_domain_entity_property_does_collide;
                })(SecondDomainEntityPropertyMustNotCollideWithOtherPropertyTests = Association.SecondDomainEntityPropertyMustNotCollideWithOtherPropertyTests || (Association.SecondDomainEntityPropertyMustNotCollideWithOtherPropertyTests = {}));
            })(Association = Validator.Association || (Validator.Association = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=SecondDomainEntityPropertyMustNotCollideWithOtherPropertyTests.js.map