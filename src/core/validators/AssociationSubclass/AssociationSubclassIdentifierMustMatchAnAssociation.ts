module MetaEd.Core.Validator.AssociationSubclass {
    export class AssociationSubclassIdentifierMustMatchAnAssociation extends ValidationRuleBase<MetaEdGrammar.AssociationSubclassContext>
    {
        private _symbolTable: ISymbolTable;
        constructor(symbolTable: ISymbolTable) {
            this._symbolTable = symbolTable;
        }
        public isValid(context: MetaEdGrammar.AssociationSubclassContext): boolean {
            var associationEntityType = context.ASSOCIATION().GetText();
            var basedOnName = context.baseName().GetText();
            return this._symbolTable.IdentifiersForEntityType(associationEntityType).Any(x => x.Equals(basedOnName));
        }
        public getFailureMessage(context: MetaEdGrammar.AssociationSubclassContext): string {
            return string.Format("Association '{0}' based on '{1}' does not match any declared Association.", context.associationName().GetText(), context.baseName().GetText());
        }
    }
}