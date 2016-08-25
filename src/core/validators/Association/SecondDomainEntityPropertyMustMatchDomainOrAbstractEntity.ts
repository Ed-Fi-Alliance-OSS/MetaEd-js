import { ValidationRuleBase } from "../ValidationRuleBase";
export class SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity extends ValidationRuleBase<MetaEdGrammar.SecondDomainEntityContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.SecondDomainEntityContext): boolean {
        var identifierToMatch = context.IdText();
        return this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.SecondDomainEntityContext): string {
        return `Domain Entity property '${context.IdText()}' does not match any declared domain or abstract entity.`;
    }
}
