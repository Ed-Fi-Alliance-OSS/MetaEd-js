import { ValidationRuleBase } from "../ValidationRuleBase";
export class FirstDomainEntityPropertyMustNotCollideWithOtherProperty extends ValidationRuleBase<MetaEdGrammar.FirstDomainEntityContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.FirstDomainEntityContext): boolean {
        let identifierToMatch = context.IdText();
        let withContextContext = context.withContext();
        let withContextPrefix = withContextContext == null ? "" : withContextContext.withContextName().ID().GetText();
        let associationName = (<MetaEdGrammar.AssociationContext>context.parent).associationName().IdText();
        let associationType = MetaEdGrammar.TokenName(MetaEdGrammar.ASSOCIATION);
        let entitySymbolTable = this._symbolTable.Get(associationType, associationName);
        return entitySymbolTable.PropertySymbolTable.Get(withContextPrefix + identifierToMatch) == null;
    }
    public getFailureMessage(context: MetaEdGrammar.FirstDomainEntityContext): string {
        let associationName = (<MetaEdGrammar.AssociationContext>context.parent).associationName().IdText();
        return `Entity ${associationName} has duplicate properties named ${context.IdText()}`;
    }
}
