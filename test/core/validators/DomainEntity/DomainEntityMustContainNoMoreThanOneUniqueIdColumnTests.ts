module MetaEd.Tests.Validator.DomainEntity {
    export class DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests {

    }
    export module DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests {
        /*[TestFixture]*/
        export class When_validating_domain_entity_with_no_uniqueId_fields extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity1").WithDocumentation("doc1").WithStringIdentity("Property1", "doc2", 100).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntityContext>(), { SuppliedRule: new DomainEntityMustContainNoMoreThanOneUniqueIdColumn() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.ShouldBeEmpty();
            }
        }
    }
    export module DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests {
        /*[TestFixture]*/
        export class When_validating_domain_entity_with_one_uniqueId_field extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity1").WithDocumentation("doc1").WithStringIdentity("UniqueId", "doc2", 100).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntityContext>(), { SuppliedRule: new DomainEntityMustContainNoMoreThanOneUniqueIdColumn() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.ShouldBeEmpty();
            }
        }
    }
    export module DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests {
        /*[TestFixture]*/
        export class When_validating_domain_entity_with_multiple_uniqueId_fields extends ValidationRuleTestBase {
            private static _entityName: string = "DomainEntity1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_validating_domain_entity_with_multiple_uniqueId_fields._entityName).WithDocumentation("doc1").WithStringIdentity("UniqueId", "doc2", 100,/*context:*/"Student").WithStringIdentity("UniqueId", "doc2", 100,/*context:*/"Staff").WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntityContext>(), { SuppliedRule: new DomainEntityMustContainNoMoreThanOneUniqueIdColumn() });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.ShouldNotBeEmpty();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Domain Entity");
                _errorMessageCollection[0].Message.ShouldContain(When_validating_domain_entity_with_multiple_uniqueId_fields._entityName);
                _errorMessageCollection[0].Message.ShouldContain("has multiple properties with a property name of 'UniqueId'");
            }
        }
    }
    export module DomainEntityMustContainNoMoreThanOneUniqueIdColumnTests {
        /*[TestFixture]*/
        export class When_validating_domain_entity_with_multiple_uniqueId_fields_in_extension_namespace extends ValidationRuleTestBase {
            private static _entityName: string = "DomainEntity1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("extension", "projectExtension").WithStartDomainEntity(When_validating_domain_entity_with_multiple_uniqueId_fields_in_extension_namespace._entityName).WithDocumentation("doc1").WithStringIdentity("UniqueId", "doc2", 100,/*context:*/"Student").WithStringIdentity("UniqueId", "doc2", 100,/*context:*/"Staff").WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DomainEntityContext>(), { SuppliedRule: new DomainEntityMustContainNoMoreThanOneUniqueIdColumn() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.ShouldBeEmpty();
            }
        }
    }
}