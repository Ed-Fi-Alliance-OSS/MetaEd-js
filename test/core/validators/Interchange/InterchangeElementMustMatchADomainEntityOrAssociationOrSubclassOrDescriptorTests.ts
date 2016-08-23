module MetaEd.Tests.Validator.Interchange {
    export class InterchangeElementMustMatchADomainEntityOrAssociationOrSubclassOrDescriptorTests {

    }
    export module InterchangeElementMustMatchADomainEntityOrAssociationOrSubclassOrDescriptorTests {
        /*[TestFixture]*/
        export class When_element_is_domain_entity extends ValidationRuleTestBase {
            protected static _entityName: string = "EntityName";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_element_is_domain_entity._entityName).WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartInterchange("InterchangeName").WithDocumentation("doc").WithElement(When_element_is_domain_entity._entityName).WithEndInterchange().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.InterchangeElementContext>(), { SuppliedRule: new InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module InterchangeElementMustMatchADomainEntityOrAssociationOrSubclassOrDescriptorTests {
        /*[TestFixture]*/
        export class When_element_is_domain_entity_subclass extends ValidationRuleTestBase {
            protected static _entityName: string = "EntityName";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntityBase").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntitySubclass(When_element_is_domain_entity_subclass._entityName, "DomainEntityBase").WithDocumentation("doc").WithDateProperty("BeginDate", "doc", true, false).WithEndDomainEntitySubclass();
                metaEdTextBuilder.WithStartInterchange("InterchangeName").WithDocumentation("doc").WithElement(When_element_is_domain_entity_subclass._entityName).WithEndInterchange().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.InterchangeElementContext>(), { SuppliedRule: new InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module InterchangeElementMustMatchADomainEntityOrAssociationOrSubclassOrDescriptorTests {
        /*[TestFixture]*/
        export class When_element_is_association extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_element_is_association._entityName).WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndAssociation();
                metaEdTextBuilder.WithStartInterchange("InterchangeName").WithDocumentation("doc").WithElement(When_element_is_association._entityName).WithEndInterchange().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.InterchangeElementContext>(), { SuppliedRule: new InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module InterchangeElementMustMatchADomainEntityOrAssociationOrSubclassOrDescriptorTests {
        /*[TestFixture]*/
        export class When_element_is_association_subclass extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation("BaseName").WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "doc", true, false).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationSubclass(When_element_is_association_subclass._entityName, "BaseName").WithDocumentation("doc").WithBooleanProperty("Property2", "doc", true, false).WithEndAssociationSubclass();
                metaEdTextBuilder.WithStartInterchange("InterchangeName").WithDocumentation("doc").WithElement(When_element_is_association_subclass._entityName).WithEndInterchange().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.InterchangeElementContext>(), { SuppliedRule: new InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module InterchangeElementMustMatchADomainEntityOrAssociationOrSubclassOrDescriptorTests {
        /*[TestFixture]*/
        export class When_element_is_descriptor extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDescriptor(When_element_is_descriptor._entityName).WithDocumentation("doc").WithStartMapType().WithDocumentation("map type doc").WithEnumerationItem("this is short description 1", "doc1").WithEndMapType().WithEndDescriptor();
                metaEdTextBuilder.WithStartInterchange("InterchangeName").WithDocumentation("doc").WithElement(When_element_is_descriptor._entityName).WithEndInterchange().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.InterchangeElementContext>(), { SuppliedRule: new InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass(_symbolTable) });
            }
            public should_not_validate(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
        }
    }
    export module InterchangeElementMustMatchADomainEntityOrAssociationOrSubclassOrDescriptorTests {
        /*[TestFixture]*/
        export class When_element_has_invalid_identifier extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInterchange("InterchangeName").WithDocumentation("doc").WithElement(When_element_has_invalid_identifier._entityName).WithEndInterchange().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.InterchangeElementContext>(), { SuppliedRule: new InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("element");
                _errorMessageCollection[0].Message.ShouldContain(When_element_has_invalid_identifier._entityName);
                _errorMessageCollection[0].Message.ShouldContain("does not match");
            }
        }
    }
}