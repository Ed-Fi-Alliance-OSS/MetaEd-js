module MetaEd.Core.Validator.DomainEntityExtension {
    export class DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName extends ValidationRuleBase<MetaEdGrammar.DomainEntityExtensionContext>
    {
        private _symbolTable: ISymbolTable;
        constructor(symbolTable: ISymbolTable) {
            this._symbolTable = symbolTable;
        }
        public isValid(context: MetaEdGrammar.DomainEntityExtensionContext): boolean {
            return !PropertyRuleContextsForDuplicates(context).Any();
        }
        public getFailureMessage(context: MetaEdGrammar.DomainEntityExtensionContext): string {
            var duplicatePropertyIdentifierList = PropertyRuleContextsForDuplicates(context).Select(x => x.IdNode().GetText());
            return string.Format("Domain Entity additions '{0}' declares '{1}' already in property list of Domain Entity.", context.extendeeName().GetText(), string.Join(",", duplicatePropertyIdentifierList));
        }
        protected propertyRuleContextsForDuplicates(context: MetaEdGrammar.DomainEntityExtensionContext): IEnumerable<IPropertyWithComponents> {
            var entityType = context.DOMAIN_ENTITY().GetText();
            var extensionType = context.DOMAIN_ENTITY().GetText() + context.ADDITIONS();
            var identifier = context.extendeeName().GetText();
            var domainEntityPropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(entityType, identifier).ToList();
            var duplicates = this._symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, domainEntityPropertyIdentifiers);
            return duplicates.Where(IsNotIncludePropertyContextWithExtension);
        }
        private static isNotIncludePropertyContextWithExtension(context: IPropertyWithComponents): boolean {
            if (!(context instanceof MetaEdGrammar.IncludePropertyContext))
                return true;
            return (<MetaEdGrammar.IncludePropertyContext>context).includeExtensionOverride() == null;
        }
    }
}