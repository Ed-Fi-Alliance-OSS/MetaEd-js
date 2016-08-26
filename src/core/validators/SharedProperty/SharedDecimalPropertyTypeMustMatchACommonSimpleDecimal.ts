import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal extends ValidationRuleBase<MetaEdGrammar.SharedDecimalPropertyContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.SharedDecimalPropertyContext): boolean {
        let identifierToMatch = context.sharedPropertyType().GetText();
        let commonDecimalType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_DECIMAL);
        return this.symbolTable.identifierExists(commonDecimalType, identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.SharedDecimalPropertyContext): string {
        return `Shared property '${}' does not match any declared common decimal.", context.propertyName().GetText());
    }
}
