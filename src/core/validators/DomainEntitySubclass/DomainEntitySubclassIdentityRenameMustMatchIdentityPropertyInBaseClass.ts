import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass extends ValidationRuleBase<MetaEdGrammar.DomainEntitySubclassContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.DomainEntitySubclassContext): boolean {
        let identityRenames = context.property().Where(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null).Select(y => y.GetProperty().propertyComponents().propertyAnnotation().identityRename());
        if (!identityRenames.Any())
            return true;
        let entityType = context.DOMAIN_ENTITY().GetText();
        let baseIdentifier = context.baseName().GetText();
        let basePropertyIdentifier = identityRenames.First().baseKeyName().GetText();
        let baseSymbolTable = this.symbolTable.Get(entityType, baseIdentifier);
        if (baseSymbolTable == null)
            return true;
        let baseProperty = baseSymbolTable.PropertySymbolTable.Get(basePropertyIdentifier);
        if (baseProperty == null)
            return false;
        return baseProperty.propertyComponents().propertyAnnotation().identity() != null;
    }
    public getFailureMessage(context: MetaEdGrammar.DomainEntitySubclassContext): string {
        let identifier = context.entityName().GetText();
        let baseIdentifier = context.baseName().GetText();
        let identityRenames = context.property().Where(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null).Select(y => y.GetProperty().propertyComponents().propertyAnnotation().identityRename());
        let basePropertyIdentifier = identityRenames.First().baseKeyName().GetText();
        return `DomainEntity '${identifier}' based on '${baseIdentifier}' tries to rename ${basePropertyIdentifier} which is not part of the identity.`;
    }
}
