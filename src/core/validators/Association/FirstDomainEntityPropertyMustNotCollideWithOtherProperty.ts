import {ValidationRuleBase} from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'

let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;

export class FirstDomainEntityPropertyMustNotCollideWithOtherProperty extends ValidationRuleBase
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }

    public handlesContext(context: any) : boolean {
        return context.ruleIndex === MetaEdGrammar.RULE_firstDomainEntity;
    }

    public isValid(context: any): boolean {
        let identifierToMatch = context.IdText();
        let withContextContext = context.withContext();
        let withContextPrefix = withContextContext == null ? "" : withContextContext.withContextName().ID().GetText();
        let associationName = context.parent.associationName().IdText();
        let associationType = MetaEdGrammar.TokenName(MetaEdGrammar.ASSOCIATION);
        let entitySymbolTable = this.symbolTable.get(associationType, associationName);
        return entitySymbolTable.propertySymbolTable.get(withContextPrefix + identifierToMatch) == null;
    }

    public getFailureMessage(context: any): string {
        let associationName = context.parent.associationName().IdText();
        return `Entity ${associationName} has duplicate properties named ${context.IdText()}`;
    }
}
