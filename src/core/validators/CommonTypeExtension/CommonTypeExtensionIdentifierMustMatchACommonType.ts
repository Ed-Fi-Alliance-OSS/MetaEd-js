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
        let entityType = context.COMMON_TYPE().getText();
        let identifier = context.extendeeName().getText();
        return this.symbolTable.identifiersForEntityType(entityType).Any(x => x.Equals(identifier));
    }
    public getFailureMessage(context: MetaEdGrammar.CommonTypeExtensionContext): string {
        return `Common Type additions '${context.extendeeName().getText()}' does not match any declared Common Type.`;
    }
}
