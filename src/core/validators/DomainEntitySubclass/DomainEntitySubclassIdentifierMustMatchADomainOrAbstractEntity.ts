import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
import SymbolTableEntityType from '../SymbolTableEntityType'
export class DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity extends ValidationRuleBase<MetaEdGrammar.DomainEntitySubclassContext>
{
    private symbolTable: ISymbolTable;
    private symbolTableEntityType: SymbolTableEntityType = new SymbolTableEntityType();
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.DomainEntitySubclassContext): boolean {
        let basedOnName = context.baseName().GetText();
        return this.symbolTable.identifiersForEntityType(this.symbolTableEntityType.domainEntityEntityType()).Any(x => x.Equals(basedOnName)) || this.symbolTable.identifiersForEntityType(this.symbolTableEntityType.abstractEntityEntityType()).Any(x => x.Equals(basedOnName));
    }
    public getFailureMessage(context: MetaEdGrammar.DomainEntitySubclassContext): string {
        return `Domain Entity '${context.entityName().GetText()}' based on '${context.baseName().GetText()}' does not match any declared domain or abstract entity.`;
    }
}
