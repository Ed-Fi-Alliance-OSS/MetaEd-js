var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var Interchange;
            (function (Interchange) {
                class InterchangeMustNotDuplicateIdentityTemplateNameTests {
                }
                Interchange.InterchangeMustNotDuplicateIdentityTemplateNameTests = InterchangeMustNotDuplicateIdentityTemplateNameTests;
                (function (InterchangeMustNotDuplicateIdentityTemplateNameTests) {
                    /*[TestFixture]*/
                    class When_identity_templates_have_different_names extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInterchange("Interchange1").WithDocumentation("doc").WithElement("Required").WithIdentityTemplate("Template1").WithIdentityTemplate("Template2").WithEndInterchange().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new InterchangeMustNotDuplicateIdentityTemplateName(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    InterchangeMustNotDuplicateIdentityTemplateNameTests.When_identity_templates_have_different_names = When_identity_templates_have_different_names;
                })(InterchangeMustNotDuplicateIdentityTemplateNameTests = Interchange.InterchangeMustNotDuplicateIdentityTemplateNameTests || (Interchange.InterchangeMustNotDuplicateIdentityTemplateNameTests = {}));
                (function (InterchangeMustNotDuplicateIdentityTemplateNameTests) {
                    /*[TestFixture]*/
                    class When_identity_templates_have_duplicate_names extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInterchange("Interchange1").WithDocumentation("doc").WithElement("Required").WithIdentityTemplate(When_identity_templates_have_duplicate_names._duplicateTemplate).WithIdentityTemplate(When_identity_templates_have_duplicate_names._duplicateTemplate).WithEndInterchange().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new InterchangeMustNotDuplicateIdentityTemplateName(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("Interchange");
                            _errorMessageCollection[0].Message.ShouldContain(When_identity_templates_have_duplicate_names._entityName);
                            _errorMessageCollection[0].Message.ShouldContain("duplicate identity template");
                            _errorMessageCollection[0].Message.ShouldContain(When_identity_templates_have_duplicate_names._duplicateTemplate);
                        }
                    }
                    When_identity_templates_have_duplicate_names._entityName = "Interchange1";
                    When_identity_templates_have_duplicate_names._duplicateTemplate = "Identity1";
                    InterchangeMustNotDuplicateIdentityTemplateNameTests.When_identity_templates_have_duplicate_names = When_identity_templates_have_duplicate_names;
                })(InterchangeMustNotDuplicateIdentityTemplateNameTests = Interchange.InterchangeMustNotDuplicateIdentityTemplateNameTests || (Interchange.InterchangeMustNotDuplicateIdentityTemplateNameTests = {}));
            })(Interchange = Validator.Interchange || (Validator.Interchange = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=InterchangeMustNotDuplicateIdentityTemplateNameTests.js.map