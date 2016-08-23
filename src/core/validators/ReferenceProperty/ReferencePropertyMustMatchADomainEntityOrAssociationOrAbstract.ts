module MetaEd.Core.Validator.ReferenceProperty {
    export class ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract extends ValidationRuleBase<MetaEdGrammar.ReferencePropertyContext>
    {
        private _symbolTable: ISymbolTable;
        constructor(symbolTable: ISymbolTable) {
            this._symbolTable = symbolTable;
        }
        public isValid(context: MetaEdGrammar.ReferencePropertyContext): boolean {
            var identifierToMatch = context.propertyName().GetText();
            return this._symbolTable.IdentifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
        }
        public getFailureMessage(context: MetaEdGrammar.ReferencePropertyContext): string {
            return string.Format("Reference property '{0}' does not match any declared domain entity or subclass, association or subclass, or abstract entity.", context.propertyName().GetText());
        }
    }
}