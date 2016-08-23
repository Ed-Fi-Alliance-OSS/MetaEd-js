module MetaEd.Tests.Validator.IdentityRename {
    export class IdentityRenameOnlyIfIdentityRenameIsAllowedTests {

    }
    /*[TestFixture]*/
    export class When_association_subclass_has_invalid_identity_rename_property extends ValidationRuleTestBase {
        protected static _entityName: string = "MyIdentifier";
        protected static _propertyName: string = "Identifier";
        protected metaEdText(): string {
            var metaEdTextBuilder = new MetaEdTextBuilder();
            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_subclass_has_invalid_identity_rename_property._entityName).WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithStringIdentityRename(When_association_subclass_has_invalid_identity_rename_property._propertyName, "BaseIdentifier", "Docs", 100).WithEndAssociation().WithEndNamespace();
            return metaEdTextBuilder;
        }
        protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
            return __init(new TestRuleProvider<MetaEdGrammar.IdentityRenameContext>(), { SuppliedRule: new IdentityRenameExistsOnlyIfIdentityRenameIsAllowed() });
        }
        public should_have_validation_failure(): void {
            _errorMessageCollection.Any().ShouldBeTrue();
        }
        public should_have_validation_failure_message(): void {
            _errorMessageCollection[0].Message.ShouldContain("Association");
            _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_invalid_identity_rename_property._entityName);
            _errorMessageCollection[0].Message.ShouldContain(When_association_subclass_has_invalid_identity_rename_property._propertyName);
            _errorMessageCollection[0].Message.ShouldContain("invalid");
        }
    }
    /*[TestFixture]*/
    export class When_domain_entity_has_invalid_identity_rename_property extends ValidationRuleTestBase {
        protected static _entityName: string = "MyIdentifier";
        protected static _propertyName: string = "Identifier";
        protected metaEdText(): string {
            var metaEdTextBuilder = new MetaEdTextBuilder();
            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_has_invalid_identity_rename_property._entityName).WithDocumentation("doc").WithStringIdentityRename(When_domain_entity_has_invalid_identity_rename_property._propertyName, "BaseIdentifier", "doc", 100).WithEndDomainEntity().WithEndNamespace();
            return metaEdTextBuilder;
        }
        protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
            return __init(new TestRuleProvider<MetaEdGrammar.IdentityRenameContext>(), { SuppliedRule: new IdentityRenameExistsOnlyIfIdentityRenameIsAllowed() });
        }
        public should_have_validation_failure(): void {
            _errorMessageCollection.Any().ShouldBeTrue();
        }
        public should_have_validation_failure_message(): void {
            _errorMessageCollection[0].Message.ShouldContain("Domain Entity");
            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_has_invalid_identity_rename_property._entityName);
            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_has_invalid_identity_rename_property._propertyName);
            _errorMessageCollection[0].Message.ShouldContain("invalid");
        }
    }
    export module IdentityRenameOnlyIfIdentityRenameIsAllowedTests {
        /*[TestFixture]*/
        export class When_association_subclass_has_valid_identity_rename_property extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_subclass_has_valid_identity_rename_property._entityName).WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc").WithDomainEntityProperty("DomainEntity2", "doc").WithStringIdentity("BaseIdentifier", "doc", 100).WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationSubclass("NewSubclass", When_association_subclass_has_valid_identity_rename_property._entityName).WithDocumentation("doc").WithStringIdentityRename("Identifier", "BaseIdentifier", "Docs", 100).WithEndAssociationSubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IdentityRenameContext>(), { SuppliedRule: new IdentityRenameExistsOnlyIfIdentityRenameIsAllowed() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module IdentityRenameOnlyIfIdentityRenameIsAllowedTests {
        /*[TestFixture]*/
        export class When_domain_entity_subclass_has_valid_identity_rename_property extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_subclass_has_valid_identity_rename_property._entityName).WithDocumentation("doc").WithStringIdentity("BaseIdentifier", "doc", 100).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntitySubclass("NewSubclass", When_domain_entity_subclass_has_valid_identity_rename_property._entityName).WithDocumentation("doc").WithStringIdentityRename("Identifier", "BaseIdentifier", "Docs", 100).WithEndDomainEntitySubclass().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IdentityRenameContext>(), { SuppliedRule: new IdentityRenameExistsOnlyIfIdentityRenameIsAllowed() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
}