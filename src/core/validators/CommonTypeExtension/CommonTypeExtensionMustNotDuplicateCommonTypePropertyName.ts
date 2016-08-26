import { ValidationRuleBase } from "../ValidationRuleBase";
export class CommonTypeExtensionMustNotDuplicateCommonTypePropertyName extends ValidationRuleBase<MetaEdGrammar.CommonTypeExtensionContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.CommonTypeExtensionContext): boolean {
        let entityType = context.COMMON_TYPE().GetText();
        let extensionType = context.COMMON_TYPE().GetText() + context.ADDITIONS();
        let identifier = context.extendeeName().GetText();
        let commonTypePropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(entityType, identifier);
        let extensionPropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(extensionType, identifier);
        return !commonTypePropertyIdentifiers.Intersect(extensionPropertyIdentifiers).Any();
    }
    public getFailureMessage(context: MetaEdGrammar.CommonTypeExtensionContext): string {
        let entityType = context.COMMON_TYPE().GetText();
        let extensionType = context.COMMON_TYPE().GetText() + context.ADDITIONS();
        let identifier = context.extendeeName().GetText();
        let commonTypePropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(entityType, identifier).ToList();
        let propertyRuleContextsForDuplicates = this._symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, commonTypePropertyIdentifiers);
        let duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.Select(x => x.IdNode().GetText());
        let joinedString = duplicatePropertyIdentifierList;
        return `Common Type additions '${identifier}' declares '${joinedString}' already in property list of Common Type.`;
    }
}
