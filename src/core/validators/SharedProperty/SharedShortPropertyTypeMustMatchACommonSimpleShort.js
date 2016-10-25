import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class SharedShortPropertyTypeMustMatchACommonSimpleShort extends ValidationRuleBase<MetaEdGrammar.SharedShortPropertyContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.SharedShortPropertyContext): boolean {
        let identifierToMatch = context.sharedPropertyType().getText();
        let commonShortType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_SHORT);
        return this.symbolTable.identifierExists(commonShortType, identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.SharedShortPropertyContext): string {
        return `Shared property '${context.propertyName().getText()}' does not match any declared common short.`;
    }
}
