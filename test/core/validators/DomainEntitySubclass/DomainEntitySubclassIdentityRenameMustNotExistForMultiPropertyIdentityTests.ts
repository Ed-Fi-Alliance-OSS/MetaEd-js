module MetaEd.Tests.Validator.DomainEntitySubclass {
    export class DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentityTests {

    }
    export module DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentityTests {
        /*[TestFixture]*/
        export class When_domain_entity_subclass_renames_base_identity extends ValidationRuleTestBase {
            protected static _entity_name: string = "SubclassIdentifier";
            protected static _base_name: string = "BaseDomainEntityIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_subclass_renames_base_identity._base_name).WithDocumentation("because documentation is required").WithStringIdentity("Property1", "because a property is required", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntitySubclass(When_domain_entity_subclass_renames_base_identity._entity_name, When_domain_entity_subclass_renames_base_identity._base_name).WithDocumentation("because documentation is required").WithStringIdentityRename("Property2", "Property1", "because a property is required", 100).WithEndDomainEntitySubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntitySubclassContext>(), { SuppliedRule: new DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.ShouldBeEmpty();
            }
        }
    }
    export module DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentityTests {
        /*[TestFixture]*/
        export class When_domain_entity_subclass_does_not_rename_identity extends ValidationRuleTestBase {
            protected static _entity_name: string = "SubclassIdentifier";
            protected static _base_name: string = "BaseDomainEntityIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_subclass_does_not_rename_identity._base_name).WithDocumentation("because documentation is required").WithStringIdentity("Property1", "because a property is required", 100).WithStringIdentity("Property2", "because a property is required", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntitySubclass(When_domain_entity_subclass_does_not_rename_identity._entity_name, When_domain_entity_subclass_does_not_rename_identity._base_name).WithDocumentation("because documentation is required").WithStringProperty("Property3", "because a property is required", true, false, 100).WithEndDomainEntitySubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntitySubclassContext>(), { SuppliedRule: new DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.ShouldBeEmpty();
            }
        }
    }
    export module DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentityTests {
        /*[TestFixture]*/
        export class When_domain_entity_subclass_renames_base_identity_more_than_once extends ValidationRuleTestBase {
            protected static _entity_name: string = "SubclassIdentifier";
            protected static _base_name: string = "BaseDomainEntityIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_subclass_renames_base_identity_more_than_once._base_name).WithDocumentation("because documentation is required").WithStringIdentity("Property1", "because a property is required", 100).WithStringIdentity("Property2", "because a property is required", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntitySubclass(When_domain_entity_subclass_renames_base_identity_more_than_once._entity_name, When_domain_entity_subclass_renames_base_identity_more_than_once._base_name).WithDocumentation("because documentation is required").WithStringIdentityRename("Property3", "Property1", "because a property is required", 100).WithStringIdentityRename("Property4", "Property2", "because a property is required", 100).WithEndDomainEntitySubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntitySubclassContext>(), { SuppliedRule: new DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity(_symbolTable) });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.ShouldNotBeEmpty();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Domain Entity");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_renames_base_identity_more_than_once._entity_name);
                _errorMessageCollection[0].Message.ShouldContain("based on");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_renames_base_identity_more_than_once._base_name);
                _errorMessageCollection[0].Message.ShouldContain("is invalid for identity rename");
                _errorMessageCollection[0].Message.ShouldContain("has more than one identity property");
            }
        }
    }
    export module DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentityTests {
        /*[TestFixture]*/
        export class When_domain_entity_subclass_extends_non_existant_entity extends ValidationRuleTestBase {
            protected static _entity_name: string = "SubclassIdentifier";
            protected static _base_name: string = "BaseDomainEntityIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntitySubclass(When_domain_entity_subclass_extends_non_existant_entity._entity_name, When_domain_entity_subclass_extends_non_existant_entity._base_name).WithDocumentation("because documentation is required").WithStringIdentityRename("Property2", "Property3", "because a property is required", 100).WithEndDomainEntitySubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntitySubclassContext>(), { SuppliedRule: new DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.ShouldBeEmpty();
            }
        }
    }
}