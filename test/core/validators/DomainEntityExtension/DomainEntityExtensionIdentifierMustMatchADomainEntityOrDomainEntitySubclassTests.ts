module MetaEd.Tests.Validator.DomainEntityExtension {
    export class DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclassTests {

    }
    export module DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclassTests {
        /*[TestFixture]*/
        export class When_domain_entity_extension_has_valid_extendee extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected static _property_name: string = "Property1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_extension_has_valid_extendee._entity_name).WithDocumentation("because documentation is required").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntityExtension(When_domain_entity_extension_has_valid_extendee._entity_name).WithBooleanProperty("Property2", "because a property is required", true, false).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntityExtensionContext>(), { SuppliedRule: new DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclassTests {
        /*[TestFixture]*/
        export class When_domain_entity_extension_has_invalid_extendee extends ValidationRuleTestBase {
            protected static _entity_name: string = "NotADomainEntityIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntityExtension(When_domain_entity_extension_has_invalid_extendee._entity_name).WithBooleanProperty("Property2", "because a property is required", false, false).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntityExtensionContext>(), { SuppliedRule: new DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Domain Entity additions");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_extension_has_invalid_extendee._entity_name);
                _errorMessageCollection[0].Message.ShouldContain("does not match");
            }
        }
    }
    export module DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclassTests {
        /*[TestFixture]*/
        export class When_domain_entity_extension_extends_domain_entity_subclass extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected static _subclass_name: string = "MyIdentifierSubclass";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_extension_extends_domain_entity_subclass._entity_name).WithDocumentation("because documentation is required").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntitySubclass(When_domain_entity_extension_extends_domain_entity_subclass._subclass_name, When_domain_entity_extension_extends_domain_entity_subclass._entity_name).WithDocumentation("because documentation is required").WithBooleanProperty("Property2", "because a property is required", true, false).WithEndDomainEntitySubclass();
                metaEdTextBuilder.WithStartDomainEntityExtension(When_domain_entity_extension_extends_domain_entity_subclass._subclass_name).WithBooleanProperty("Property3", "because a property is required", true, false).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntityExtensionContext>(), { SuppliedRule: new DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclassTests {
        /*[TestFixture]*/
        export class When_domain_entity_extension_extends_abstract_domain_entity extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_domain_entity_extension_extends_abstract_domain_entity._entity_name).WithDocumentation("because documentation is required").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndAbstractEntity();
                metaEdTextBuilder.WithStartDomainEntityExtension(When_domain_entity_extension_extends_abstract_domain_entity._entity_name).WithBooleanProperty("Property2", "because a property is required", true, false).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntityExtensionContext>(), { SuppliedRule: new DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Domain Entity additions");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_extension_extends_abstract_domain_entity._entity_name);
                _errorMessageCollection[0].Message.ShouldContain("does not match");
            }
        }
    }
}