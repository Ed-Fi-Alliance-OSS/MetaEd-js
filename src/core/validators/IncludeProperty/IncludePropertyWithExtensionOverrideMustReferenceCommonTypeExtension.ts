module MetaEd.Core.Validator.IncludeProperty {
    export class IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension extends ValidationRuleBase<MetaEdGrammar.IncludePropertyContext>
    {
        private _symbolTable: ISymbolTable;
        constructor(symbolTable: ISymbolTable) {
            this._symbolTable = symbolTable;
        }
        public isValid(context: MetaEdGrammar.IncludePropertyContext): boolean {
            if (context.includeExtensionOverride() == null)
                return true;
            var identifierToMatch = context.propertyName().GetText();
            return this._symbolTable.IdentifierExists(SymbolTableEntityType.CommonTypeExtensionEntityType(), identifierToMatch);
        }
        public getFailureMessage(context: MetaEdGrammar.IncludePropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            var propertyWithComponents = context.GetAncestorContext<IPropertyWithComponents>();
            return string.Format("'include extension' is invalid for property {0} on {1} '{2}'.  'include extension' is only valid for referencing common type extensions.",
                propertyWithComponents.IdNode().GetText(),
                topLevelEntity.EntityIdentifier(),
                topLevelEntity.EntityName());
        }
    }
}