import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class InterchangeExtensionIdentifierMustMatchAnInterchange extends ValidationRuleBase<MetaEdGrammar.InterchangeExtensionContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.InterchangeExtensionContext): boolean {
        let entityType = context.INTERCHANGE().getText();
        let identifier = context.extendeeName().getText();
        return this.symbolTable.identifiersForEntityType(entityType).Any(x => x.Equals(identifier));
    }
    public getFailureMessage(context: MetaEdGrammar.InterchangeExtensionContext): string {
        return `Interchange additions '${context.extendeeName().getText()}' does not match any declared Interchange.`;
    }
}
