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
        let entityType = context.INTERCHANGE().GetText();
        let identifier = context.extendeeName().GetText();
        return this.symbolTable.identifiersForEntityType(entityType).Any(x => x.Equals(identifier));
    }
    public getFailureMessage(context: MetaEdGrammar.InterchangeExtensionContext): string {
        return `Interchange additions '${context.extendeeName().GetText()}' does not match any declared Interchange.`;
    }
}
