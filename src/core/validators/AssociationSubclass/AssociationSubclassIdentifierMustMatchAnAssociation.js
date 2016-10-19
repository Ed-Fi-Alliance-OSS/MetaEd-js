import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class AssociationSubclassIdentifierMustMatchAnAssociation extends ValidationRuleBase<MetaEdGrammar.AssociationSubclassContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.AssociationSubclassContext): boolean {
        let associationEntityType = context.ASSOCIATION().GetText();
        let basedOnName = context.baseName().GetText();
        return this.symbolTable.identifiersForEntityType(associationEntityType).Any(x => x.Equals(basedOnName));
    }
    public getFailureMessage(context: MetaEdGrammar.AssociationSubclassContext): string {
        return `Association '${context.associationName().GetText()}' based on '${context.baseName().GetText()}' does not match any declared Association.`;
    }
}
