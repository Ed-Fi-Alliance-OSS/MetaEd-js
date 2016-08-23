module MetaEd.Tests.Validator.DomainEntity {
    export class DomainEntityMustContainAnIdentityTests {

    }
    export module DomainEntityMustContainAnIdentityTests {
        /*[TestFixture]*/
        export class When_validating_domain_entity_with_identity_fields extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity1").WithDocumentation("doc1").WithStringIdentity("Property1", "doc2", 100).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntityContext>(), { SuppliedRule: new DomainEntityMustContainAnIdentity() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module DomainEntityMustContainAnIdentityTests {
        /*[TestFixture]*/
        export class When_validating_domain_entity_with_no_identity_fields extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_validating_domain_entity_with_no_identity_fields._entity_name).WithDocumentation("doc1").WithDateProperty("Property1", "doc2", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntityContext>(), { SuppliedRule: new DomainEntityMustContainAnIdentity() });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Domain Entity");
                _errorMessageCollection[0].Message.ShouldContain(When_validating_domain_entity_with_no_identity_fields._entity_name);
                _errorMessageCollection[0].Message.ShouldContain("does not have an identity");
            }
        }
    }
}