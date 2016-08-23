var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var Enumeration;
            (function (Enumeration) {
                class EnumerationItemsMustBeUniqueTests {
                }
                Enumeration.EnumerationItemsMustBeUniqueTests = EnumerationItemsMustBeUniqueTests;
                (function (EnumerationItemsMustBeUniqueTests) {
                    /*[TestFixture]*/
                    class When_enumeration_items_have_different_short_descriptions extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartEnumeration("Enumeration1").WithDocumentation("doc").WithEnumerationItem("this is short description 1", "doc1").WithEnumerationItem("this is short description 2", "doc2").WithEndEnumeration().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new EnumerationItemsMustBeUnique() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    EnumerationItemsMustBeUniqueTests.When_enumeration_items_have_different_short_descriptions = When_enumeration_items_have_different_short_descriptions;
                })(EnumerationItemsMustBeUniqueTests = Enumeration.EnumerationItemsMustBeUniqueTests || (Enumeration.EnumerationItemsMustBeUniqueTests = {}));
                (function (EnumerationItemsMustBeUniqueTests) {
                    /*[TestFixture]*/
                    class When_enumeration_items_have_duplicate_short_descriptions extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartEnumeration("Enumeration1").WithDocumentation("doc").WithEnumerationItem(When_enumeration_items_have_duplicate_short_descriptions._duplicateShortDescription, "doc1").WithEnumerationItem(When_enumeration_items_have_duplicate_short_descriptions._duplicateShortDescription, "doc2").WithEndEnumeration().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new EnumerationItemsMustBeUnique() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldEqual("Enumeration 'Enumeration1' declares duplicate item 'this is a duplicate short description'.");
                        }
                    }
                    When_enumeration_items_have_duplicate_short_descriptions._entityName = "Enumeration1";
                    When_enumeration_items_have_duplicate_short_descriptions._duplicateShortDescription = "this is a duplicate short description";
                    EnumerationItemsMustBeUniqueTests.When_enumeration_items_have_duplicate_short_descriptions = When_enumeration_items_have_duplicate_short_descriptions;
                })(EnumerationItemsMustBeUniqueTests = Enumeration.EnumerationItemsMustBeUniqueTests || (Enumeration.EnumerationItemsMustBeUniqueTests = {}));
                (function (EnumerationItemsMustBeUniqueTests) {
                    /*[TestFixture]*/
                    class When_enumeration_items_have_multiple_duplicate_short_descriptions extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartEnumeration("Enumeration1").WithDocumentation("doc").WithEnumerationItem(When_enumeration_items_have_multiple_duplicate_short_descriptions._duplicateShortDescription1, "doc1").WithEnumerationItem(When_enumeration_items_have_multiple_duplicate_short_descriptions._duplicateShortDescription1, "doc1 again").WithEnumerationItem(When_enumeration_items_have_multiple_duplicate_short_descriptions._duplicateShortDescription2, "doc2").WithEnumerationItem(When_enumeration_items_have_multiple_duplicate_short_descriptions._duplicateShortDescription2, "doc2 again").WithEndEnumeration().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new EnumerationItemsMustBeUnique() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldEqual("Enumeration 'Enumeration1' declares duplicate items 'this is duplicate short description 1', 'this is duplicate short description 2'.");
                        }
                    }
                    When_enumeration_items_have_multiple_duplicate_short_descriptions._entityName = "Enumeration1";
                    When_enumeration_items_have_multiple_duplicate_short_descriptions._duplicateShortDescription1 = "this is duplicate short description 1";
                    When_enumeration_items_have_multiple_duplicate_short_descriptions._duplicateShortDescription2 = "this is duplicate short description 2";
                    EnumerationItemsMustBeUniqueTests.When_enumeration_items_have_multiple_duplicate_short_descriptions = When_enumeration_items_have_multiple_duplicate_short_descriptions;
                })(EnumerationItemsMustBeUniqueTests = Enumeration.EnumerationItemsMustBeUniqueTests || (Enumeration.EnumerationItemsMustBeUniqueTests = {}));
            })(Enumeration = Validator.Enumeration || (Validator.Enumeration = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=EnumerationItemsMustBeUniqueTests.js.map