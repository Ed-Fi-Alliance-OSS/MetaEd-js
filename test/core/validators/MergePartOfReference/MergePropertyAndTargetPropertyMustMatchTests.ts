module MetaEd.Tests.Validator.MergePartOfReference {
    export class MergePropertyAndTargetPropertyMustMatchTests {

    }
    export module MergePropertyAndTargetPropertyMustMatchTests {
        /*[TestFixture]*/
        export class When_merged_property_names_and_types_match extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithReferenceProperty("Entity1", "doc", false, false).WithMergePartOfReference("Entity1.Prop1", "Prop1").WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): IRuleProvider {
                var propertyPathLookup = new PropertyPathLookup(_symbolTable);
                return __init(new TestRuleProvider<MetaEdGrammar.MergePartOfReferenceContext>(), { SuppliedRule: new MergePropertyAndTargetPropertyMustMatch(_symbolTable, propertyPathLookup) });
            }
            public should_validate_successfully(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module MergePropertyAndTargetPropertyMustMatchTests {
        /*[TestFixture]*/
        export class When_merged_property_types_are_different extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithDecimalIdentity("Prop1", "doc", 5, 3).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithReferenceProperty("Entity1", "doc", false, false).WithMergePartOfReference("Entity1.Prop1", "Prop1").WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): IRuleProvider {
                var propertyPathLookup = new PropertyPathLookup(_symbolTable);
                return __init(new TestRuleProvider<MetaEdGrammar.MergePartOfReferenceContext>(), { SuppliedRule: new MergePropertyAndTargetPropertyMustMatch(_symbolTable, propertyPathLookup) });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(1);
            }
            public should_have_meaningful_validation_message(): void {
                _errorMessageCollection[0].Message.ShouldEqual("The merge paths 'Entity1.Prop1' and 'Prop1' do not correspond to the same entity type.");
            }
        }
    }
    export module MergePropertyAndTargetPropertyMustMatchTests {
        /*[TestFixture]*/
        export class When_merged_property_names_are_different extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop2", "doc").WithReferenceProperty("Entity1", "doc", false, false).WithMergePartOfReference("Entity1.Prop1", "Prop2").WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): IRuleProvider {
                var propertyPathLookup = new PropertyPathLookup(_symbolTable);
                return __init(new TestRuleProvider<MetaEdGrammar.MergePartOfReferenceContext>(), { SuppliedRule: new MergePropertyAndTargetPropertyMustMatch(_symbolTable, propertyPathLookup) });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(1);
            }
        }
    }
    export module MergePropertyAndTargetPropertyMustMatchTests {
        /*[TestFixture]*/
        export class When_merging_properties_of_a_base_and_sub_domain_entity extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntitySubclass("Entity2", "Entity1").WithDocumentation("doc").WithIntegerProperty("Prop2", "doc", false, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntity("Entity3").WithDocumentation("doc").WithReferenceProperty("Entity1", "doc", false, false).WithMergePartOfReference("Entity1", "Entity2").WithReferenceProperty("Entity2", "doc", false, false).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): IRuleProvider {
                var propertyPathLookup = new PropertyPathLookup(_symbolTable);
                return __init(new TestRuleProvider<MetaEdGrammar.MergePartOfReferenceContext>(), { SuppliedRule: new MergePropertyAndTargetPropertyMustMatch(_symbolTable, propertyPathLookup) });
            }
            public should_validate_successfully(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module MergePropertyAndTargetPropertyMustMatchTests {
        /*[TestFixture]*/
        export class When_merging_domain_entity_property_of_an_association extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithReferenceIdentity("Entity1", "doc").WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntity("Entity3").WithDocumentation("doc").WithIntegerIdentity("Prop3", "doc").WithEndDomainEntity();
                metaEdTextBuilder.WithStartAssociation("Entity4").WithDocumentation("doc").WithDomainEntityProperty("Entity2", "doc").WithDomainEntityProperty("Entity3", "doc").WithIntegerIdentity("Prop4", "doc").WithReferenceProperty("Entity1", "doc", false, false).WithMergePartOfReference("Entity1", "Entity2.Entity1").WithEndAssociation().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): IRuleProvider {
                var propertyPathLookup = new PropertyPathLookup(_symbolTable);
                return __init(new TestRuleProvider<MetaEdGrammar.MergePartOfReferenceContext>(), { SuppliedRule: new MergePropertyAndTargetPropertyMustMatch(_symbolTable, propertyPathLookup) });
            }
            public should_validate_successfully(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
}