import { ValidationRuleBase } from "../ValidationRuleBase";
export class DomainItemMustMatchTopLevelEntity extends ValidationRuleBase<MetaEdGrammar.DomainItemContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.DomainItemContext): boolean {
        let identifierToMatch = context.IdText();
        return this._symbolTable.IdentifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.CommonTypeEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.InlineCommonTypeEntityType(), identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.DomainItemContext): string {
        let topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
        return `Domain item '${context.IdText()}' under ${topLevelEntity.EntityIdentifier()} '${topLevelEntity.EntityName()}' does not match any declared abstract entity, domain entity or subclass, association or subclass, or common type.`;
    }
}
