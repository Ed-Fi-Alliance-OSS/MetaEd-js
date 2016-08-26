import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract extends ValidationRuleBase<MetaEdGrammar.ReferencePropertyContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.ReferencePropertyContext): boolean {
        let identifierToMatch = context.propertyName().GetText();
        return this.symbolTable.identifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.ReferencePropertyContext): string {
        return `Reference property '${context.propertyName().GetText()}' does not match any declared domain entity or subclass, association or subclass, or abstract entity.`;
    }
}
