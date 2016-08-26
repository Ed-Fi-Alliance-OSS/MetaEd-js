import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity extends ValidationRuleBase<MetaEdGrammar.SecondDomainEntityContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.SecondDomainEntityContext): boolean {
        let identifierToMatch = context.IdText();
        return this.symbolTable.identifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.SecondDomainEntityContext): string {
        return `Domain Entity property '${context.IdText()}' does not match any declared domain or abstract entity.`;
    }
}
