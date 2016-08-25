import { ValidationRuleBase } from "../ValidationRuleBase";
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
        return `'include extension' is invalid for property ${propertyWithComponents.IdNode().GetText()} on ${topLevelEntity.EntityIdentifier()} '${topLevelEntity.EntityName()}'.  'include extension' is only valid for referencing common type extensions.`;
    }
}
