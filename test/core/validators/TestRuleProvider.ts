import {IRuleProvider} from "../../../src/core/validators/RuleProvider";
import {IValidationRule} from "../../../src/core/validators/IValidationRule";
import {ISymbolTable} from "../../../src/core/validators/SymbolTable";

export default class TestRuleProvider implements IRuleProvider {
    private validationRule : IValidationRule;
    private ruleIndex : Number;

    constructor(ruleIndex : number, validationRule : IValidationRule) {
        if (ruleIndex === undefined) throw new Error("undefined rule index in test");
        this.ruleIndex = ruleIndex;
        this.validationRule = validationRule;
    }

    public getAll(ruleIndex: number, symbolTable: ISymbolTable) : IValidationRule[] {
        return this.ruleIndex === ruleIndex ? [this.validationRule] : [];
    }
}