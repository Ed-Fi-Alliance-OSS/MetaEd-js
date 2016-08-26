import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
import SymbolTableEntityType from '../SymbolTableEntityType'
export class AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass extends ValidationRuleBase<MetaEdGrammar.AssociationExtensionContext>
{
    private symbolTable: ISymbolTable;
    private symbolTableEntityType: SymbolTableEntityType = new SymbolTableEntityType();
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.AssociationExtensionContext): boolean {
        let identifierToMatch = context.extendeeName().GetText();
        return this.symbolTable.identifierExists(this.symbolTableEntityType.associationEntityType(), identifierToMatch) 
        || this.symbolTable.identifierExists(this.symbolTableEntityType.associationSubclassEntityType(), identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.AssociationExtensionContext): string {
        return `Association additions '${context.extendeeName().GetText()}' does not match any declared Association or subclass.`;
    }
}
