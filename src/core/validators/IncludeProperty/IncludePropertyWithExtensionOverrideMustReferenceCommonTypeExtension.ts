import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension extends ValidationRuleBase<MetaEdGrammar.IncludePropertyContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.IncludePropertyContext): boolean {
        if (context.includeExtensionOverride() == null)
            return true;
        let identifierToMatch = context.propertyName().GetText();
        return this.symbolTable.identifierExists(SymbolTableEntityType.CommonTypeExtensionEntityType(), identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.IncludePropertyContext): string {
        let topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
        let propertyWithComponents = context.GetAncestorContext<IPropertyWithComponents>();
        return `'include extension' is invalid for property ${propertyWithComponents.IdNode().GetText()} on ${topLevelEntity.EntityIdentifier()} '${topLevelEntity.EntityName()}'.  'include extension' is only valid for referencing common type extensions.`;
    }
}
