module MetaEd.Tests.Validator.DomainEntitySubclass {
    export class DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests {

    }
    export module DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests {
        /*[TestFixture]*/
        export class When_domain_entity_subclass_extends_domain_entity extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_subclass_extends_domain_entity._entityName).WithDocumentation("doc").WithBooleanProperty("Property1", "doc", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntitySubclass("NewSubclassName", When_domain_entity_subclass_extends_domain_entity._entityName).WithDocumentation("doc").WithBooleanProperty("Property2", "doc", true, false).WithEndDomainEntitySubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntitySubclassContext>(), { SuppliedRule: new DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests {
        /*[TestFixture]*/
        export class When_domain_entity_subclass_extends_abstract_entity extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_domain_entity_subclass_extends_abstract_entity._entityName).WithDocumentation("doc").WithStringIdentity("Property1", "doc", 100).WithEndAbstractEntity();
                metaEdTextBuilder.WithStartDomainEntitySubclass("NewSubclassName", When_domain_entity_subclass_extends_abstract_entity._entityName).WithDocumentation("doc").WithBooleanProperty("Property2", "doc", true, false).WithEndDomainEntitySubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntitySubclassContext>(), { SuppliedRule: new DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntityTests {
        /*[TestFixture]*/
        export class When_domain_entity_subclass_has_invalid_extendee extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected static _baseName: string = "NotAnDomainEntityIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntitySubclass(When_domain_entity_subclass_has_invalid_extendee._entityName, When_domain_entity_subclass_has_invalid_extendee._baseName).WithDocumentation("doc").WithBooleanProperty("Property1", "doc", true, false).WithEndDomainEntitySubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntitySubclassContext>(), { SuppliedRule: new DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("DomainEntity");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_invalid_extendee._entityName);
                _errorMessageCollection[0].Message.ShouldContain("based on");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_invalid_extendee._baseName);
                _errorMessageCollection[0].Message.ShouldContain("does not match");
            }
        }
    }
}