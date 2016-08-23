var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var InterchangeExtension;
            (function (InterchangeExtension) {
                class InterchangeExtensionMustNotDuplicateInterchangeElementNameTests {
                }
                InterchangeExtension.InterchangeExtensionMustNotDuplicateInterchangeElementNameTests = InterchangeExtensionMustNotDuplicateInterchangeElementNameTests;
                (function (InterchangeExtensionMustNotDuplicateInterchangeElementNameTests) {
                    /*[TestFixture]*/
                    class When_elements_have_different_names extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInterchangeExtension("Interchange1").WithElement("Template1").WithElement("Template2").WithEndInterchangeExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new InterchangeExtensionMustNotDuplicateInterchangeElementName(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    InterchangeExtensionMustNotDuplicateInterchangeElementNameTests.When_elements_have_different_names = When_elements_have_different_names;
                })(InterchangeExtensionMustNotDuplicateInterchangeElementNameTests = InterchangeExtension.InterchangeExtensionMustNotDuplicateInterchangeElementNameTests || (InterchangeExtension.InterchangeExtensionMustNotDuplicateInterchangeElementNameTests = {}));
                (function (InterchangeExtensionMustNotDuplicateInterchangeElementNameTests) {
                    /*[TestFixture]*/
                    class When_elements_have_duplicate_names extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInterchangeExtension("Interchange1").WithElement(When_elements_have_duplicate_names._duplicateTemplate).WithElement(When_elements_have_duplicate_names._duplicateTemplate).WithEndInterchangeExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new InterchangeExtensionMustNotDuplicateInterchangeElementName(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Interchange additions");
                            _errorMessageCollection[0].Message.ShouldContain(When_elements_have_duplicate_names._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("duplicate interchange element");
                            _errorMessageCollection[0].Message.ShouldContain(When_elements_have_duplicate_names._duplicateTemplate);
                        }
                    }
                    When_elements_have_duplicate_names._entityName = "Interchange1";
                    When_elements_have_duplicate_names._duplicateTemplate = "Identity1";
                    InterchangeExtensionMustNotDuplicateInterchangeElementNameTests.When_elements_have_duplicate_names = When_elements_have_duplicate_names;
                })(InterchangeExtensionMustNotDuplicateInterchangeElementNameTests = InterchangeExtension.InterchangeExtensionMustNotDuplicateInterchangeElementNameTests || (InterchangeExtension.InterchangeExtensionMustNotDuplicateInterchangeElementNameTests = {}));
            })(InterchangeExtension = Validator.InterchangeExtension || (Validator.InterchangeExtension = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=InterchangeExtensionMustNotDuplicateInterchangeElementNameTests.js.map