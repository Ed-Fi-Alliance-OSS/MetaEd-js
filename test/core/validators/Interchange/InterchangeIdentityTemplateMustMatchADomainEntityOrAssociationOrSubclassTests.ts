module MetaEd.Tests.Validator.Interchange {
    export class InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclassTests {

    }
    export module InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclassTests {
        /*[TestFixture]*/
        export class When_identity_template_is_domain_entity extends ValidationRuleTestBase {
            protected static _entityName: string = "EntityName";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_identity_template_is_domain_entity._entityName).WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartInterchange("InterchangeName").WithDocumentation("doc").WithIdentityTemplate(When_identity_template_is_domain_entity._entityName).WithElement("Required").WithEndInterchange().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.InterchangeIdentityTemplateContext>(), { SuppliedRule: new InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclassTests {
        /*[TestFixture]*/
        export class When_identity_template_is_domain_entity_subclass extends ValidationRuleTestBase {
            protected static _entityName: string = "EntityName";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntityBase").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntitySubclass(When_identity_template_is_domain_entity_subclass._entityName, "DomainEntityBase").WithDocumentation("doc").WithDateProperty("BeginDate", "doc", true, false).WithEndDomainEntitySubclass();
                metaEdTextBuilder.WithStartInterchange("InterchangeName").WithDocumentation("doc").WithIdentityTemplate(When_identity_template_is_domain_entity_subclass._entityName).WithElement("Required").WithEndInterchange().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.InterchangeIdentityTemplateContext>(), { SuppliedRule: new InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclassTests {
        /*[TestFixture]*/
        export class When_identity_template_is_association extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_identity_template_is_association._entityName).WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndAssociation();
                metaEdTextBuilder.WithStartInterchange("InterchangeName").WithDocumentation("doc").WithIdentityTemplate(When_identity_template_is_association._entityName).WithElement("Required").WithEndInterchange().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.InterchangeIdentityTemplateContext>(), { SuppliedRule: new InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclassTests {
        /*[TestFixture]*/
        export class When_identity_template_is_association_subclass extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation("BaseName").WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "doc", true, false).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationSubclass(When_identity_template_is_association_subclass._entityName, "BaseName").WithDocumentation("doc").WithBooleanProperty("Property2", "doc", true, false).WithEndAssociationSubclass();
                metaEdTextBuilder.WithStartInterchange("InterchangeName").WithDocumentation("doc").WithIdentityTemplate(When_identity_template_is_association_subclass._entityName).WithElement("Required").WithEndInterchange().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.InterchangeIdentityTemplateContext>(), { SuppliedRule: new InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclassTests {
        /*[TestFixture]*/
        export class When_identity_template_is_abstract_entity extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_identity_template_is_abstract_entity._entityName).WithDocumentation("doc").WithStringIdentity("Property1", "doc", 100).WithEndAbstractEntity();
                metaEdTextBuilder.WithStartInterchange("InterchangeName").WithDocumentation("doc").WithIdentityTemplate(When_identity_template_is_abstract_entity._entityName).WithElement("Required").WithEndInterchange().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.InterchangeIdentityTemplateContext>(), { SuppliedRule: new InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclassTests {
        /*[TestFixture]*/
        export class When_identity_template_has_invalid_identifier extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInterchange("InterchangeName").WithDocumentation("doc").WithIdentityTemplate(When_identity_template_has_invalid_identifier._entityName).WithElement("Required").WithEndInterchange().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.InterchangeIdentityTemplateContext>(), { SuppliedRule: new InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("identity template");
                _errorMessageCollection[0].Message.ShouldContain(When_identity_template_has_invalid_identifier._entityName);
                _errorMessageCollection[0].Message.ShouldContain("does not match");
            }
        }
    }
}