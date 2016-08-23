module MetaEd.Tests.Validator.AssociationSubclass {
    export class AssociationSubclassIdentifierMustMatchAnAssociationTests {

    }
    export module AssociationSubclassIdentifierMustMatchAnAssociationTests {
        /*[TestFixture]*/
        export class When_association_subclass_has_valid_extendee extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_subclass_has_valid_extendee._entityName).WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "doc", true, false).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationSubclass("NewSubclass", When_association_subclass_has_valid_extendee._entityName).WithDocumentation("doc").WithBooleanProperty("Property2", "doc", true, false).WithEndAssociationSubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationSubclassContext>(), { SuppliedRule: new AssociationSubclassIdentifierMustMatchAnAssociation(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module AssociationSubclassIdentifierMustMatchAnAssociationTests {
        /*[TestFixture]*/
        export class When_association_subclass_has_invalid_extendee extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected static _baseName: string = "NotAnAssociationIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociationSubclass(When_association_subclass_has_invalid_extendee._entityName, When_association_subclass_has_invalid_extendee._baseName).WithDocumentation("doc").WithBooleanProperty("Property1", "doc", true, false).WithEndAssociationSubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationSubclassContext>(), { SuppliedRule: new AssociationSubclassIdentifierMustMatchAnAssociation(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Association");
                _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_invalid_extendee._entityName);
                _errorMessageCollection[0].Message.ShouldContain("based on");
                _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_invalid_extendee._baseName);
                _errorMessageCollection[0].Message.ShouldContain("does not match");
            }
        }
    }
}