var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var Descriptor;
            (function (Descriptor) {
                class DescriptorMapTypeItemsMustBeUniqueTests {
                }
                Descriptor.DescriptorMapTypeItemsMustBeUniqueTests = DescriptorMapTypeItemsMustBeUniqueTests;
                (function (DescriptorMapTypeItemsMustBeUniqueTests) {
                    /*[TestFixture]*/
                    class When_map_type_items_have_different_short_descriptions extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDescriptor("Descriptor1").WithDocumentation("doc").WithStartMapType().WithDocumentation("map type doc").WithEnumerationItem("this is short description 1", "doc1").WithEnumerationItem("this is short description 2", "doc2").WithEndMapType().WithEndDescriptor().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DescriptorMapTypeItemsMustBeUnique() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    DescriptorMapTypeItemsMustBeUniqueTests.When_map_type_items_have_different_short_descriptions = When_map_type_items_have_different_short_descriptions;
                })(DescriptorMapTypeItemsMustBeUniqueTests = Descriptor.DescriptorMapTypeItemsMustBeUniqueTests || (Descriptor.DescriptorMapTypeItemsMustBeUniqueTests = {}));
                (function (DescriptorMapTypeItemsMustBeUniqueTests) {
                    /*[TestFixture]*/
                    class When_map_type_items_have_duplicate_short_descriptions extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDescriptor(When_map_type_items_have_duplicate_short_descriptions._entityName).WithDocumentation("doc").WithStartMapType().WithDocumentation("map type doc").WithEnumerationItem(When_map_type_items_have_duplicate_short_descriptions._duplicateShortDescription, "doc1").WithEnumerationItem(When_map_type_items_have_duplicate_short_descriptions._duplicateShortDescription, "doc2").WithEndMapType().WithEndDescriptor().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DescriptorMapTypeItemsMustBeUnique() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldEqual("Descriptor 'Descriptor1' declares duplicate item 'this is a duplicate short description'.");
                        }
                    }
                    When_map_type_items_have_duplicate_short_descriptions._entityName = "Descriptor1";
                    When_map_type_items_have_duplicate_short_descriptions._duplicateShortDescription = "this is a duplicate short description";
                    DescriptorMapTypeItemsMustBeUniqueTests.When_map_type_items_have_duplicate_short_descriptions = When_map_type_items_have_duplicate_short_descriptions;
                })(DescriptorMapTypeItemsMustBeUniqueTests = Descriptor.DescriptorMapTypeItemsMustBeUniqueTests || (Descriptor.DescriptorMapTypeItemsMustBeUniqueTests = {}));
                (function (DescriptorMapTypeItemsMustBeUniqueTests) {
                    /*[TestFixture]*/
                    class When_map_type_items_have_multiple_duplicate_short_descriptions extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDescriptor(When_map_type_items_have_multiple_duplicate_short_descriptions._entityName).WithDocumentation("doc").WithStartMapType().WithDocumentation("map type doc").WithEnumerationItem(When_map_type_items_have_multiple_duplicate_short_descriptions._duplicateShortDescription1, "doc1").WithEnumerationItem(When_map_type_items_have_multiple_duplicate_short_descriptions._duplicateShortDescription1, "doc1 again").WithEnumerationItem(When_map_type_items_have_multiple_duplicate_short_descriptions._duplicateShortDescription2, "doc2").WithEnumerationItem(When_map_type_items_have_multiple_duplicate_short_descriptions._duplicateShortDescription2, "doc2 again").WithEndMapType().WithEndDescriptor().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DescriptorMapTypeItemsMustBeUnique() });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldEqual("Descriptor 'Descriptor1' declares duplicate items 'this is duplicate short description 1', 'this is duplicate short description 2'.");
                        }
                    }
                    When_map_type_items_have_multiple_duplicate_short_descriptions._entityName = "Descriptor1";
                    When_map_type_items_have_multiple_duplicate_short_descriptions._duplicateShortDescription1 = "this is duplicate short description 1";
                    When_map_type_items_have_multiple_duplicate_short_descriptions._duplicateShortDescription2 = "this is duplicate short description 2";
                    DescriptorMapTypeItemsMustBeUniqueTests.When_map_type_items_have_multiple_duplicate_short_descriptions = When_map_type_items_have_multiple_duplicate_short_descriptions;
                })(DescriptorMapTypeItemsMustBeUniqueTests = Descriptor.DescriptorMapTypeItemsMustBeUniqueTests || (Descriptor.DescriptorMapTypeItemsMustBeUniqueTests = {}));
            })(Descriptor = Validator.Descriptor || (Validator.Descriptor = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DescriptorMapTypeItemsMustBeUniqueTests.js.map