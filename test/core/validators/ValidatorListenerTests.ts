module MetaEd.Tests.Validator {
    export class ValidatorListenerTests {

    }
    export module ValidatorListenerTests {
        /*[TestFixture]*/
        export class When_validating_meta_ed_grammar extends ValidationRuleTestBase {
            protected metaEdText(): string {
                return "Begin Namespace edfi core" + Environment.NewLine + "Domain Entity Test1" + Environment.NewLine + "    documentation 'some documentation" + Environment.NewLine + "    string Property1" + Environment.NewLine + "        documentation 'Property documentation starts here" + Environment.NewLine + "        is part of identity" + Environment.NewLine + "        max length 50" + Environment.NewLine + "Domain Entity Test2" + Environment.NewLine + "    documentation 'duck documentation" + Environment.NewLine + "      integer Property1" + Environment.NewLine + "        documentation 'Property documentation starts here" + Environment.NewLine + "        is part of identity" + Environment.NewLine + "Domain Entity Test3" + Environment.NewLine + "    documentation 'elephant documentation" + Environment.NewLine + "  date Property1" + Environment.NewLine + "        documentation 'Property documentation starts here" + Environment.NewLine + "        is part of identity" + Environment.NewLine + "Domain Entity Test4" + Environment.NewLine + "    documentation 'raccoon documentation" + Environment.NewLine + "    'raccoon documentation" + Environment.NewLine + "    'raccoon documentation" + Environment.NewLine + "    bool Property1" + Environment.NewLine + "        documentation 'Property documentation starts here" + Environment.NewLine + "        is part of identity" + Environment.NewLine + "End Namespace" + Environment.NewLine;
            }
            protected getRuleProvider(): IRuleProvider {
                return __init(new ValidationRuleTestBase.TestRuleProvider<MetaEdGrammar.PropertyContext>(), { SuppliedRule: new TestDomainEntityContextValidation() });
            }
            public should_fail_for_each_domain_entity(): void {
                _errorMessageCollection.Count.ShouldEqual(4);
            }
            public should_set_line_numbers_for_each_validation(): void {
                _errorMessageCollection[0].ConcatenatedLineNumber.ShouldEqual(4);
                _errorMessageCollection[1].ConcatenatedLineNumber.ShouldEqual(10);
                _errorMessageCollection[2].ConcatenatedLineNumber.ShouldEqual(15);
                _errorMessageCollection[3].ConcatenatedLineNumber.ShouldEqual(22);
            }
            public should_set_character_position_for_each_validation(): void {
                _errorMessageCollection[0].CharacterPosition.ShouldEqual(4);
                _errorMessageCollection[1].CharacterPosition.ShouldEqual(6);
                _errorMessageCollection[2].CharacterPosition.ShouldEqual(2);
                _errorMessageCollection[3].CharacterPosition.ShouldEqual(4);
            }
        }
    }
    export module ValidatorListenerTests {
        export class TestDomainEntityContextValidation extends ValidationRuleBase<MetaEdGrammar.PropertyContext>
        {
            public isValid(context: MetaEdGrammar.PropertyContext): boolean {
                return false;
            }
            public getFailureMessage(context: MetaEdGrammar.PropertyContext): string {
                return "Property is a validation.";
            }
        }
    }
}