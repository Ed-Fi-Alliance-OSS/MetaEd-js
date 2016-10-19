import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class CommonTypeExtensionIdentifierMustMatchACommonType extends ValidationRuleBase<MetaEdGrammar.CommonTypeExtensionContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.CommonTypeExtensionContext): boolean {
        let entityType = context.COMMON_TYPE().GetText();
        let identifier = context.extendeeName().GetText();
        return this.symbolTable.identifiersForEntityType(entityType).Any(x => x.Equals(identifier));
    }
    public getFailureMessage(context: MetaEdGrammar.CommonTypeExtensionContext): string {
        return `Common Type additions '${context.extendeeName().GetText()}' does not match any declared Common Type.`;
    }
}
