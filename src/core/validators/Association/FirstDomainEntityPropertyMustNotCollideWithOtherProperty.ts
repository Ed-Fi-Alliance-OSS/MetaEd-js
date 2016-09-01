import {ValidationRuleBase} from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
import SymbolTableEntityType from '../SymbolTableEntityType'

let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;

export class FirstDomainEntityPropertyMustNotCollideWithOtherProperty extends ValidationRuleBase
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
        let identifierToMatch = context.propertyName().ID().getText();
        let withContextContext = context.withContext();
        let withContextPrefix = withContextContext == null ? "" : withContextContext.withContextName().ID().getText();
        let associationName = context.parentCtx.associationName().ID().getText();
        let entitySymbolTable = this.symbolTable.get(this.symbolTableEntityType.associationEntityType(), associationName);
        return entitySymbolTable.propertySymbolTable.get(withContextPrefix + identifierToMatch) == null;
    }

    public getFailureMessage(context: any): string {
        let associationName = context.parentCtx.associationName().ID().getText();
        return `Entity ${associationName} has duplicate properties named ${context.propertyName().ID().getText()}`;
    }
}
