import { ValidationRuleBase } from "../ValidationRuleBase";
export class AssociationExtensionMustNotDuplicateAssociationPropertyName extends ValidationRuleBase<MetaEdGrammar.AssociationExtensionContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.AssociationExtensionContext): boolean {
        return this.propertyRuleContextsForDuplicates(context).length == 0;
    }
    public getFailureMessage(context: MetaEdGrammar.AssociationExtensionContext): string {
        var duplicatePropertyIdentifierList = this.propertyRuleContextsForDuplicates(context).Select(x => x.IdNode().GetText());
        return `Association additions '${context.extendeeName().GetText()}' declares '${duplicatePropertyIdentifierList.join(',')}' already in property list of Association.`;
    }
    protected propertyRuleContextsForDuplicates(context: MetaEdGrammar.AssociationExtensionContext): IEnumerable<IPropertyWithComponents> {
        var entityType = context.ASSOCIATION().GetText();
        var extensionType = context.ASSOCIATION().GetText() + context.ADDITIONS();
        var identifier = context.extendeeName().GetText();
        var associationPropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(entityType, identifier).ToList();
        var duplicates = this._symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, associationPropertyIdentifiers);
        return duplicates.Where(AssociationExtensionMustNotDuplicateAssociationPropertyName.isNotIncludePropertyContextWithExtension);
    }
    private static isNotIncludePropertyContextWithExtension(context: IPropertyWithComponents): boolean {
        if (!(context instanceof MetaEdGrammar.IncludePropertyContext))
            return true;
        return (<MetaEdGrammar.IncludePropertyContext>context).includeExtensionOverride() == null;
    }
}
