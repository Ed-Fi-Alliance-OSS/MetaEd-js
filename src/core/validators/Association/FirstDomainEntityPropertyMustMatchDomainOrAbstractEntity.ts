import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
import SymbolTableEntityType from '../SymbolTableEntityType'
export class FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity extends ValidationRuleBase<MetaEdGrammar.FirstDomainEntityContext>
{
    private symbolTable: ISymbolTable;
    private symbolTableEntityType: SymbolTableEntityType;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
        this.symbolTableEntityType = new SymbolTableEntityType();
    }
    public isValid(context: MetaEdGrammar.FirstDomainEntityContext): boolean {
        let identifierToMatch = context.IdText();
        return this.symbolTable.identifierExists(this.symbolTableEntityType.domainEntityEntityType(), identifierToMatch) 
        || this.symbolTable.identifierExists(this.symbolTableEntityType.abstractEntityEntityType(), identifierToMatch) 
        || this.symbolTable.identifierExists(this.symbolTableEntityType.domainEntitySubclassEntityType(), identifierToMatch);
    }

    public getFailureMessage(context: MetaEdGrammar.FirstDomainEntityContext): string {
        return `Domain Entity property '${context.IdText()}' does not match any declared domain or abstract entity.`
    }
}
