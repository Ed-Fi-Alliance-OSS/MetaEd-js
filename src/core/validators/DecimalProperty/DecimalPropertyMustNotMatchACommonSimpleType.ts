import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class DecimalPropertyMustNotMatchACommonSimpleType extends ValidationRuleBase<MetaEdGrammar.DecimalPropertyContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.DecimalPropertyContext): boolean {
        let identifierToMatch = context.propertyName().GetText();
        let commonDecimalType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_DECIMAL);
        let commonIntegerType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_INTEGER);
        let commonShortType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_SHORT);
        let commonStringType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_STRING);
        return !(this.symbolTable.identifierExists(commonDecimalType, identifierToMatch) || this.symbolTable.identifierExists(commonIntegerType, identifierToMatch) || this.symbolTable.identifierExists(commonShortType, identifierToMatch) || this.symbolTable.identifierExists(commonStringType, identifierToMatch));
    }
    public getFailureMessage(context: MetaEdGrammar.DecimalPropertyContext): string {
        return `Decimal property '${context.propertyName().GetText()}' has the same name as a common decimal, integer, short or string.  If intentional, use a shared property instead.`;
    }
}
