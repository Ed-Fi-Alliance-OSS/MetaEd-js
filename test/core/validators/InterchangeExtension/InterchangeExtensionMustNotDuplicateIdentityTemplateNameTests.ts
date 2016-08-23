module MetaEd.Tests.Validator.InterchangeExtension {
    export class InterchangeExtensionMustNotDuplicateIdentityTemplateNameTests {

    }
    export module InterchangeExtensionMustNotDuplicateIdentityTemplateNameTests {
        /*[TestFixture]*/
        export class When_identity_templates_have_different_names extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInterchangeExtension("Interchange1").WithIdentityTemplate("Template1").WithIdentityTemplate("Template2").WithEndInterchangeExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.InterchangeExtensionContext>(), { SuppliedRule: new InterchangeExtensionMustNotDuplicateIdentityTemplateName(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module InterchangeExtensionMustNotDuplicateIdentityTemplateNameTests {
        /*[TestFixture]*/
        export class When_identity_templates_have_duplicate_names extends ValidationRuleTestBase {
            protected static _entityName: string = "Interchange1";
            protected static _duplicateTemplate: string = "Identity1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartInterchangeExtension("Interchange1").WithIdentityTemplate(When_identity_templates_have_duplicate_names._duplicateTemplate).WithIdentityTemplate(When_identity_templates_have_duplicate_names._duplicateTemplate).WithEndInterchangeExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.InterchangeExtensionContext>(), { SuppliedRule: new InterchangeExtensionMustNotDuplicateIdentityTemplateName(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Interchange additions");
                _errorMessageCollection[0].Message.ShouldContain(When_identity_templates_have_duplicate_names._entityName);
                _errorMessageCollection[0].Message.ShouldContain("duplicate identity template");
                _errorMessageCollection[0].Message.ShouldContain(When_identity_templates_have_duplicate_names._duplicateTemplate);
            }
        }
    }
}