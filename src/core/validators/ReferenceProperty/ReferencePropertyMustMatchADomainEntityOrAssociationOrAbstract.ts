import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
import SymbolTableEntityType from '../SymbolTableEntityType'

export class ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract extends ValidationRuleBase<MetaEdGrammar.ReferencePropertyContext>
{
    private symbolTable: ISymbolTable;
    private symbolTableEntityType: SymbolTableEntityType = new SymbolTableEntityType();
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
        
    }
    public isValid(context: MetaEdGrammar.ReferencePropertyContext): boolean {
        let identifierToMatch = context.propertyName().GetText();
        return this.symbolTable.identifierExists(this.symbolTableEntityType.abstractEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.associationEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.associationSubclassEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.domainEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.domainEntitySubclassEntityType(), identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.ReferencePropertyContext): string {
        return `Reference property '${context.propertyName().GetText()}' does not match any declared domain entity or subclass, association or subclass, or abstract entity.`;
    }
}
