import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
import SymbolTableEntityType from '../SymbolTableEntityType'
export class InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass extends ValidationRuleBase<MetaEdGrammar.InterchangeIdentityTemplateContext>
{
    private symbolTable: ISymbolTable;
    private symbolTableEntityType: SymbolTableEntityType = new SymbolTableEntityType();
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.InterchangeIdentityTemplateContext): boolean {
        let identifierToMatch = context.IdText();
        return this.symbolTable.identifierExists(this.symbolTableEntityType.abstractEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.associationEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.associationSubclassEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.domainEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.domainEntitySubclassEntityType(), identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.InterchangeIdentityTemplateContext): string {
        return `Interchange identity template '${context.IdText()}' does not match any declared domain entity or subclass, association or subclass, or abstract entity.`;
    }
}
