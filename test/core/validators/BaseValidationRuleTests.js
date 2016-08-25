//TODO: This is an extension of BaseValidationTest which is a helper now so this needs to either become a separate helper and duplicate helper logic or something else.
var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            class ValidationRuleTestBase extends BaseValidationTest {
                getRuleProvider() { throw new Error('not implemented'); }
                setupPostBuilder() {
                    var ruleProvider = GetRuleProvider();
                    var validator = new ValidatorListener(ruleProvider);
                    validator.WithContext(_metaEdContext);
                    ParseTreeWalker.Default.Walk(validator, _parserContext);
                }
            }
            Validator.ValidationRuleTestBase = ValidationRuleTestBase;
            (function (ValidationRuleTestBase) {
                class TestRuleProvider {
                    getAll(symbolTable) {
                        return TTestContext == TContext ? new Array(SuppliedRule) : new Array(0);
                    }
                }
                ValidationRuleTestBase.TestRuleProvider = TestRuleProvider;
            })(ValidationRuleTestBase = Validator.ValidationRuleTestBase || (Validator.ValidationRuleTestBase = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=BaseValidationRuleTests.js.map