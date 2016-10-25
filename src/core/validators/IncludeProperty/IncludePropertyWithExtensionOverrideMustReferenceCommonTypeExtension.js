import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
import SymbolTableEntityType from '../SymbolTableEntityType'
export class IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension extends ValidationRuleBase<MetaEdGrammar.IncludePropertyContext>
{
    private symbolTable: ISymbolTable;
    private symbolTableEntityType: SymbolTableEntityType = new SymbolTableEntityType();
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.IncludePropertyContext): boolean {
        if (context.includeExtensionOverride() == null)
            return true;
        let identifierToMatch = context.propertyName().getText();
        return this.symbolTable.identifierExists(this.symbolTableEntityType.commonTypeExtensionEntityType(), identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.IncludePropertyContext): string {
        let topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
        let propertyWithComponents = context.GetAncestorContext<IPropertyWithComponents>();
        return `'include extension' is invalid for property ${propertyWithComponents.IdNode().getText()} on ${topLevelEntity.EntityIdentifier()} '${topLevelEntity.EntityName()}'.  'include extension' is only valid for referencing common type extensions.`;
    }
}
