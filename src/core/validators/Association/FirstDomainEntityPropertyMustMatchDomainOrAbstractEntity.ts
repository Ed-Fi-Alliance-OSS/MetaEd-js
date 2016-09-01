import {ValidationRuleBase} from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
import SymbolTableEntityType from '../SymbolTableEntityType'

let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;

export class FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity extends ValidationRuleBase
{
    private symbolTable: ISymbolTable;
    private symbolTableEntityType: SymbolTableEntityType = new SymbolTableEntityType();
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }

    public handlesContext(context: any) : boolean {
        return context.ruleIndex === MetaEdGrammar.RULE_firstDomainEntity;
    }

    public isValid(context: any): boolean {
        let identifierToMatch = context.propertyName().ID().getText();
        return this.symbolTable.identifierExists(this.symbolTableEntityType.domainEntityEntityType(), identifierToMatch) 
        || this.symbolTable.identifierExists(this.symbolTableEntityType.abstractEntityEntityType(), identifierToMatch) 
        || this.symbolTable.identifierExists(this.symbolTableEntityType.domainEntitySubclassEntityType(), identifierToMatch);
    }

    public getFailureMessage(context: any): string {
        return `Domain Entity property '${context.propertyName().ID().getText()}' does not match any declared domain or abstract entity.`
    }
}
