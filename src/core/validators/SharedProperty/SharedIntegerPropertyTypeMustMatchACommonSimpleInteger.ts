import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class SharedIntegerPropertyTypeMustMatchACommonSimpleInteger extends ValidationRuleBase<MetaEdGrammar.SharedIntegerPropertyContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.SharedIntegerPropertyContext): boolean {
        let identifierToMatch = context.sharedPropertyType().GetText();
        let commonIntegerType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_INTEGER);
        return this.symbolTable.identifierExists(commonIntegerType, identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.SharedIntegerPropertyContext): string {
        return `Shared property '${context.propertyName().GetText()}' does not match any declared common integer.", );
    }
}
