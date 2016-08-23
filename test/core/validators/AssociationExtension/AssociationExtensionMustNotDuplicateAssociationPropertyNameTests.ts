module MetaEd.Tests.Validator.AssociationExtension {
    export class AssociationExtensionMustNotDuplicateAssociationPropertyNameTests {

    }
    export module AssociationExtensionMustNotDuplicateAssociationPropertyNameTests {
        /*[TestFixture]*/
        export class When_association_extension_has_different_property_name extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_extension_has_different_property_name._entity_name).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationExtension(When_association_extension_has_different_property_name._entity_name).WithBooleanProperty("Property2", "because a property is required", true, false).WithEndAssociationExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationExtensionContext>(), { SuppliedRule: new AssociationExtensionMustNotDuplicateAssociationPropertyName(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module AssociationExtensionMustNotDuplicateAssociationPropertyNameTests {
        /*[TestFixture]*/
        export class When_association_extension_has_duplicate_property_name extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected static _duplicate_property_name: string = "Property1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_extension_has_duplicate_property_name._entity_name).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty(When_association_extension_has_duplicate_property_name._duplicate_property_name, "because a property is required", true, false).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationExtension(When_association_extension_has_duplicate_property_name._entity_name).WithBooleanProperty(When_association_extension_has_duplicate_property_name._duplicate_property_name, "because a property is required", true, false).WithEndAssociationExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationExtensionContext>(), { SuppliedRule: new AssociationExtensionMustNotDuplicateAssociationPropertyName(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Association additions");
                _errorMessageCollection[0].Message.ShouldContain(When_association_extension_has_duplicate_property_name._entity_name);
                _errorMessageCollection[0].Message.ShouldContain(When_association_extension_has_duplicate_property_name._duplicate_property_name);
                _errorMessageCollection[0].Message.ShouldContain("already in property list");
            }
        }
    }
    export module AssociationExtensionMustNotDuplicateAssociationPropertyNameTests {
        /*[TestFixture]*/
        export class When_association_extension_has_multiple_association_names extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected static _not_duplicate_property_name: string = "NotADuplicate";
            protected static _duplicate_property_name1: string = "Property1";
            protected static _duplicate_property_name2: string = "Property2";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_extension_has_multiple_association_names._entity_name).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty(When_association_extension_has_multiple_association_names._duplicate_property_name1, "because a property is required", true, false).WithBooleanProperty(When_association_extension_has_multiple_association_names._duplicate_property_name2, "because a property is required", true, false).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationExtension(When_association_extension_has_multiple_association_names._entity_name).WithBooleanProperty(When_association_extension_has_multiple_association_names._duplicate_property_name1, "because a property is required", true, false).WithBooleanProperty(When_association_extension_has_multiple_association_names._duplicate_property_name2, "because a property is required", true, false).WithBooleanProperty(When_association_extension_has_multiple_association_names._not_duplicate_property_name, "because a property is required", true, false).WithEndAssociationExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationExtensionContext>(), { SuppliedRule: new AssociationExtensionMustNotDuplicateAssociationPropertyName(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Association additions");
                _errorMessageCollection[0].Message.ShouldContain(When_association_extension_has_multiple_association_names._entity_name);
                _errorMessageCollection[0].Message.ShouldContain(When_association_extension_has_multiple_association_names._duplicate_property_name1);
                _errorMessageCollection[0].Message.ShouldContain(When_association_extension_has_multiple_association_names._duplicate_property_name2);
                _errorMessageCollection[0].Message.ShouldContain("already in property list");
                _errorMessageCollection[0].Message.ShouldNotContain(When_association_extension_has_multiple_association_names._not_duplicate_property_name);
            }
        }
    }
    export module AssociationExtensionMustNotDuplicateAssociationPropertyNameTests {
        /*[TestFixture]*/
        export class When_association_extension_has_duplicate_include_property extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected static _duplicate_property_name: string = "Property1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_extension_has_duplicate_include_property._entity_name).WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithIncludeProperty(When_association_extension_has_duplicate_include_property._duplicate_property_name, "doc", true, false).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationExtension(When_association_extension_has_duplicate_include_property._entity_name).WithIncludeProperty(When_association_extension_has_duplicate_include_property._duplicate_property_name, "doc", true, false).WithEndAssociationExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationExtensionContext>(), { SuppliedRule: new AssociationExtensionMustNotDuplicateAssociationPropertyName(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
        }
    }
    export module AssociationExtensionMustNotDuplicateAssociationPropertyNameTests {
        /*[TestFixture]*/
        export class When_association_extension_has_duplicate_include_extension_override_property extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected static _duplicate_property_name: string = "Property1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_extension_has_duplicate_include_extension_override_property._entity_name).WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithIncludeProperty(When_association_extension_has_duplicate_include_extension_override_property._duplicate_property_name, "doc", true, false).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationExtension(When_association_extension_has_duplicate_include_extension_override_property._entity_name).WithIncludeExtensionOverrideProperty(When_association_extension_has_duplicate_include_extension_override_property._duplicate_property_name, "doc", true, false).WithEndAssociationExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationExtensionContext>(), { SuppliedRule: new AssociationExtensionMustNotDuplicateAssociationPropertyName(_symbolTable) });
            }
            public should_not_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeFalse();
            }
        }
    }
}