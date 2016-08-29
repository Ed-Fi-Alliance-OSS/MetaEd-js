import {ValidationRuleBase} from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
import SymbolTableEntityType from '../SymbolTableEntityType'

let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;

export class FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity extends ValidationRuleBase
{
    private symbolTable: ISymbolTable;
    private symbolTableEntityType: SymbolTableEntityType;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
        this.symbolTableEntityType = new SymbolTableEntityType();
    }

    public handlesContext(context: any) : boolean {
        return context.ruleIndex === MetaEdGrammar.RULE_firstDomainEntity;
    }

    public isValid(context: any): boolean {
        let identifierToMatch = context.IdText();
        return this.symbolTable.identifierExists(this.symbolTableEntityType.domainEntityEntityType(), identifierToMatch) 
        || this.symbolTable.identifierExists(this.symbolTableEntityType.abstractEntityEntityType(), identifierToMatch) 
        || this.symbolTable.identifierExists(this.symbolTableEntityType.domainEntitySubclassEntityType(), identifierToMatch);
    }

    public getFailureMessage(context: any): string {
        return `Domain Entity property '${context.IdText()}' does not match any declared domain or abstract entity.`
    }
}
