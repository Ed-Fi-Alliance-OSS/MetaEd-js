module MetaEd.Tests.Validator.DomainEntitySubclass {
    export class DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests {

    }
    export module DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests {
        /*[TestFixture]*/
        export class When_domain_entity_subclass_has_different_property_name extends ValidationRuleTestBase {
            protected static _entity_name: string = "SubclassIdentifier";
            protected static _base_name: string = "BaseDomainEntityIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_subclass_has_different_property_name._base_name).WithDocumentation("because documentation is required").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntitySubclass(When_domain_entity_subclass_has_different_property_name._entity_name, When_domain_entity_subclass_has_different_property_name._base_name).WithDocumentation("because documentation is required").WithBooleanProperty("Property2", "because a property is required", true, false).WithEndDomainEntitySubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntitySubclassContext>(), { SuppliedRule: new DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests {
        /*[TestFixture]*/
        export class When_domain_entity_subclass_has_duplicate_property_name extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected static _base_name: string = "BaseIdentifier";
            protected static _duplicate_property_name: string = "Property1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_subclass_has_duplicate_property_name._base_name).WithDocumentation("because documentation is required").WithBooleanProperty(When_domain_entity_subclass_has_duplicate_property_name._duplicate_property_name, "because a property is required", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntitySubclass(When_domain_entity_subclass_has_duplicate_property_name._entity_name, When_domain_entity_subclass_has_duplicate_property_name._base_name).WithDocumentation("because documentation is required").WithBooleanProperty(When_domain_entity_subclass_has_duplicate_property_name._duplicate_property_name, "because a property is required", true, false).WithEndDomainEntitySubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntitySubclassContext>(), { SuppliedRule: new DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("DomainEntity");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_duplicate_property_name._entity_name);
                _errorMessageCollection[0].Message.ShouldContain("based on");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_duplicate_property_name._base_name);
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_duplicate_property_name._duplicate_property_name);
                _errorMessageCollection[0].Message.ShouldContain("already in property list");
            }
        }
    }
    export module DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests {
        /*[TestFixture]*/
        export class When_domain_entity_subclass_has_multiple_duplicate_property_names extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected static _base_name: string = "BaseIdentifier";
            protected static _not_duplicate_property_name: string = "NotADuplicate";
            protected static _duplicate_property_name1: string = "Property1";
            protected static _duplicate_property_name2: string = "Property2";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_subclass_has_multiple_duplicate_property_names._base_name).WithDocumentation("because documentation is required").WithBooleanProperty(When_domain_entity_subclass_has_multiple_duplicate_property_names._duplicate_property_name1, "because a property is required", true, false).WithBooleanProperty(When_domain_entity_subclass_has_multiple_duplicate_property_names._duplicate_property_name2, "because a property is required", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntitySubclass(When_domain_entity_subclass_has_multiple_duplicate_property_names._entity_name, When_domain_entity_subclass_has_multiple_duplicate_property_names._base_name).WithDocumentation("because documentation is required").WithBooleanProperty(When_domain_entity_subclass_has_multiple_duplicate_property_names._duplicate_property_name1, "because a property is required", true, false).WithBooleanProperty(When_domain_entity_subclass_has_multiple_duplicate_property_names._duplicate_property_name2, "because a property is required", true, false).WithBooleanProperty(When_domain_entity_subclass_has_multiple_duplicate_property_names._not_duplicate_property_name, "because a property is required", true, false).WithEndDomainEntitySubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntitySubclassContext>(), { SuppliedRule: new DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("DomainEntity");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_multiple_duplicate_property_names._entity_name);
                _errorMessageCollection[0].Message.ShouldContain("based on");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_multiple_duplicate_property_names._base_name);
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_multiple_duplicate_property_names._duplicate_property_name1);
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_multiple_duplicate_property_names._duplicate_property_name2);
                _errorMessageCollection[0].Message.ShouldContain("already in property list");
                _errorMessageCollection[0].Message.ShouldNotContain(When_domain_entity_subclass_has_multiple_duplicate_property_names._not_duplicate_property_name);
            }
        }
    }
}