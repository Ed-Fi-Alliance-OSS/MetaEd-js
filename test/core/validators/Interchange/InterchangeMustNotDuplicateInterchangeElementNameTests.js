var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var Interchange;
            (function (Interchange) {
                class InterchangeMustNotDuplicateInterchangeElementNameTests {
                }
                Interchange.InterchangeMustNotDuplicateInterchangeElementNameTests = InterchangeMustNotDuplicateInterchangeElementNameTests;
                (function (InterchangeMustNotDuplicateInterchangeElementNameTests) {
                    /*[TestFixture]*/
                    class When_elements_have_different_names extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInterchange("Interchange1").WithDocumentation("doc").WithElement("Template1").WithElement("Template2").WithEndInterchange().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new InterchangeMustNotDuplicateInterchangeElementName(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    InterchangeMustNotDuplicateInterchangeElementNameTests.When_elements_have_different_names = When_elements_have_different_names;
                })(InterchangeMustNotDuplicateInterchangeElementNameTests = Interchange.InterchangeMustNotDuplicateInterchangeElementNameTests || (Interchange.InterchangeMustNotDuplicateInterchangeElementNameTests = {}));
                (function (InterchangeMustNotDuplicateInterchangeElementNameTests) {
                    /*[TestFixture]*/
                    class When_elements_have_duplicate_names extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInterchange("Interchange1").WithDocumentation("doc").WithElement(When_elements_have_duplicate_names._duplicateTemplate).WithElement(When_elements_have_duplicate_names._duplicateTemplate).WithEndInterchange().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new InterchangeMustNotDuplicateInterchangeElementName(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Interchange");
                            _errorMessageCollection[0].Message.ShouldContain(When_elements_have_duplicate_names._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("duplicate interchange element");
                            _errorMessageCollection[0].Message.ShouldContain(When_elements_have_duplicate_names._duplicateTemplate);
                        }
                    }
                    When_elements_have_duplicate_names._entityName = "Interchange1";
                    When_elements_have_duplicate_names._duplicateTemplate = "Identity1";
                    InterchangeMustNotDuplicateInterchangeElementNameTests.When_elements_have_duplicate_names = When_elements_have_duplicate_names;
                })(InterchangeMustNotDuplicateInterchangeElementNameTests = Interchange.InterchangeMustNotDuplicateInterchangeElementNameTests || (Interchange.InterchangeMustNotDuplicateInterchangeElementNameTests = {}));
            })(Interchange = Validator.Interchange || (Validator.Interchange = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=InterchangeMustNotDuplicateInterchangeElementNameTests.js.map