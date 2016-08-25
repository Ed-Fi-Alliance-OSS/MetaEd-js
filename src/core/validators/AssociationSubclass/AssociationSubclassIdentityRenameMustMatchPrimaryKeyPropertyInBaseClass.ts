import { ValidationRuleBase } from "../ValidationRuleBase";
export class AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass extends ValidationRuleBase<MetaEdGrammar.AssociationSubclassContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.AssociationSubclassContext): boolean {
        var identityRenames = context.property().Where(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null).Select(y => y.GetProperty().propertyComponents().propertyAnnotation().identityRename());
        if (!identityRenames.Any())
            return true;
        var entityType = context.ASSOCIATION().GetText();
        var baseIdentifier = context.baseName().GetText();
        var basePropertyIdentifier = identityRenames.First().baseKeyName().GetText();
        var baseSymbolTable = this._symbolTable.Get(entityType, baseIdentifier);
        if (baseSymbolTable == null)
            return true;
        var baseProperty = baseSymbolTable.PropertySymbolTable.Get(basePropertyIdentifier);
        if (baseProperty == null)
            return false;
        return baseProperty.propertyComponents().propertyAnnotation().identity() != null;
    }
    public getFailureMessage(context: MetaEdGrammar.AssociationSubclassContext): string {
        var identifier = context.associationName().GetText();
        var baseIdentifier = context.baseName().GetText();
        var identityRenames = context.property().Where(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null).Select(y => y.GetProperty().propertyComponents().propertyAnnotation().identityRename());
        var basePropertyIdentifier = identityRenames.First().baseKeyName().GetText();
        return `Association '${identifier}' based on '${baseIdentifier}' tries to rename ${basePropertyIdentifier} which is not part of the identity.`;
    }
}
