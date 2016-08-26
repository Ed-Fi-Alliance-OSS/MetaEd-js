import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity extends ValidationRuleBase<MetaEdGrammar.FirstDomainEntityContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.FirstDomainEntityContext): boolean {
        let identifierToMatch = context.IdText();
        return this.symbolTable.identifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
    }

    public getFailureMessage(context: MetaEdGrammar.FirstDomainEntityContext): string {
        return `Domain Entity property '${context.IdText()}' does not match any declared domain or abstract entity.`
    }
}
