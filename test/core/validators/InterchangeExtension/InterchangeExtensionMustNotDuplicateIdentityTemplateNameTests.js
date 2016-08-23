var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var InterchangeExtension;
            (function (InterchangeExtension) {
                class InterchangeExtensionMustNotDuplicateIdentityTemplateNameTests {
                }
                InterchangeExtension.InterchangeExtensionMustNotDuplicateIdentityTemplateNameTests = InterchangeExtensionMustNotDuplicateIdentityTemplateNameTests;
                (function (InterchangeExtensionMustNotDuplicateIdentityTemplateNameTests) {
                    /*[TestFixture]*/
                    class When_identity_templates_have_different_names extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInterchangeExtension("Interchange1").WithIdentityTemplate("Template1").WithIdentityTemplate("Template2").WithEndInterchangeExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new InterchangeExtensionMustNotDuplicateIdentityTemplateName(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    InterchangeExtensionMustNotDuplicateIdentityTemplateNameTests.When_identity_templates_have_different_names = When_identity_templates_have_different_names;
                })(InterchangeExtensionMustNotDuplicateIdentityTemplateNameTests = InterchangeExtension.InterchangeExtensionMustNotDuplicateIdentityTemplateNameTests || (InterchangeExtension.InterchangeExtensionMustNotDuplicateIdentityTemplateNameTests = {}));
                (function (InterchangeExtensionMustNotDuplicateIdentityTemplateNameTests) {
                    /*[TestFixture]*/
                    class When_identity_templates_have_duplicate_names extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInterchangeExtension("Interchange1").WithIdentityTemplate(When_identity_templates_have_duplicate_names._duplicateTemplate).WithIdentityTemplate(When_identity_templates_have_duplicate_names._duplicateTemplate).WithEndInterchangeExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new InterchangeExtensionMustNotDuplicateIdentityTemplateName(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Interchange additions");
                            _errorMessageCollection[0].Message.ShouldContain(When_identity_templates_have_duplicate_names._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("duplicate identity template");
                            _errorMessageCollection[0].Message.ShouldContain(When_identity_templates_have_duplicate_names._duplicateTemplate);
                        }
                    }
                    When_identity_templates_have_duplicate_names._entityName = "Interchange1";
                    When_identity_templates_have_duplicate_names._duplicateTemplate = "Identity1";
                    InterchangeExtensionMustNotDuplicateIdentityTemplateNameTests.When_identity_templates_have_duplicate_names = When_identity_templates_have_duplicate_names;
                })(InterchangeExtensionMustNotDuplicateIdentityTemplateNameTests = InterchangeExtension.InterchangeExtensionMustNotDuplicateIdentityTemplateNameTests || (InterchangeExtension.InterchangeExtensionMustNotDuplicateIdentityTemplateNameTests = {}));
            })(InterchangeExtension = Validator.InterchangeExtension || (Validator.InterchangeExtension = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=InterchangeExtensionMustNotDuplicateIdentityTemplateNameTests.js.map