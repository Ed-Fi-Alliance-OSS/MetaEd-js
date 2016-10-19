import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass extends ValidationRuleBase<MetaEdGrammar.AssociationSubclassContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.AssociationSubclassContext): boolean {
        let identityRenames = context.property().Where(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null).Select(y => y.GetProperty().propertyComponents().propertyAnnotation().identityRename());
        if (!identityRenames.Any())
            return true;
        let entityType = context.ASSOCIATION().GetText();
        let baseIdentifier = context.baseName().GetText();
        let basePropertyIdentifier = identityRenames.First().baseKeyName().GetText();
        let baseSymbolTable = this.symbolTable.get(entityType, baseIdentifier);
        if (baseSymbolTable == null)
            return true;
        let baseProperty = baseSymbolTable.propertySymbolTable.get(basePropertyIdentifier);
        if (baseProperty == null)
            return false;
        return baseProperty.propertyComponents().propertyAnnotation().identity() != null;
    }
    public getFailureMessage(context: MetaEdGrammar.AssociationSubclassContext): string {
        let identifier = context.associationName().GetText();
        let baseIdentifier = context.baseName().GetText();
        let identityRenames = context.property().Where(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null).Select(y => y.GetProperty().propertyComponents().propertyAnnotation().identityRename());
        let basePropertyIdentifier = identityRenames.First().baseKeyName().GetText();
        return `Association '${identifier}' based on '${baseIdentifier}' tries to rename ${basePropertyIdentifier} which is not part of the identity.`;
    }
}
