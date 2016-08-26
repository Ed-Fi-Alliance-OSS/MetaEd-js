import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
import SymbolTableEntityType from '../SymbolTableEntityType'
export class SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity extends ValidationRuleBase<MetaEdGrammar.SecondDomainEntityContext>
{
    private symbolTable: ISymbolTable;
    private symbolTableEntityType: SymbolTableEntityType = new SymbolTableEntityType();
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.SecondDomainEntityContext): boolean {
        let identifierToMatch = context.IdText();
        return this.symbolTable.identifierExists(this.symbolTableEntityType.domainEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.abstractEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.domainEntitySubclassEntityType(), identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.SecondDomainEntityContext): string {
        return `Domain Entity property '${context.IdText()}' does not match any declared domain or abstract entity.`;
    }
}
