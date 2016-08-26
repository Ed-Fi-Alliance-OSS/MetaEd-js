import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class DomainItemMustMatchTopLevelEntity extends ValidationRuleBase<MetaEdGrammar.DomainItemContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.DomainItemContext): boolean {
        let identifierToMatch = context.IdText();
        return this.symbolTable.identifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.CommonTypeEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.InlineCommonTypeEntityType(), identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.DomainItemContext): string {
        let topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
        return `Domain item '${context.IdText()}' under ${topLevelEntity.EntityIdentifier()} '${topLevelEntity.EntityName()}' does not match any declared abstract entity, domain entity or subclass, association or subclass, or common type.`;
    }
}
