import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class ShortPropertyMustNotMatchACommonSimpleType extends ValidationRuleBase<MetaEdGrammar.ShortPropertyContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.ShortPropertyContext): boolean {
        let identifierToMatch = context.propertyName().getText();
        let commonDecimalType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_DECIMAL);
        let commonIntegerType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_INTEGER);
        let commonShortType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_SHORT);
        let commonStringType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_STRING);
        return !(this.symbolTable.identifierExists(commonDecimalType, identifierToMatch) || this.symbolTable.identifierExists(commonIntegerType, identifierToMatch) || this.symbolTable.identifierExists(commonShortType, identifierToMatch) || this.symbolTable.identifierExists(commonStringType, identifierToMatch));
    }
    public getFailureMessage(context: MetaEdGrammar.ShortPropertyContext): string {
        return `Short property '${context.propertyName().getText()}' has the same name as a common decimal, integer, short or string.  If intentional, use a shared property instead.`;
    }
}
