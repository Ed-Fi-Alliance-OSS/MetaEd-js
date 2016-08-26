import { ValidationRuleBase } from "../ValidationRuleBase";
export class AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass extends ValidationRuleBase<MetaEdGrammar.AssociationExtensionContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.AssociationExtensionContext): boolean {
        let identifierToMatch = context.extendeeName().GetText();
        return this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.AssociationExtensionContext): string {
        return `Association additions '${context.extendeeName().GetText()}' does not match any declared Association or subclass.`;
    }
}
