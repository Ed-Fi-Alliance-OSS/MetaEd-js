import { ValidationRuleBase } from "../ValidationRuleBase";
export class AssociationSubclassMustNotDuplicateAssociationPropertyName extends ValidationRuleBase<MetaEdGrammar.AssociationSubclassContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.AssociationSubclassContext): boolean {
        let entityType = context.ASSOCIATION().GetText();
        let extensionType = context.ASSOCIATION().GetText() + context.BASED_ON();
        let identifier = context.associationName().GetText();
        let baseIdentifier = context.baseName().GetText();
        let basePropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(entityType, baseIdentifier);
        let subclassPropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(extensionType, identifier);
        return !basePropertyIdentifiers.Intersect(subclassPropertyIdentifiers).Any();
    }
    public getFailureMessage(context: MetaEdGrammar.AssociationSubclassContext): string {
        let entityType = context.ASSOCIATION().GetText();
        let extensionType = context.ASSOCIATION().GetText() + context.BASED_ON();
        let identifier = context.associationName().GetText();
        let baseIdentifier = context.baseName().GetText();
        let associationPropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(entityType, baseIdentifier).ToList();
        let propertyRuleContextsForDuplicates = this._symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, associationPropertyIdentifiers);
        let duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.Select(x => x.IdNode().GetText());
        return `Association '${identifier}' based on '${baseIdentifier}' declares '${duplicatePropertyIdentifierList.join(','))}' already in property list of base Association.`;
    }
}
