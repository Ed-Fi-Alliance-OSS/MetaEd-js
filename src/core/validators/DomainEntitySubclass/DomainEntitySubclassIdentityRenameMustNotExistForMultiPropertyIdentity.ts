import { ValidationRuleBase } from "../ValidationRuleBase";
export class DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity extends ValidationRuleBase<MetaEdGrammar.DomainEntitySubclassContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.DomainEntitySubclassContext): boolean {
        var anyIdentityRenames = context.property().Any(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null);
        if (!anyIdentityRenames)
            return true;
        var baseIdentifier = context.baseName().GetText();
        var baseSymbolTable = this._symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), baseIdentifier);
        if (baseSymbolTable == null)
            return true;
        return baseSymbolTable.PropertySymbolTable.Values().Count(v => v.propertyComponents().propertyAnnotation().identity() != null) <= 1;
    }
    public getFailureMessage(context: MetaEdGrammar.DomainEntitySubclassContext): string {
        var identifier = context.entityName().GetText();
        var baseIdentifier = context.baseName().GetText();
        return string.Format("Domain Entity '{0}' based on '{1}' is invalid for identity rename because parent entity '{1}' has more than one identity property.", identifier, baseIdentifier);
    }
}
