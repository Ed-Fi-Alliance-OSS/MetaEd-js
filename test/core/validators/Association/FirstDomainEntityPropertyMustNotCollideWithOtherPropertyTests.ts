module MetaEd.Tests.Validator.Association {
    export class FirstDomainEntityPropertyMustNotCollideWithOtherPropertyTests {

    }
    export module FirstDomainEntityPropertyMustNotCollideWithOtherPropertyTests {
        /*[TestFixture]*/
        export class When_domain_entity_property_does_not_collide extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("First").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntity("Second").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartAssociation("Association1").WithDocumentation("doc").WithDomainEntityProperty("First", "doc1").WithDomainEntityProperty("Second", "doc2").WithIntegerProperty("Third", "doc3", false, false).WithEndAssociation().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.FirstDomainEntityContext>(), { SuppliedRule: new FirstDomainEntityPropertyMustNotCollideWithOtherProperty(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module FirstDomainEntityPropertyMustNotCollideWithOtherPropertyTests {
        /*[TestFixture]*/
        export class When_domain_entity_property_does_collide extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("First").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntity("Second").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartAssociation("Association1").WithDocumentation("doc").WithDomainEntityProperty("First", "doc1").WithDomainEntityProperty("Second", "doc2").WithIntegerProperty("First", "doc3", false, false).WithEndAssociation().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.FirstDomainEntityContext>(), { SuppliedRule: new FirstDomainEntityPropertyMustNotCollideWithOtherProperty(_symbolTable) });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(1);
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldEqual("Entity Association1 has duplicate properties named First");
            }
        }
    }
}