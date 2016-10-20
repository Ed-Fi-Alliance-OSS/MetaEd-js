import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class SharedStringPropertyTypeMustMatchACommonSimpleString extends ValidationRuleBase<MetaEdGrammar.SharedStringPropertyContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.SharedStringPropertyContext): boolean {
        let identifierToMatch = context.sharedPropertyType().getText();
        let commonStringType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_STRING);
        return this.symbolTable.identifierExists(commonStringType, identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.SharedStringPropertyContext): string {
        return `Shared property '${context.propertyName().getText()}' does not match any declared common string.`;
    }
}
