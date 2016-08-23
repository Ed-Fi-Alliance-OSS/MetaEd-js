module MetaEd.Tests.Validator.Identity {
    export class IdentityOnlyIfIdentityIsAllowedTests {

    }
    export module IdentityOnlyIfIdentityIsAllowedTests {
        /*[TestFixture]*/
        export class When_domain_entity_has_valid_identity_property extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_has_valid_identity_property._entityName).WithDocumentation("doc").WithStringIdentity(When_domain_entity_has_valid_identity_property._propertyName, "doc", 100).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IdentityContext>(), { SuppliedRule: new IdentityExistsOnlyIfIdentityIsAllowed() });
            }
            public should_not_have_validation_failure(): void {
                _errorMessageCollection.ShouldBeEmpty();
            }
        }
    }
    export module IdentityOnlyIfIdentityIsAllowedTests {
        /*[TestFixture]*/
        export class When_abstract_entity_has_valid_identity_property extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_abstract_entity_has_valid_identity_property._entityName).WithDocumentation("doc").WithStringIdentity(When_abstract_entity_has_valid_identity_property._propertyName, "doc", 100).WithEndAbstractEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IdentityContext>(), { SuppliedRule: new IdentityExistsOnlyIfIdentityIsAllowed() });
            }
            public should_not_have_validation_failure(): void {
                _errorMessageCollection.ShouldBeEmpty();
            }
        }
    }
    export module IdentityOnlyIfIdentityIsAllowedTests {
        /*[TestFixture]*/
        export class When_association_has_valid_identity_property extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_has_valid_identity_property._entityName).WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithStringIdentity(When_association_has_valid_identity_property._propertyName, "doc", 100).WithEndAssociation().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IdentityContext>(), { SuppliedRule: new IdentityExistsOnlyIfIdentityIsAllowed() });
            }
            public should_not_have_validation_failure(): void {
                _errorMessageCollection.ShouldBeEmpty();
            }
        }
    }
    export module IdentityOnlyIfIdentityIsAllowedTests {
        /*[TestFixture]*/
        export class When_common_type_has_valid_identity_property extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_common_type_has_valid_identity_property._entityName).WithDocumentation("doc").WithStringIdentity(When_common_type_has_valid_identity_property._propertyName, "doc", 100).WithEndCommonType().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IdentityContext>(), { SuppliedRule: new IdentityExistsOnlyIfIdentityIsAllowed() });
            }
            public should_not_have_validation_failure(): void {
                _errorMessageCollection.ShouldBeEmpty();
            }
        }
    }
    export module IdentityOnlyIfIdentityIsAllowedTests {
        /*[TestFixture]*/
        export class When_inline_common_type_has_valid_identity_property extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInlineCommonType(When_inline_common_type_has_valid_identity_property._entityName).WithDocumentation("doc").WithStringIdentity(When_inline_common_type_has_valid_identity_property._propertyName, "doc", 100).WithEndInlineCommonType().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IdentityContext>(), { SuppliedRule: new IdentityExistsOnlyIfIdentityIsAllowed() });
            }
            public should_not_have_validation_failure(): void {
                _errorMessageCollection.ShouldBeEmpty();
            }
        }
    }
    export module IdentityOnlyIfIdentityIsAllowedTests {
        /*[TestFixture]*/
        export class When_association_extension_has_invalid_identity_property extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_extension_has_invalid_identity_property._entityName).WithDocumentation("because documentation is required").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationExtension(When_association_extension_has_invalid_identity_property._entityName).WithStringIdentity(When_association_extension_has_invalid_identity_property._propertyName, "doc", 100).WithEndAssociationExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IdentityContext>(), { SuppliedRule: new IdentityExistsOnlyIfIdentityIsAllowed() });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.ShouldNotBeEmpty();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Association");
                _errorMessageCollection[0].Message.ShouldContain("additions");
                _errorMessageCollection[0].Message.ShouldContain(When_association_extension_has_invalid_identity_property._entityName);
                _errorMessageCollection[0].Message.ShouldContain(When_association_extension_has_invalid_identity_property._propertyName);
                _errorMessageCollection[0].Message.ShouldContain("invalid");
            }
        }
    }
    export module IdentityOnlyIfIdentityIsAllowedTests {
        /*[TestFixture]*/
        export class When_association_subclass_has_invalid_identity_property extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected static _subClassName: string = "NewSubclass";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_subclass_has_invalid_identity_property._entityName).WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationSubclass(When_association_subclass_has_invalid_identity_property._subClassName, When_association_subclass_has_invalid_identity_property._entityName).WithDocumentation("doc").WithStringIdentity(When_association_subclass_has_invalid_identity_property._propertyName, "doc", 100).WithEndAssociationSubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IdentityContext>(), { SuppliedRule: new IdentityExistsOnlyIfIdentityIsAllowed() });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.ShouldNotBeEmpty();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Association");
                _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_invalid_identity_property._entityName);
                _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_invalid_identity_property._subClassName);
                _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_invalid_identity_property._propertyName);
                _errorMessageCollection[0].Message.ShouldContain("invalid");
            }
        }
    }
    export module IdentityOnlyIfIdentityIsAllowedTests {
        /*[TestFixture]*/
        export class When_descriptor_has_invalid_identity_property extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDescriptor(When_descriptor_has_invalid_identity_property._entityName).WithDocumentation("doc").WithStringIdentity(When_descriptor_has_invalid_identity_property._propertyName, "doc", 100).WithStartMapType().WithDocumentation("map type doc").WithEnumerationItem("this is short description 1", "doc1").WithEnumerationItem("this is short description 2", "doc2").WithEndMapType().WithEndDescriptor().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IdentityContext>(), { SuppliedRule: new IdentityExistsOnlyIfIdentityIsAllowed() });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.ShouldNotBeEmpty();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Descriptor");
                _errorMessageCollection[0].Message.ShouldContain(When_descriptor_has_invalid_identity_property._entityName);
                _errorMessageCollection[0].Message.ShouldContain(When_descriptor_has_invalid_identity_property._propertyName);
                _errorMessageCollection[0].Message.ShouldContain("invalid");
            }
        }
    }
    export module IdentityOnlyIfIdentityIsAllowedTests {
        /*[TestFixture]*/
        export class When_domain_entity_extension_has_invalid_identity_property extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_extension_has_invalid_identity_property._entityName).WithDocumentation("because documentation is required").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntityExtension(When_domain_entity_extension_has_invalid_identity_property._entityName).WithStringIdentity(When_domain_entity_extension_has_invalid_identity_property._propertyName, "doc", 100).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IdentityContext>(), { SuppliedRule: new IdentityExistsOnlyIfIdentityIsAllowed() });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.ShouldNotBeEmpty();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Domain Entity");
                _errorMessageCollection[0].Message.ShouldContain("additions");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_extension_has_invalid_identity_property._entityName);
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_extension_has_invalid_identity_property._propertyName);
                _errorMessageCollection[0].Message.ShouldContain("invalid");
            }
        }
    }
    export module IdentityOnlyIfIdentityIsAllowedTests {
        /*[TestFixture]*/
        export class When_domain_entity_subclass_has_invalid_identity_property extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected static _subClassName: string = "NewSubclass";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_subclass_has_invalid_identity_property._entityName).WithDocumentation("doc").WithStringIdentity("BaseIdentifier", "doc", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntitySubclass(When_domain_entity_subclass_has_invalid_identity_property._subClassName, When_domain_entity_subclass_has_invalid_identity_property._entityName).WithDocumentation("doc").WithStringIdentity(When_domain_entity_subclass_has_invalid_identity_property._propertyName, "doc", 100).WithEndDomainEntitySubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IdentityContext>(), { SuppliedRule: new IdentityExistsOnlyIfIdentityIsAllowed() });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.ShouldNotBeEmpty();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Domain Entity");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_invalid_identity_property._entityName);
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_invalid_identity_property._subClassName);
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_invalid_identity_property._propertyName);
                _errorMessageCollection[0].Message.ShouldContain("invalid");
            }
        }
    }
}