import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass extends ValidationRuleBase<MetaEdGrammar.InterchangeIdentityTemplateContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.InterchangeIdentityTemplateContext): boolean {
        let identifierToMatch = context.IdText();
        return this.symbolTable.identifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.InterchangeIdentityTemplateContext): string {
        return `Interchange identity template '${context.IdText()}' does not match any declared domain entity or subclass, association or subclass, or abstract entity.`;
    }
}
