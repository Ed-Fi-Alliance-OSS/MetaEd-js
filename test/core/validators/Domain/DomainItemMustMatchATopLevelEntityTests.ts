module MetaEd.Tests.Validator.Domain {
    export class DomainItemMustMatchTopLevelEntityTests {

    }
    export module DomainItemMustMatchTopLevelEntityTests {
        /*[TestFixture]*/
        export class When_domain_item_is_domain_entity extends ValidationRuleTestBase {
            protected static _entityName: string = "EntityName";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_item_is_domain_entity._entityName).WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomain("DomainName").WithDocumentation("doc").WithDomainItem(When_domain_item_is_domain_entity._entityName).WithEndDomain().WithStartSubdomain("SubdomainName", "DomainName").WithDocumentation("doc").WithDomainItem(When_domain_item_is_domain_entity._entityName).WithEndSubdomain().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainItemContext>(), { SuppliedRule: new DomainItemMustMatchTopLevelEntity(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module DomainItemMustMatchTopLevelEntityTests {
        /*[TestFixture]*/
        export class When_domain_item_is_domain_entity_subclass extends ValidationRuleTestBase {
            protected static _entityName: string = "EntityName";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntityBase").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntitySubclass(When_domain_item_is_domain_entity_subclass._entityName, "DomainEntityBase").WithDocumentation("doc").WithDateProperty("BeginDate", "doc", true, false).WithEndDomainEntitySubclass();
                metaEdTextBuilder.WithStartDomain("DomainName").WithDocumentation("doc").WithDomainItem(When_domain_item_is_domain_entity_subclass._entityName).WithEndDomain().WithStartSubdomain("SubdomainName", "DomainName").WithDocumentation("doc").WithDomainItem(When_domain_item_is_domain_entity_subclass._entityName).WithEndSubdomain().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainItemContext>(), { SuppliedRule: new DomainItemMustMatchTopLevelEntity(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module DomainItemMustMatchTopLevelEntityTests {
        /*[TestFixture]*/
        export class When_domain_item_is_association extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_domain_item_is_association._entityName).WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndAssociation();
                metaEdTextBuilder.WithStartDomain("DomainName").WithDocumentation("doc").WithDomainItem(When_domain_item_is_association._entityName).WithEndDomain().WithStartSubdomain("SubdomainName", "DomainName").WithDocumentation("doc").WithDomainItem(When_domain_item_is_association._entityName).WithEndSubdomain().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainItemContext>(), { SuppliedRule: new DomainItemMustMatchTopLevelEntity(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module DomainItemMustMatchTopLevelEntityTests {
        /*[TestFixture]*/
        export class When_domain_item_is_association_subclass extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation("BaseName").WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithBooleanProperty("Property1", "doc", true, false).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationSubclass(When_domain_item_is_association_subclass._entityName, "BaseName").WithDocumentation("doc").WithBooleanProperty("Property2", "doc", true, false).WithEndAssociationSubclass();
                metaEdTextBuilder.WithStartDomain("DomainName").WithDocumentation("doc").WithDomainItem(When_domain_item_is_association_subclass._entityName).WithEndDomain().WithStartSubdomain("SubdomainName", "DomainName").WithDocumentation("doc").WithDomainItem(When_domain_item_is_association_subclass._entityName).WithEndSubdomain().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainItemContext>(), { SuppliedRule: new DomainItemMustMatchTopLevelEntity(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module DomainItemMustMatchTopLevelEntityTests {
        /*[TestFixture]*/
        export class When_domain_item_is_common_type extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_domain_item_is_common_type._entityName).WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEndDescriptor();
                metaEdTextBuilder.WithStartDomain("DomainName").WithDocumentation("doc").WithDomainItem(When_domain_item_is_common_type._entityName).WithEndDomain().WithStartSubdomain("SubdomainName", "DomainName").WithDocumentation("doc").WithDomainItem(When_domain_item_is_common_type._entityName).WithEndSubdomain().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainItemContext>(), { SuppliedRule: new DomainItemMustMatchTopLevelEntity(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module DomainItemMustMatchTopLevelEntityTests {
        /*[TestFixture]*/
        export class When_domain_item_under_domain_is_descriptor extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDescriptor(When_domain_item_under_domain_is_descriptor._entityName).WithDocumentation("doc").WithStartMapType().WithDocumentation("map type doc").WithEnumerationItem("this is short description 1", "doc1").WithEndMapType().WithEndDescriptor();
                metaEdTextBuilder.WithStartDomain("DomainName").WithDocumentation("doc").WithDomainItem(When_domain_item_under_domain_is_descriptor._entityName).WithEndDomain().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainItemContext>(), { SuppliedRule: new DomainItemMustMatchTopLevelEntity(_symbolTable) });
            }
            public should_not_validate(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
        }
    }
    export module DomainItemMustMatchTopLevelEntityTests {
        /*[TestFixture]*/
        export class When_domain_item_under_subdomain_is_descriptor extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDescriptor(When_domain_item_under_subdomain_is_descriptor._entityName).WithDocumentation("doc").WithStartMapType().WithDocumentation("map type doc").WithEnumerationItem("this is short description 1", "doc1").WithEndMapType().WithEndDescriptor();
                metaEdTextBuilder.WithStartSubdomain("SubdomainName", "DomainName").WithDocumentation("doc").WithDomainItem(When_domain_item_under_subdomain_is_descriptor._entityName).WithEndSubdomain().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainItemContext>(), { SuppliedRule: new DomainItemMustMatchTopLevelEntity(_symbolTable) });
            }
            public should_not_validate(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
        }
    }
    export module DomainItemMustMatchTopLevelEntityTests {
        /*[TestFixture]*/
        export class When_domain_item_under_domain_has_invalid_identifier extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomain("DomainName").WithDocumentation("doc").WithDomainItem(When_domain_item_under_domain_has_invalid_identifier._entityName).WithEndDomain().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainItemContext>(), { SuppliedRule: new DomainItemMustMatchTopLevelEntity(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Domain item");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_item_under_domain_has_invalid_identifier._entityName);
                _errorMessageCollection[0].Message.ShouldContain("Domain");
                _errorMessageCollection[0].Message.ShouldContain("DomainName");
                _errorMessageCollection[0].Message.ShouldContain("does not match");
            }
        }
    }
    export module DomainItemMustMatchTopLevelEntityTests {
        /*[TestFixture]*/
        export class When_domain_item_under_subdomain_has_invalid_identifier extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartSubdomain("SubdomainName", "DomainName").WithDocumentation("doc").WithDomainItem(When_domain_item_under_subdomain_has_invalid_identifier._entityName).WithEndSubdomain().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainItemContext>(), { SuppliedRule: new DomainItemMustMatchTopLevelEntity(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Domain item");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_item_under_subdomain_has_invalid_identifier._entityName);
                _errorMessageCollection[0].Message.ShouldContain("Subdomain");
                _errorMessageCollection[0].Message.ShouldContain("SubdomainName");
                _errorMessageCollection[0].Message.ShouldContain("does not match");
            }
        }
    }
}