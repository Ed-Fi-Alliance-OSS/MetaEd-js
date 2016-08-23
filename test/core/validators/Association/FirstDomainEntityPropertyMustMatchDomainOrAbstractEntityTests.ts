module MetaEd.Tests.Validator.Association {
    export class FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests {

    }
    export module FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests {
        /*[TestFixture]*/
        export class When_domain_entity_property_has_domain_entity_identifier extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("First").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntity("Second").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartAssociation("Association1").WithDocumentation("doc").WithDomainEntityProperty("First", "doc1").WithDomainEntityProperty("Second", "doc2").WithEndAssociation().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.FirstDomainEntityContext>(), { SuppliedRule: new FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests {
        /*[TestFixture]*/
        export class When_domain_entity_property_has_abstract_entity_identifier extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("First").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndAbstractEntity();
                metaEdTextBuilder.WithStartDomainEntity("Second").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartAssociation("Association1").WithDocumentation("doc").WithDomainEntityProperty("First", "doc1").WithDomainEntityProperty("Second", "doc2").WithEndAssociation().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.FirstDomainEntityContext>(), { SuppliedRule: new FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests {
        /*[TestFixture]*/
        export class When_domain_entity_property_has_subclass_entity_identifier extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("First").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndAbstractEntity();
                metaEdTextBuilder.WithStartDomainEntity("Second").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntitySubclass("Third", "First").WithDocumentation("doc").WithStringProperty("RequirePrimaryKey", "doc", true, false, 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartAssociation("Association1").WithDocumentation("doc").WithDomainEntityProperty("Third", "doc1").WithDomainEntityProperty("Second", "doc2").WithEndAssociation().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.FirstDomainEntityContext>(), { SuppliedRule: new FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests {
        /*[TestFixture]*/
        export class When_domain_entity_property_has_invalid_identifier extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Second").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartAssociation("Association1").WithDocumentation("doc").WithDomainEntityProperty(When_domain_entity_property_has_invalid_identifier._entityName, "doc1").WithDomainEntityProperty("Second", "doc2").WithEndAssociation().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.FirstDomainEntityContext>(), { SuppliedRule: new FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Domain Entity");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_property_has_invalid_identifier._entityName);
                _errorMessageCollection[0].Message.ShouldContain("does not match");
            }
        }
    }
}