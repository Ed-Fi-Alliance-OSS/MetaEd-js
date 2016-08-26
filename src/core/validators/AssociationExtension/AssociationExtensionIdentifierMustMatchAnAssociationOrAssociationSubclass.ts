import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass extends ValidationRuleBase<MetaEdGrammar.AssociationExtensionContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.AssociationExtensionContext): boolean {
        let identifierToMatch = context.extendeeName().GetText();
        return this.symbolTable.identifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.AssociationExtensionContext): string {
        return `Association additions '${context.extendeeName().GetText()}' does not match any declared Association or subclass.`;
    }
}
