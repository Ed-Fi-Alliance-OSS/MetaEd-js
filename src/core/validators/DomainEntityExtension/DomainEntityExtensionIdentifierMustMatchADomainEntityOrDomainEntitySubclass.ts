import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
import SymbolTableEntityType from '../SymbolTableEntityType'
export class DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass extends ValidationRuleBase<MetaEdGrammar.DomainEntityExtensionContext>
{
    private symbolTable: ISymbolTable;
    private symbolTableEntityType: SymbolTableEntityType = new SymbolTableEntityType();
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.DomainEntityExtensionContext): boolean {
        let identifier = context.extendeeName().GetText();
        return this.symbolTable.identifiersForEntityType(this.symbolTableEntityType.domainEntityEntityType()).Any(x => x.Equals(identifier)) || this.symbolTable.identifiersForEntityType(this.symbolTableEntityType.domainEntitySubclassEntityType()).Any(x => x.Equals(identifier));
    }
    public getFailureMessage(context: MetaEdGrammar.DomainEntityExtensionContext): string {
        return `Domain Entity additions '${context.extendeeName().GetText()}' does not match any declared Domain Entity or Domain Entity Subclass.`;
    }
}
