module MetaEd.Tests.Validator.AssociationExtension {
    export class AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests {

    }
    export module AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests {
        /*[TestFixture]*/
        export class When_association_extension_has_valid_extendee extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected static _property_name: string = "Property1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_extension_has_valid_extendee._entity_name).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationExtension(When_association_extension_has_valid_extendee._entity_name).WithBooleanProperty("Property2", "because a property is required", true, false).WithEndAssociationExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationExtensionContext>(), { SuppliedRule: new AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests {
        /*[TestFixture]*/
        export class When_association_extension_has_invalid_extendee extends ValidationRuleTestBase {
            protected static _entity_name: string = "NotAnAssociationIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociationExtension(When_association_extension_has_invalid_extendee._entity_name).WithBooleanProperty("Property2", "because a property is required", false, false).WithEndAssociationExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationExtensionContext>(), { SuppliedRule: new AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Association additions");
                _errorMessageCollection[0].Message.ShouldContain(When_association_extension_has_invalid_extendee._entity_name);
                _errorMessageCollection[0].Message.ShouldContain("does not match");
            }
        }
    }
    export module AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclassTests {
        /*[TestFixture]*/
        export class When_association_extension_extends_association_subclass extends ValidationRuleTestBase {
            protected static _entity_name: string = "MyIdentifier";
            protected static _subclass_name: string = "MyIdentifierSubclass";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_extension_extends_association_subclass._entity_name).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationSubclass(When_association_extension_extends_association_subclass._subclass_name, When_association_extension_extends_association_subclass._entity_name).WithDocumentation("because documentation is required").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndAssociationSubclass();
                metaEdTextBuilder.WithStartAssociationExtension(When_association_extension_extends_association_subclass._subclass_name).WithBooleanProperty("Property2", "because a property is required", true, false).WithEndAssociationExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationExtensionContext>(), { SuppliedRule: new AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
}