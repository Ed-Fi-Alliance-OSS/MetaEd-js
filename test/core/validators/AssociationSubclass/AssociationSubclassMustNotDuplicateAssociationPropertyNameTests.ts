module MetaEd.Tests.Validator.AssociationSubclass {
    export class AssociationSubclassMustNotDuplicateAssociationPropertyNameTests {

    }
    export module AssociationSubclassMustNotDuplicateAssociationPropertyNameTests {
        /*[TestFixture]*/
        export class When_association_subclass_has_different_property_name extends ValidationRuleTestBase {
            protected static _entity_name: string = "SubclassIdentifier";
            protected static _base_name: string = "BaseAssociationIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_subclass_has_different_property_name._base_name).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationSubclass(When_association_subclass_has_different_property_name._entity_name, When_association_subclass_has_different_property_name._base_name).WithDocumentation("because documentation is required").WithBooleanProperty("Property2", "because a property is required", true, false).WithEndAssociationSubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationSubclassContext>(), { SuppliedRule: new AssociationSubclassMustNotDuplicateAssociationPropertyName(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module AssociationSubclassMustNotDuplicateAssociationPropertyNameTests {
        /*[TestFixture]*/
        export class When_association_subclass_has_duplicate_property_name extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected static _base_name: string = "BaseIdentifier";
            protected static _duplicate_property_name: string = "Property1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_subclass_has_duplicate_property_name._base_name).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty(When_association_subclass_has_duplicate_property_name._duplicate_property_name, "because a property is required", true, false).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationSubclass(When_association_subclass_has_duplicate_property_name._entity_name, When_association_subclass_has_duplicate_property_name._base_name).WithDocumentation("because documentation is required").WithBooleanProperty(When_association_subclass_has_duplicate_property_name._duplicate_property_name, "because a property is required", true, false).WithEndAssociationSubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationSubclassContext>(), { SuppliedRule: new AssociationSubclassMustNotDuplicateAssociationPropertyName(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Association");
                _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_duplicate_property_name._entity_name);
                _errorMessageCollection[0].Message.ShouldContain("based on");
                _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_duplicate_property_name._base_name);
                _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_duplicate_property_name._duplicate_property_name);
                _errorMessageCollection[0].Message.ShouldContain("already in property list");
            }
        }
    }
    export module AssociationSubclassMustNotDuplicateAssociationPropertyNameTests {
        /*[TestFixture]*/
        export class When_association_subclass_has_multiple_duplicate_property_names extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected static _base_name: string = "BaseIdentifier";
            protected static _not_duplicate_property_name: string = "NotADuplicate";
            protected static _duplicate_property_name1: string = "Property1";
            protected static _duplicate_property_name2: string = "Property2";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_subclass_has_multiple_duplicate_property_names._base_name).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty(When_association_subclass_has_multiple_duplicate_property_names._duplicate_property_name1, "because a property is required", true, false).WithBooleanProperty(When_association_subclass_has_multiple_duplicate_property_names._duplicate_property_name2, "because a property is required", true, false).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationSubclass(When_association_subclass_has_multiple_duplicate_property_names._entity_name, When_association_subclass_has_multiple_duplicate_property_names._base_name).WithDocumentation("because documentation is required").WithBooleanProperty(When_association_subclass_has_multiple_duplicate_property_names._duplicate_property_name1, "because a property is required", true, false).WithBooleanProperty(When_association_subclass_has_multiple_duplicate_property_names._duplicate_property_name2, "because a property is required", true, false).WithBooleanProperty(When_association_subclass_has_multiple_duplicate_property_names._not_duplicate_property_name, "because a property is required", true, false).WithEndAssociationSubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationSubclassContext>(), { SuppliedRule: new AssociationSubclassMustNotDuplicateAssociationPropertyName(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Association");
                _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_multiple_duplicate_property_names._entity_name);
                _errorMessageCollection[0].Message.ShouldContain("based on");
                _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_multiple_duplicate_property_names._base_name);
                _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_multiple_duplicate_property_names._duplicate_property_name1);
                _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_multiple_duplicate_property_names._duplicate_property_name2);
                _errorMessageCollection[0].Message.ShouldContain("already in property list");
                _errorMessageCollection[0].Message.ShouldNotContain(When_association_subclass_has_multiple_duplicate_property_names._not_duplicate_property_name);
            }
        }
    }
}