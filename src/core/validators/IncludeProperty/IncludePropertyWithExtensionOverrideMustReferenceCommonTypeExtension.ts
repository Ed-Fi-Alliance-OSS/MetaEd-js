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
        let identifierToMatch = context.propertyName().GetText();
        return this._symbolTable.IdentifierExists(SymbolTableEntityType.CommonTypeExtensionEntityType(), identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.IncludePropertyContext): string {
        let topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
        let propertyWithComponents = context.GetAncestorContext<IPropertyWithComponents>();
        return `'include extension' is invalid for property ${propertyWithComponents.IdNode().GetText()} on ${topLevelEntity.EntityIdentifier()} '${topLevelEntity.EntityName()}'.  'include extension' is only valid for referencing common type extensions.`;
    }
}
