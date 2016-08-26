import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class AssociationExtensionMustNotDuplicateAssociationPropertyName extends ValidationRuleBase<MetaEdGrammar.AssociationExtensionContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.AssociationExtensionContext): boolean {
        return this.propertyRuleContextsForDuplicates(context).length == 0;
    }
    public getFailureMessage(context: MetaEdGrammar.AssociationExtensionContext): string {
        let duplicatePropertyIdentifierList = this.propertyRuleContextsForDuplicates(context).Select(x => x.IdNode().GetText());
        return `Association additions '${context.extendeeName().GetText()}' declares '${duplicatePropertyIdentifierList.join(',')}' already in property list of Association.`;
    }
    protected propertyRuleContextsForDuplicates(context: MetaEdGrammar.AssociationExtensionContext): IEnumerable<IPropertyWithComponents> {
        let entityType = context.ASSOCIATION().GetText();
        let extensionType = context.ASSOCIATION().GetText() + context.ADDITIONS();
        let identifier = context.extendeeName().GetText();
        let associationPropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(entityType, identifier).toList();
        let duplicates = this.symbolTable.contextsForMatchingPropertyIdentifiers(extensionType, identifier, associationPropertyIdentifiers);
        return duplicates.where(AssociationExtensionMustNotDuplicateAssociationPropertyName.isNotIncludePropertyContextWithExtension);
    }
    private static isNotIncludePropertyContextWithExtension(context: IPropertyWithComponents): boolean {
        if (!(context instanceof MetaEdGrammar.IncludePropertyContext))
            return true;
        return (<MetaEdGrammar.IncludePropertyContext>context).includeExtensionOverride() == null;
    }
}
