module MetaEd.Tests.Validator.MergePartOfReference {
    export class MergeStatementMustStartMergePathWithPropertyNameTests {

    }
    export module MergeStatementMustStartMergePathWithPropertyNameTests {
        /*[TestFixture]*/
        export class When_reference_property_has_merge_statement_with_correct_path extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity2").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithReferenceProperty(When_reference_property_has_merge_statement_with_correct_path._entityName, "doc", true, false).WithMergePartOfReference(When_reference_property_has_merge_statement_with_correct_path._entityName + ".Property", "AnotherProperty").WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.MergePartOfReferenceContext>(), { SuppliedRule: new MergeStatementMustStartMergePathWithPropertyName() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module MergeStatementMustStartMergePathWithPropertyNameTests {
        /*[TestFixture]*/
        export class When_reference_property_has_merge_statement_with_incorrect_path extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity2").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithReferenceProperty(When_reference_property_has_merge_statement_with_incorrect_path._entityName, "doc", true, false).WithMergePartOfReference("DifferentEntity.Property", "AnotherProperty").WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.MergePartOfReferenceContext>(), { SuppliedRule: new MergeStatementMustStartMergePathWithPropertyName() });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(1);
                _errorMessageCollection[0].Message.ShouldEqual("Merge statement must start first property path with the referenced entity name of the current property.");
            }
        }
    }
}