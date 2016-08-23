var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            class ValidatorListenerTests {
            }
            Validator.ValidatorListenerTests = ValidatorListenerTests;
            (function (ValidatorListenerTests) {
                /*[TestFixture]*/
                class When_validating_meta_ed_grammar extends Validator.ValidationRuleTestBase {
                    metaEdText() {
                        return "Begin Namespace edfi core" + Environment.NewLine + "Domain Entity Test1" + Environment.NewLine + "    documentation 'some documentation" + Environment.NewLine + "    string Property1" + Environment.NewLine + "        documentation 'Property documentation starts here" + Environment.NewLine + "        is part of identity" + Environment.NewLine + "        max length 50" + Environment.NewLine + "Domain Entity Test2" + Environment.NewLine + "    documentation 'duck documentation" + Environment.NewLine + "      integer Property1" + Environment.NewLine + "        documentation 'Property documentation starts here" + Environment.NewLine + "        is part of identity" + Environment.NewLine + "Domain Entity Test3" + Environment.NewLine + "    documentation 'elephant documentation" + Environment.NewLine + "  date Property1" + Environment.NewLine + "        documentation 'Property documentation starts here" + Environment.NewLine + "        is part of identity" + Environment.NewLine + "Domain Entity Test4" + Environment.NewLine + "    documentation 'raccoon documentation" + Environment.NewLine + "    'raccoon documentation" + Environment.NewLine + "    'raccoon documentation" + Environment.NewLine + "    bool Property1" + Environment.NewLine + "        documentation 'Property documentation starts here" + Environment.NewLine + "        is part of identity" + Environment.NewLine + "End Namespace" + Environment.NewLine;
                    }
                    getRuleProvider() {
                        return __init(new Validator.ValidationRuleTestBase.TestRuleProvider(), { SuppliedRule: new ValidatorListenerTests.TestDomainEntityContextValidation() });
                    }
                    should_fail_for_each_domain_entity() {
                        _errorMessageCollection.Count.ShouldEqual(4);
                    }
                    should_set_line_numbers_for_each_validation() {
                        _errorMessageCollection[0].ConcatenatedLineNumber.ShouldEqual(4);
                        _errorMessageCollection[1].ConcatenatedLineNumber.ShouldEqual(10);
                        _errorMessageCollection[2].ConcatenatedLineNumber.ShouldEqual(15);
                        _errorMessageCollection[3].ConcatenatedLineNumber.ShouldEqual(22);
                    }
                    should_set_character_position_for_each_validation() {
                        _errorMessageCollection[0].CharacterPosition.ShouldEqual(4);
                        _errorMessageCollection[1].CharacterPosition.ShouldEqual(6);
                        _errorMessageCollection[2].CharacterPosition.ShouldEqual(2);
                        _errorMessageCollection[3].CharacterPosition.ShouldEqual(4);
                    }
                }
                ValidatorListenerTests.When_validating_meta_ed_grammar = When_validating_meta_ed_grammar;
            })(ValidatorListenerTests = Validator.ValidatorListenerTests || (Validator.ValidatorListenerTests = {}));
            (function (ValidatorListenerTests) {
                class TestDomainEntityContextValidation extends ValidationRuleBase {
                    isValid(context) {
                        return false;
                    }
                    getFailureMessage(context) {
                        return "Property is a validation.";
                    }
                }
                ValidatorListenerTests.TestDomainEntityContextValidation = TestDomainEntityContextValidation;
            })(ValidatorListenerTests = Validator.ValidatorListenerTests || (Validator.ValidatorListenerTests = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=ValidatorListenerTests.js.map