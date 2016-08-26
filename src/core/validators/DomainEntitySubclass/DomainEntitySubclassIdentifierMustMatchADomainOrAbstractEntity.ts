import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity extends ValidationRuleBase<MetaEdGrammar.DomainEntitySubclassContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.DomainEntitySubclassContext): boolean {
        let basedOnName = context.baseName().GetText();
        return this.symbolTable.IdentifiersForEntityType(SymbolTableEntityType.DomainEntityEntityType()).Any(x => x.Equals(basedOnName)) || this.symbolTable.IdentifiersForEntityType(SymbolTableEntityType.AbstractEntityEntityType()).Any(x => x.Equals(basedOnName));
    }
    public getFailureMessage(context: MetaEdGrammar.DomainEntitySubclassContext): string {
        return `Domain Entity '${context.entityName().GetText()}' based on '${context.baseName().GetText()}' does not match any declared domain or abstract entity.`;
    }
}
