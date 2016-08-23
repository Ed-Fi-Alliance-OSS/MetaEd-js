module MetaEd.Tests.Validator.ReferenceProperty {
    export class ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests {

    }
    export module ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests {
        /*[TestFixture]*/
        export class When_reference_property_has_identifier_of_domain_entity extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_reference_property_has_identifier_of_domain_entity._entityName).WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntity("DomainEntity2").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithReferenceProperty(When_reference_property_has_identifier_of_domain_entity._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.ReferencePropertyContext>(), { SuppliedRule: new ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests {
        /*[TestFixture]*/
        export class When_reference_property_has_identifier_of_domain_entity_subclass extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntityBase").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntitySubclass(When_reference_property_has_identifier_of_domain_entity_subclass._entityName, "DomainEntityBase").WithDocumentation("doc").WithDateProperty("BeginDate", "doc", true, false).WithEndDomainEntitySubclass();
                metaEdTextBuilder.WithStartDomainEntity("DomainEntity2").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithReferenceProperty(When_reference_property_has_identifier_of_domain_entity_subclass._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.ReferencePropertyContext>(), { SuppliedRule: new ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests {
        /*[TestFixture]*/
        export class When_reference_property_has_identifier_of_association extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_reference_property_has_identifier_of_association._entityName).WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndAssociation();
                metaEdTextBuilder.WithStartDomainEntity("DomainEntity3").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithReferenceProperty(When_reference_property_has_identifier_of_association._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.ReferencePropertyContext>(), { SuppliedRule: new ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests {
        /*[TestFixture]*/
        export class When_reference_property_has_identifier_of_association_subclass extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation("BaseName").WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "doc", true, false).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationSubclass(When_reference_property_has_identifier_of_association_subclass._entityName, "BaseName").WithDocumentation("doc").WithBooleanProperty("Property2", "doc", true, false).WithEndAssociationSubclass();
                metaEdTextBuilder.WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithReferenceProperty(When_reference_property_has_identifier_of_association_subclass._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.ReferencePropertyContext>(), { SuppliedRule: new ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests {
        /*[TestFixture]*/
        export class When_reference_property_has_identifier_of_abstract_entity extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_reference_property_has_identifier_of_abstract_entity._entityName).WithDocumentation("doc").WithStringIdentity("Property1", "doc", 100).WithEndAbstractEntity();
                metaEdTextBuilder.WithStartDomainEntity("DomainEntity2").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithReferenceProperty(When_reference_property_has_identifier_of_abstract_entity._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.ReferencePropertyContext>(), { SuppliedRule: new ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstractTests {
        /*[TestFixture]*/
        export class When_reference_property_has_invalid_identifier extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithReferenceProperty(When_reference_property_has_invalid_identifier._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.ReferencePropertyContext>(), { SuppliedRule: new ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Reference");
                _errorMessageCollection[0].Message.ShouldContain(When_reference_property_has_invalid_identifier._entityName);
                _errorMessageCollection[0].Message.ShouldContain("does not match");
            }
        }
    }
}