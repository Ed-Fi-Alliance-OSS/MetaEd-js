module MetaEd.Tests.Validator.DomainEntityExtension {
    export class DomainEntityExtensionExistsOnlyInExtensionNamespaceTests {

    }
    export module DomainEntityExtensionExistsOnlyInExtensionNamespaceTests {
        /*[TestFixture]*/
        export class When_domain_entity_extension_exists_in_extension extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected static _property_name: string = "Property1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_extension_exists_in_extension._entity_name).WithDocumentation("because documentation is required").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndDomainEntity().WithEndNamespace();
                metaEdTextBuilder.WithBeginNamespace("extension", "projectExtension").WithStartDomainEntityExtension(When_domain_entity_extension_exists_in_extension._entity_name).WithBooleanProperty("Property2", "because a property is required", true, false).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntityExtensionContext>(), { SuppliedRule: new DomainEntityExtensionExistsOnlyInExtensionNamespace() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module DomainEntityExtensionExistsOnlyInExtensionNamespaceTests {
        /*[TestFixture]*/
        export class When_domain_entity_extension_exists_in_core extends ValidationRuleTestBase {
            protected static _coreNamespace: string = "edfi";
            protected static _entity_name: string = "MyIdentifier";
            protected static _property_name: string = "Property1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace(When_domain_entity_extension_exists_in_core._coreNamespace).WithStartDomainEntity(When_domain_entity_extension_exists_in_core._entity_name).WithDocumentation("because documentation is required").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntityExtension(When_domain_entity_extension_exists_in_core._entity_name).WithBooleanProperty("Property2", "because a property is required", true, false).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntityExtensionContext>(), { SuppliedRule: new DomainEntityExtensionExistsOnlyInExtensionNamespace() });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Domain Entity additions");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_extension_exists_in_core._entity_name);
                _errorMessageCollection[0].Message.ShouldContain("is not valid in core namespace");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_extension_exists_in_core._coreNamespace);
            }
        }
    }
}