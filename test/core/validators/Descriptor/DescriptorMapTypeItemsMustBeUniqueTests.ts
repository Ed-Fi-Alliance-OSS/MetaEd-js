module MetaEd.Tests.Validator.Descriptor {
    export class DescriptorMapTypeItemsMustBeUniqueTests {

    }
    export module DescriptorMapTypeItemsMustBeUniqueTests {
        /*[TestFixture]*/
        export class When_map_type_items_have_different_short_descriptions extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDescriptor("Descriptor1").WithDocumentation("doc").WithStartMapType().WithDocumentation("map type doc").WithEnumerationItem("this is short description 1", "doc1").WithEnumerationItem("this is short description 2", "doc2").WithEndMapType().WithEndDescriptor().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DescriptorContext>(), { SuppliedRule: new DescriptorMapTypeItemsMustBeUnique() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module DescriptorMapTypeItemsMustBeUniqueTests {
        /*[TestFixture]*/
        export class When_map_type_items_have_duplicate_short_descriptions extends ValidationRuleTestBase {
            protected static _entityName: string = "Descriptor1";
            protected static _duplicateShortDescription: string = "this is a duplicate short description";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDescriptor(When_map_type_items_have_duplicate_short_descriptions._entityName).WithDocumentation("doc").WithStartMapType().WithDocumentation("map type doc").WithEnumerationItem(When_map_type_items_have_duplicate_short_descriptions._duplicateShortDescription, "doc1").WithEnumerationItem(When_map_type_items_have_duplicate_short_descriptions._duplicateShortDescription, "doc2").WithEndMapType().WithEndDescriptor().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DescriptorContext>(), { SuppliedRule: new DescriptorMapTypeItemsMustBeUnique() });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldEqual("Descriptor 'Descriptor1' declares duplicate item 'this is a duplicate short description'.");
            }
        }
    }
    export module DescriptorMapTypeItemsMustBeUniqueTests {
        /*[TestFixture]*/
        export class When_map_type_items_have_multiple_duplicate_short_descriptions extends ValidationRuleTestBase {
            protected static _entityName: string = "Descriptor1";
            protected static _duplicateShortDescription1: string = "this is duplicate short description 1";
            protected static _duplicateShortDescription2: string = "this is duplicate short description 2";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDescriptor(When_map_type_items_have_multiple_duplicate_short_descriptions._entityName).WithDocumentation("doc").WithStartMapType().WithDocumentation("map type doc").WithEnumerationItem(When_map_type_items_have_multiple_duplicate_short_descriptions._duplicateShortDescription1, "doc1").WithEnumerationItem(When_map_type_items_have_multiple_duplicate_short_descriptions._duplicateShortDescription1, "doc1 again").WithEnumerationItem(When_map_type_items_have_multiple_duplicate_short_descriptions._duplicateShortDescription2, "doc2").WithEnumerationItem(When_map_type_items_have_multiple_duplicate_short_descriptions._duplicateShortDescription2, "doc2 again").WithEndMapType().WithEndDescriptor().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DescriptorContext>(), { SuppliedRule: new DescriptorMapTypeItemsMustBeUnique() });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldEqual("Descriptor 'Descriptor1' declares duplicate items 'this is duplicate short description 1', 'this is duplicate short description 2'.");
            }
        }
    }
}