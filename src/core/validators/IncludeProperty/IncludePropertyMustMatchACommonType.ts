import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class IncludePropertyMustMatchACommonType extends ValidationRuleBase<MetaEdGrammar.IncludePropertyContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.IncludePropertyContext): boolean {
        let identifierToMatch = context.propertyName().GetText();
        let commonTypeType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_TYPE);
        let inlineCommonTypeType = MetaEdGrammar.TokenName(MetaEdGrammar.INLINE_COMMON_TYPE);
        let choiceCommonType = MetaEdGrammar.TokenName(MetaEdGrammar.CHOICE_TYPE);
        return this.symbolTable.identifierExists(commonTypeType, identifierToMatch) || this.symbolTable.identifierExists(inlineCommonTypeType, identifierToMatch) || this.symbolTable.identifierExists(choiceCommonType, identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.IncludePropertyContext): string {
        return `Include property '${context.propertyName().GetText()}' does not match any declared common type.`;
    }
}
