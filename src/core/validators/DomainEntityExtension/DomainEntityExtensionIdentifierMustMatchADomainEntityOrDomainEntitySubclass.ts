import { ValidationRuleBase } from "../ValidationRuleBase";
export class DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass extends ValidationRuleBase<MetaEdGrammar.DomainEntityExtensionContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.DomainEntityExtensionContext): boolean {
        var identifier = context.extendeeName().GetText();
        return this._symbolTable.IdentifiersForEntityType(SymbolTableEntityType.DomainEntityEntityType()).Any(x => x.Equals(identifier)) || this._symbolTable.IdentifiersForEntityType(SymbolTableEntityType.DomainEntitySubclassEntityType()).Any(x => x.Equals(identifier));
    }
    public getFailureMessage(context: MetaEdGrammar.DomainEntityExtensionContext): string {
        return `Domain Entity additions '${context.extendeeName().GetText()}' does not match any declared Domain Entity or Domain Entity Subclass.`;
    }
}
