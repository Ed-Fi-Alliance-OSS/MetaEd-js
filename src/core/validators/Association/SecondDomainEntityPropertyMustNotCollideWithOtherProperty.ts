module MetaEd.Core.Validator.Association {
    export class SecondDomainEntityPropertyMustNotCollideWithOtherProperty extends ValidationRuleBase<MetaEdGrammar.SecondDomainEntityContext>
    {
        private _symbolTable: ISymbolTable;
        constructor(symbolTable: ISymbolTable) {
            this._symbolTable = symbolTable;
        }
        public isValid(context: MetaEdGrammar.SecondDomainEntityContext): boolean {
            var identifierToMatch = context.IdText();
            var withContextContext = context.withContext();
            var withContextPrefix = withContextContext == null ? string.Empty : withContextContext.withContextName().ID().GetText();
            var associationName = (<MetaEdGrammar.AssociationContext>context.parent).associationName().IdText();
            var associationType = MetaEdGrammar.TokenName(MetaEdGrammar.ASSOCIATION);
            var entitySymbolTable = this._symbolTable.Get(associationType, associationName);
            return entitySymbolTable.PropertySymbolTable.Get(withContextPrefix + identifierToMatch) == null;
        }
        public getFailureMessage(context: MetaEdGrammar.SecondDomainEntityContext): string {
            var associationName = (<MetaEdGrammar.AssociationContext>context.parent).associationName().IdText();
            return string.Format("Entity {0} has duplicate properties named {1}", associationName, context.IdText());
        }
    }
}