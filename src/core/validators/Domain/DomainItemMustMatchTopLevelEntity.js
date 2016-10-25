import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
import SymbolTableEntityType from '../SymbolTableEntityType'
export class DomainItemMustMatchTopLevelEntity extends ValidationRuleBase<MetaEdGrammar.DomainItemContext>
{
    private symbolTable: ISymbolTable;
    private symbolTableEntityType: SymbolTableEntityType = new SymbolTableEntityType();
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.DomainItemContext): boolean {
        let identifierToMatch = context.IdText();
        return this.symbolTable.identifierExists(this.symbolTableEntityType.abstractEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.associationEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.associationSubclassEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.domainEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.domainEntitySubclassEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.commonTypeEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.inlineCommonTypeEntityType(), identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.DomainItemContext): string {
        let topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
        return `Domain item '${context.IdText()}' under ${topLevelEntity.EntityIdentifier()} '${topLevelEntity.EntityName()}' does not match any declared abstract entity, domain entity or subclass, association or subclass, or common type.`;
    }
}
