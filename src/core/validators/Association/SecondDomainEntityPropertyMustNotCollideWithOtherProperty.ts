import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class SecondDomainEntityPropertyMustNotCollideWithOtherProperty extends ValidationRuleBase<MetaEdGrammar.SecondDomainEntityContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.SecondDomainEntityContext): boolean {
        let identifierToMatch = context.IdText();
        let withContextContext = context.withContext();
        let withContextPrefix = withContextContext == null ? "" : withContextContext.withContextName().ID().GetText();
        let associationName = (<MetaEdGrammar.AssociationContext>context.parent).associationName().IdText();
        let associationType = MetaEdGrammar.TokenName(MetaEdGrammar.ASSOCIATION);
        let entitySymbolTable = this.symbolTable.get(associationType, associationName);
        return entitySymbolTable.propertySymbolTable.get(withContextPrefix + identifierToMatch) == null;
    }
    public getFailureMessage(context: MetaEdGrammar.SecondDomainEntityContext): string {
        let associationName = (<MetaEdGrammar.AssociationContext>context.parent).associationName().IdText();
        return `Entity ${associationName} has duplicate properties named ${context.IdText()}`;
    }
}
