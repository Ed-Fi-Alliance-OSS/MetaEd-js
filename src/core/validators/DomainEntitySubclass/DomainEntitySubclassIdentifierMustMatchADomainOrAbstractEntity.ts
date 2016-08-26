import { ValidationRuleBase } from "../ValidationRuleBase";
export class DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity extends ValidationRuleBase<MetaEdGrammar.DomainEntitySubclassContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.DomainEntitySubclassContext): boolean {
        let basedOnName = context.baseName().GetText();
        return this._symbolTable.IdentifiersForEntityType(SymbolTableEntityType.DomainEntityEntityType()).Any(x => x.Equals(basedOnName)) || this._symbolTable.IdentifiersForEntityType(SymbolTableEntityType.AbstractEntityEntityType()).Any(x => x.Equals(basedOnName));
    }
    public getFailureMessage(context: MetaEdGrammar.DomainEntitySubclassContext): string {
        return `Domain Entity '${context.entityName().GetText()}' based on '${context.baseName().GetText()}' does not match any declared domain or abstract entity.`;
    }
}
