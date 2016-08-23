module MetaEd.Tests.Validator.AssociationSubclass {
    export class AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClassTests {

    }
    export module AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClassTests {
        /*[TestFixture]*/
        export class When_association_subclass_renames_base_identity extends ValidationRuleTestBase {
            protected static _entity_name: string = "SubclassIdentifier";
            protected static _base_name: string = "BaseAssociationIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_subclass_renames_base_identity._base_name).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithStringIdentity("Property1", "because a property is required", 100).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationSubclass(When_association_subclass_renames_base_identity._entity_name, When_association_subclass_renames_base_identity._base_name).WithDocumentation("because documentation is required").WithStringIdentityRename("Property2", "Property1", "because a property is required", 100).WithEndAssociationSubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationSubclassContext>(), { SuppliedRule: new AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.ShouldBeEmpty();
            }
        }
    }
    export module AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClassTests {
        /*[TestFixture]*/
        export class When_association_subclass_does_not_rename_identity extends ValidationRuleTestBase {
            protected static _entity_name: string = "SubclassIdentifier";
            protected static _base_name: string = "BaseAssociationIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_subclass_does_not_rename_identity._base_name).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithStringIdentity("Property1", "because a property is required", 100).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationSubclass(When_association_subclass_does_not_rename_identity._entity_name, When_association_subclass_does_not_rename_identity._base_name).WithDocumentation("because documentation is required").WithStringProperty("Property2", "because a property is required", true, false, 100).WithEndAssociationSubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationSubclassContext>(), { SuppliedRule: new AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.ShouldBeEmpty();
            }
        }
    }
    export module AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClassTests {
        /*[TestFixture]*/
        export class When_association_subclass_renames_base_identity_more_than_once extends ValidationRuleTestBase {
            protected static _entity_name: string = "SubclassIdentifier";
            protected static _base_name: string = "BaseAssociationIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_subclass_renames_base_identity_more_than_once._base_name).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithStringIdentity("Property1", "because a property is required", 100).WithStringIdentity("Property2", "because a property is required", 100).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationSubclass(When_association_subclass_renames_base_identity_more_than_once._entity_name, When_association_subclass_renames_base_identity_more_than_once._base_name).WithDocumentation("because documentation is required").WithStringIdentityRename("Property3", "Property1", "because a property is required", 100).WithStringIdentityRename("Property4", "Property2", "because a property is required", 100).WithEndAssociationSubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationSubclassContext>(), { SuppliedRule: new AssociationSubclassIdentityRenameMustExistNoMoreThanOnce() });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.ShouldNotBeEmpty();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldEqual("Association 'SubclassIdentifier' based on 'BaseAssociationIdentifier' tries to rename columns Property1, Property2.  Only one identity rename is allowed for a given Association.");
            }
        }
    }
    export module AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClassTests {
        /*[TestFixture]*/
        export class When_association_subclass_renames_base_identity_that_does_not_exist extends ValidationRuleTestBase {
            protected static _entity_name: string = "SubclassIdentifier";
            protected static _base_name: string = "BaseAssociationIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_subclass_renames_base_identity_that_does_not_exist._base_name).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithStringIdentity("Property1", "because a property is required", 100).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationSubclass(When_association_subclass_renames_base_identity_that_does_not_exist._entity_name, When_association_subclass_renames_base_identity_that_does_not_exist._base_name).WithDocumentation("because documentation is required").WithStringIdentityRename("Property2", "Property3", "because a property is required", 100).WithEndAssociationSubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationSubclassContext>(), { SuppliedRule: new AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(_symbolTable) });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.ShouldNotBeEmpty();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldEqual("Association 'SubclassIdentifier' based on 'BaseAssociationIdentifier' tries to rename Property3 which is not part of the identity.");
            }
        }
    }
    export module AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClassTests {
        /*[TestFixture]*/
        export class When_association_subclass_renames_base_property_that_is_not_identity extends ValidationRuleTestBase {
            protected static _entity_name: string = "SubclassIdentifier";
            protected static _base_name: string = "BaseAssociationIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_subclass_renames_base_property_that_is_not_identity._base_name).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithStringProperty("Property1", "because a property is required", true, false, 100).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationSubclass(When_association_subclass_renames_base_property_that_is_not_identity._entity_name, When_association_subclass_renames_base_property_that_is_not_identity._base_name).WithDocumentation("because documentation is required").WithStringIdentityRename("Property2", "Property1", "because a property is required", 100).WithEndAssociationSubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationSubclassContext>(), { SuppliedRule: new AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(_symbolTable) });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.ShouldNotBeEmpty();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldEqual("Association 'SubclassIdentifier' based on 'BaseAssociationIdentifier' tries to rename Property1 which is not part of the identity.");
            }
        }
    }
    export module AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClassTests {
        /*[TestFixture]*/
        export class When_association_subclass_extends_non_existent_entity extends ValidationRuleTestBase {
            protected static _entity_name: string = "SubclassIdentifier";
            protected static _base_name: string = "BaseAssociationIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociationSubclass(When_association_subclass_extends_non_existent_entity._entity_name, When_association_subclass_extends_non_existent_entity._base_name).WithDocumentation("because documentation is required").WithStringIdentityRename("Property2", "Property1", "because a property is required", 100).WithEndAssociationSubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationSubclassContext>(), { SuppliedRule: new AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.ShouldBeEmpty();
            }
        }
    }
}