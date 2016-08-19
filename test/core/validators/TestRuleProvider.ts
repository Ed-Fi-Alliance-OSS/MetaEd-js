import {IRuleProvider} from "../../../src/core/validators/RuleProvider";
import {IValidationRule} from "../../../src/core/validators/IValidationRule";
import {ISymbolTable} from "../../../src/core/validators/SymbolTable";
import ParserRuleContext = MetaEdGrammar.ParserRuleContext;

export class TestRuleProvider<TTestContext extends ParserRuleContext> implements IRuleProvider {
    private validationRule : IValidationRule<TTestContext>;

    constructor(validationRule : IValidationRule<TTestContext>) {
        this.validationRule = validationRule;
    }

    public getAll<TContext extends ParserRuleContext>(symbolTable: ISymbolTable) : IValidationRule<TContext>[] {
        return [this.validationRule as any as IValidationRule<TContext>];
    }
}