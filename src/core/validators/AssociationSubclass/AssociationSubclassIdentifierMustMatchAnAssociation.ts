import { ValidationRuleBase } from "../ValidationRuleBase";
export class AssociationSubclassIdentifierMustMatchAnAssociation extends ValidationRuleBase<MetaEdGrammar.AssociationSubclassContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.AssociationSubclassContext): boolean {
        let associationEntityType = context.ASSOCIATION().GetText();
        let basedOnName = context.baseName().GetText();
        return this._symbolTable.IdentifiersForEntityType(associationEntityType).Any(x => x.Equals(basedOnName));
    }
    public getFailureMessage(context: MetaEdGrammar.AssociationSubclassContext): string {
        return `Association '${context.associationName().GetText()}' based on '${context.baseName().GetText()}' does not match any declared Association.`;
    }
}
