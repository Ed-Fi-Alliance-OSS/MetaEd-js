import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass extends ValidationRuleBase<MetaEdGrammar.DomainEntityExtensionContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.DomainEntityExtensionContext): boolean {
        let identifier = context.extendeeName().GetText();
        return this.symbolTable.IdentifiersForEntityType(SymbolTableEntityType.DomainEntityEntityType()).Any(x => x.Equals(identifier)) || this.symbolTable.IdentifiersForEntityType(SymbolTableEntityType.DomainEntitySubclassEntityType()).Any(x => x.Equals(identifier));
    }
    public getFailureMessage(context: MetaEdGrammar.DomainEntityExtensionContext): string {
        return `Domain Entity additions '${context.extendeeName().GetText()}' does not match any declared Domain Entity or Domain Entity Subclass.`;
    }
}
