import { ValidationRuleBase } from "../ValidationRuleBase";
export class CommonTypeExtensionMustNotDuplicateCommonTypePropertyName extends ValidationRuleBase<MetaEdGrammar.CommonTypeExtensionContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.CommonTypeExtensionContext): boolean {
        var entityType = context.COMMON_TYPE().GetText();
        var extensionType = context.COMMON_TYPE().GetText() + context.ADDITIONS();
        var identifier = context.extendeeName().GetText();
        var commonTypePropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(entityType, identifier);
        var extensionPropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(extensionType, identifier);
        return !commonTypePropertyIdentifiers.Intersect(extensionPropertyIdentifiers).Any();
    }
    public getFailureMessage(context: MetaEdGrammar.CommonTypeExtensionContext): string {
        var entityType = context.COMMON_TYPE().GetText();
        var extensionType = context.COMMON_TYPE().GetText() + context.ADDITIONS();
        var identifier = context.extendeeName().GetText();
        var commonTypePropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(entityType, identifier).ToList();
        var propertyRuleContextsForDuplicates = this._symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, commonTypePropertyIdentifiers);
        var duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.Select(x => x.IdNode().GetText());
        let joinedString = duplicatePropertyIdentifierList;
        return `Common Type additions '${identifier}' declares '${joinedString}' already in property list of Common Type.`;
    }
}
