module MetaEd.Tests.Validator.DomainEntityExtension {
    export class DomainEntityExtensionMustNotDuplicateDomainEntityPropertyNameTests {

    }
    export module DomainEntityExtensionMustNotDuplicateDomainEntityPropertyNameTests {
        /*[TestFixture]*/
        export class When_domain_entity_extension_has_different_property_name extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_extension_has_different_property_name._entity_name).WithDocumentation("because documentation is required").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntityExtension(When_domain_entity_extension_has_different_property_name._entity_name).WithBooleanProperty("Property2", "because a property is required", true, false).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntityExtensionContext>(), { SuppliedRule: new DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module DomainEntityExtensionMustNotDuplicateDomainEntityPropertyNameTests {
        /*[TestFixture]*/
        export class When_domain_entity_extension_has_duplicate_property_name extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected static _duplicate_property_name: string = "Property1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_extension_has_duplicate_property_name._entity_name).WithDocumentation("because documentation is required").WithBooleanProperty(When_domain_entity_extension_has_duplicate_property_name._duplicate_property_name, "because a property is required", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntityExtension(When_domain_entity_extension_has_duplicate_property_name._entity_name).WithBooleanProperty(When_domain_entity_extension_has_duplicate_property_name._duplicate_property_name, "because a property is required", true, false).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntityExtensionContext>(), { SuppliedRule: new DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Domain Entity additions");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_extension_has_duplicate_property_name._entity_name);
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_extension_has_duplicate_property_name._duplicate_property_name);
                _errorMessageCollection[0].Message.ShouldContain("already in property list");
            }
        }
    }
    export module DomainEntityExtensionMustNotDuplicateDomainEntityPropertyNameTests {
        /*[TestFixture]*/
        export class When_domain_entity_extension_has_multiple_duplicate_property_names extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected static _not_duplicate_property_name: string = "NotADuplicate";
            protected static _duplicate_property_name1: string = "Property1";
            protected static _duplicate_property_name2: string = "Property2";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_extension_has_multiple_duplicate_property_names._entity_name).WithDocumentation("because documentation is required").WithBooleanProperty(When_domain_entity_extension_has_multiple_duplicate_property_names._duplicate_property_name1, "because a property is required", true, false).WithBooleanProperty(When_domain_entity_extension_has_multiple_duplicate_property_names._duplicate_property_name2, "because a property is required", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntityExtension(When_domain_entity_extension_has_multiple_duplicate_property_names._entity_name).WithBooleanProperty(When_domain_entity_extension_has_multiple_duplicate_property_names._duplicate_property_name1, "because a property is required", true, false).WithBooleanProperty(When_domain_entity_extension_has_multiple_duplicate_property_names._duplicate_property_name2, "because a property is required", true, false).WithBooleanProperty(When_domain_entity_extension_has_multiple_duplicate_property_names._not_duplicate_property_name, "because a property is required", true, false).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntityExtensionContext>(), { SuppliedRule: new DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Domain Entity additions");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_extension_has_multiple_duplicate_property_names._entity_name);
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_extension_has_multiple_duplicate_property_names._duplicate_property_name1);
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_extension_has_multiple_duplicate_property_names._duplicate_property_name2);
                _errorMessageCollection[0].Message.ShouldContain("already in property list");
                _errorMessageCollection[0].Message.ShouldNotContain(When_domain_entity_extension_has_multiple_duplicate_property_names._not_duplicate_property_name);
            }
        }
    }
    export module DomainEntityExtensionMustNotDuplicateDomainEntityPropertyNameTests {
        /*[TestFixture]*/
        export class When_domain_entity_extension_has_duplicate_include_property extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected static _duplicate_property_name: string = "Property1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_extension_has_duplicate_include_property._entity_name).WithDocumentation("doc").WithIncludeProperty(When_domain_entity_extension_has_duplicate_include_property._duplicate_property_name, "doc", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntityExtension(When_domain_entity_extension_has_duplicate_include_property._entity_name).WithIncludeProperty(When_domain_entity_extension_has_duplicate_include_property._duplicate_property_name, "doc", true, false).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntityExtensionContext>(), { SuppliedRule: new DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
        }
    }
    export module DomainEntityExtensionMustNotDuplicateDomainEntityPropertyNameTests {
        /*[TestFixture]*/
        export class When_domain_entity_extension_has_duplicate_include_extension_override_property extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected static _duplicate_property_name: string = "Property1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_extension_has_duplicate_include_extension_override_property._entity_name).WithDocumentation("doc").WithIncludeProperty(When_domain_entity_extension_has_duplicate_include_extension_override_property._duplicate_property_name, "doc", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntityExtension(When_domain_entity_extension_has_duplicate_include_extension_override_property._entity_name).WithIncludeExtensionOverrideProperty(When_domain_entity_extension_has_duplicate_include_extension_override_property._duplicate_property_name, "doc", true, false).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntityExtensionContext>(), { SuppliedRule: new DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName(_symbolTable) });
            }
            public should_not_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeFalse();
            }
        }
    }
}