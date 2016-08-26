import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass extends ValidationRuleBase<MetaEdGrammar.InterchangeElementContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.InterchangeElementContext): boolean {
        let identifierToMatch = context.IdText();
        return this.symbolTable.identifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.InterchangeElementContext): string {
        return `Interchange element '${context.IdText()}' does not match any declared domain entity or subclass, association or subclass.`;
    }
}
