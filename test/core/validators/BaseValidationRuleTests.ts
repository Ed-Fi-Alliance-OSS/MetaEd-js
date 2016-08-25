//TODO: This is an extension of BaseValidationTest which is a helper now so this needs to either become a separate helper and duplicate helper logic or something else.

module MetaEd.Tests.Validator {
    export class ValidationRuleTestBase extends BaseValidationTest {
        protected getRuleProvider(): IRuleProvider { throw new Error('not implemented'); }
        protected setupPostBuilder(): void {
            var ruleProvider = GetRuleProvider();
            var validator = new ValidatorListener(ruleProvider);
            validator.WithContext(_metaEdContext);
            ParseTreeWalker.Default.Walk(validator, _parserContext);
        }
    }
    export module ValidationRuleTestBase {
        export class TestRuleProvider<TTestContext extends ParserRuleContext> implements IRuleProvider {
            public suppliedRule: IValidationRule<TTestContext>;
            public getAll<TContext extends ParserRuleContext>(symbolTable: ISymbolTable): IValidationRule<TContext>[] {
                return /*typeof*/TTestContext == /*typeof*/TContext ? new Array(<IValidationRule<TContext>>SuppliedRule) : new Array(0);
            }
        }
    }
}