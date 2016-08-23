module MetaEd.Tests.Validator.Enumeration {
    export class EnumerationItemsMustBeUniqueTests {

    }
    export module EnumerationItemsMustBeUniqueTests {
        /*[TestFixture]*/
        export class When_enumeration_items_have_different_short_descriptions extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartEnumeration("Enumeration1").WithDocumentation("doc").WithEnumerationItem("this is short description 1", "doc1").WithEnumerationItem("this is short description 2", "doc2").WithEndEnumeration().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.EnumerationContext>(), { SuppliedRule: new EnumerationItemsMustBeUnique() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module EnumerationItemsMustBeUniqueTests {
        /*[TestFixture]*/
        export class When_enumeration_items_have_duplicate_short_descriptions extends ValidationRuleTestBase {
            protected static _entityName: string = "Enumeration1";
            protected static _duplicateShortDescription: string = "this is a duplicate short description";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartEnumeration("Enumeration1").WithDocumentation("doc").WithEnumerationItem(When_enumeration_items_have_duplicate_short_descriptions._duplicateShortDescription, "doc1").WithEnumerationItem(When_enumeration_items_have_duplicate_short_descriptions._duplicateShortDescription, "doc2").WithEndEnumeration().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.EnumerationContext>(), { SuppliedRule: new EnumerationItemsMustBeUnique() });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldEqual("Enumeration 'Enumeration1' declares duplicate item 'this is a duplicate short description'.");
            }
        }
    }
    export module EnumerationItemsMustBeUniqueTests {
        /*[TestFixture]*/
        export class When_enumeration_items_have_multiple_duplicate_short_descriptions extends ValidationRuleTestBase {
            protected static _entityName: string = "Enumeration1";
            protected static _duplicateShortDescription1: string = "this is duplicate short description 1";
            protected static _duplicateShortDescription2: string = "this is duplicate short description 2";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartEnumeration("Enumeration1").WithDocumentation("doc").WithEnumerationItem(When_enumeration_items_have_multiple_duplicate_short_descriptions._duplicateShortDescription1, "doc1").WithEnumerationItem(When_enumeration_items_have_multiple_duplicate_short_descriptions._duplicateShortDescription1, "doc1 again").WithEnumerationItem(When_enumeration_items_have_multiple_duplicate_short_descriptions._duplicateShortDescription2, "doc2").WithEnumerationItem(When_enumeration_items_have_multiple_duplicate_short_descriptions._duplicateShortDescription2, "doc2 again").WithEndEnumeration().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.EnumerationContext>(), { SuppliedRule: new EnumerationItemsMustBeUnique() });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldEqual("Enumeration 'Enumeration1' declares duplicate items 'this is duplicate short description 1', 'this is duplicate short description 2'.");
            }
        }
    }
}