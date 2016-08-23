module MetaEd.Tests.Validator.MergePartOfReference {
    export class MergePartOfReferenceExistsOnlyInCoreNamespaceTests {

    }
    export module MergePartOfReferenceExistsOnlyInCoreNamespaceTests {
        /*[TestFixture]*/
        export class When_merge_exists_in_core extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithReferenceProperty("Entity1", "doc", false, false).WithMergePartOfReference("Entity1.Prop1", "Prop1").WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.MergePartOfReferenceContext>(), { SuppliedRule: new MergePartOfReferenceExistsOnlyInCoreNamespace() });
            }
            public should_validate_successfully(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module MergePartOfReferenceExistsOnlyInCoreNamespaceTests {
        /*[TestFixture]*/
        export class When_merged_exists_in_extension extends ValidationRuleTestBase {
            private static _entityName1: string = "Entity1";
            private static _entityName2: string = "Entity2";
            private static _propertyName: string = "Prop1";
            private static _extensionNamespace: string = "extension";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace(When_merged_exists_in_extension._extensionNamespace, "EXTENSION").WithStartDomainEntity(When_merged_exists_in_extension._entityName1).WithDocumentation("doc").WithDecimalIdentity("Prop1", "doc", 5, 3).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntity(When_merged_exists_in_extension._entityName2).WithDocumentation("doc").WithIntegerIdentity(When_merged_exists_in_extension._propertyName, "doc").WithReferenceProperty(When_merged_exists_in_extension._entityName1, "doc", false, false).WithMergePartOfReference(When_merged_exists_in_extension._entityName1 + "." + When_merged_exists_in_extension._propertyName, When_merged_exists_in_extension._propertyName).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.MergePartOfReferenceContext>(), { SuppliedRule: new MergePartOfReferenceExistsOnlyInCoreNamespace() });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(1);
            }
            public should_have_meaningful_validation_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("'merge' is invalid for property");
                _errorMessageCollection[0].Message.ShouldContain(When_merged_exists_in_extension._entityName1);
                _errorMessageCollection[0].Message.ShouldContain(When_merged_exists_in_extension._entityName2);
                _errorMessageCollection[0].Message.ShouldContain(When_merged_exists_in_extension._extensionNamespace);
                _errorMessageCollection[0].Message.ShouldContain("'merge' is only valid for properties on types in a core namespace.");
            }
        }
    }
}