module MetaEd.Core.Validator.Interchange {
    export class InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass extends ValidationRuleBase<MetaEdGrammar.InterchangeIdentityTemplateContext>
    {
        private _symbolTable: ISymbolTable;
        constructor(symbolTable: ISymbolTable) {
            this._symbolTable = symbolTable;
        }
        public isValid(context: MetaEdGrammar.InterchangeIdentityTemplateContext): boolean {
            var identifierToMatch = context.IdText();
            return this._symbolTable.IdentifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
        }
        public getFailureMessage(context: MetaEdGrammar.InterchangeIdentityTemplateContext): string {
            return string.Format("Interchange identity template '{0}' does not match any declared domain entity or subclass, association or subclass, or abstract entity.", context.IdText());
        }
    }
}