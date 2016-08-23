module MetaEd.Tests.Validator.MetaEdId {
    export class MustNotDuplicateMetaEdIdTests {

    }
    export module MustNotDuplicateMetaEdIdTests {
        /*[TestFixture]*/
        export class When_domain_entity_has_valid_metaEdId extends ValidationRuleTestBase {
            protected static _metaEdId1: string = "100";
            protected static _metaEdId2: string = "101";
            protected static _entityName1: string = "MyIdentifier1";
            protected static _propertyName1: string = "Identifier1";
            protected static _entityName2: string = "MyIdentifier2";
            protected static _propertyName2: string = "Identifier2";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_has_valid_metaEdId._entityName1).WithMetaEdId(When_domain_entity_has_valid_metaEdId._metaEdId1).WithDocumentation("doc").WithStringIdentity(When_domain_entity_has_valid_metaEdId._propertyName1, "doc", 100).WithEndDomainEntity().WithStartDomainEntity(When_domain_entity_has_valid_metaEdId._entityName2).WithMetaEdId(When_domain_entity_has_valid_metaEdId._metaEdId2).WithDocumentation("doc").WithStringIdentity(When_domain_entity_has_valid_metaEdId._propertyName2, "doc", 100).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.MetaEdIdContext>(), { SuppliedRule: new MustNotDuplicateMetaEdId() });
            }
            public should_not_have_validation_failure(): void {
                _errorMessageCollection.ShouldBeEmpty();
            }
        }
    }
    export module MustNotDuplicateMetaEdIdTests {
        /*[TestFixture]*/
        export class When_domain_entity_has_duplicate_metaEdId extends ValidationRuleTestBase {
            protected static _metaEdId: string = "100";
            protected static _entityName1: string = "MyIdentifier1";
            protected static _propertyName1: string = "Identifier1";
            protected static _entityName2: string = "MyIdentifier2";
            protected static _propertyName2: string = "Identifier2";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_has_duplicate_metaEdId._entityName1).WithMetaEdId(When_domain_entity_has_duplicate_metaEdId._metaEdId).WithDocumentation("doc").WithStringIdentity(When_domain_entity_has_duplicate_metaEdId._propertyName1, "doc", 100).WithEndDomainEntity().WithStartDomainEntity(When_domain_entity_has_duplicate_metaEdId._entityName2).WithMetaEdId(When_domain_entity_has_duplicate_metaEdId._metaEdId).WithDocumentation("doc").WithStringIdentity(When_domain_entity_has_duplicate_metaEdId._propertyName2, "doc", 100).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.MetaEdIdContext>(), { SuppliedRule: new MustNotDuplicateMetaEdId() });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.ShouldNotBeEmpty();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("MetaEdId");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_has_duplicate_metaEdId._metaEdId);
                _errorMessageCollection[0].Message.ShouldContain("All MetaEdIds must be globally unique.");
            }
        }
    }
    export module MustNotDuplicateMetaEdIdTests {
        /*[TestFixture]*/
        export class When_domain_entity_has_duplicate_metaEdId_with_property extends ValidationRuleTestBase {
            protected static _metaEdId: string = "100";
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_has_duplicate_metaEdId_with_property._entityName).WithMetaEdId(When_domain_entity_has_duplicate_metaEdId_with_property._metaEdId).WithDocumentation("doc").WithStringIdentity(When_domain_entity_has_duplicate_metaEdId_with_property._propertyName, "doc", 100,/*metaEdId:*/When_domain_entity_has_duplicate_metaEdId_with_property._metaEdId).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.MetaEdIdContext>(), { SuppliedRule: new MustNotDuplicateMetaEdId() });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.ShouldNotBeEmpty();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("MetaEdId");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_has_duplicate_metaEdId_with_property._metaEdId);
                _errorMessageCollection[0].Message.ShouldContain("All MetaEdIds must be globally unique.");
            }
        }
    }
    export module MustNotDuplicateMetaEdIdTests {
        /*[TestFixture]*/
        export class When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity extends ValidationRuleTestBase {
            protected static _metaEdId: string = "100";
            protected static _entityName1: string = "MyIdentifier1";
            protected static _propertyName1: string = "Identifier1";
            protected static _entityName2: string = "MyIdentifier2";
            protected static _propertyName2: string = "Identifier2";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity._entityName1).WithMetaEdId(When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity._metaEdId).WithDocumentation("doc").WithStringIdentity(When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity._propertyName1, "doc", 100).WithEndDomainEntity().WithStartDomainEntity(When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity._entityName2).WithDocumentation("doc").WithStringIdentity(When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity._propertyName2, "doc", 100,/*metaEdId:*/When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity._metaEdId).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.MetaEdIdContext>(), { SuppliedRule: new MustNotDuplicateMetaEdId() });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.ShouldNotBeEmpty();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("MetaEdId");
                _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity._metaEdId);
                _errorMessageCollection[0].Message.ShouldContain("All MetaEdIds must be globally unique.");
            }
        }
    }
}