import { ValidationRuleBase } from "../ValidationRuleBase";
    export class AssociationSubclassMustNotDuplicateAssociationPropertyName extends ValidationRuleBase<MetaEdGrammar.AssociationSubclassContext>
    {
        private _symbolTable: ISymbolTable;
        constructor(symbolTable: ISymbolTable) {
            this._symbolTable = symbolTable;
        }
        public isValid(context: MetaEdGrammar.AssociationSubclassContext): boolean {
            var entityType = context.ASSOCIATION().GetText();
            var extensionType = context.ASSOCIATION().GetText() + context.BASED_ON();
            var identifier = context.associationName().GetText();
            var baseIdentifier = context.baseName().GetText();
            var basePropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(entityType, baseIdentifier);
            var subclassPropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(extensionType, identifier);
            return !basePropertyIdentifiers.Intersect(subclassPropertyIdentifiers).Any();
        }
        public getFailureMessage(context: MetaEdGrammar.AssociationSubclassContext): string {
            var entityType = context.ASSOCIATION().GetText();
            var extensionType = context.ASSOCIATION().GetText() + context.BASED_ON();
            var identifier = context.associationName().GetText();
            var baseIdentifier = context.baseName().GetText();
            var associationPropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(entityType, baseIdentifier).ToList();
            var propertyRuleContextsForDuplicates = this._symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, associationPropertyIdentifiers);
            var duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.Select(x => x.IdNode().GetText());
            return string.Format("Association '{0}' based on '{1}' declares '{2}' already in property list of base Association.", identifier, baseIdentifier, string.Join(",", duplicatePropertyIdentifierList));
        }
    }
}