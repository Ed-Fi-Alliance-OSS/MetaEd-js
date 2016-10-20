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
        let identityRenames = context.property().filter(x => getProperty(x).propertyComponents().propertyAnnotation().identityRename() != null).map(y => getProperty(y).propertyComponents().propertyAnnotation().identityRename());
        if (!identityRenames.Any())
            return true;
        let entityType = context.DOMAIN_ENTITY().getText();
        let baseIdentifier = context.baseName().getText();
        let basePropertyIdentifier = identityRenames.First().baseKeyName().getText();
        let baseSymbolTable = this.symbolTable.get(entityType, baseIdentifier);
        if (baseSymbolTable == null)
            return true;
        let baseProperty = baseSymbolTable.propertySymbolTable.get(basePropertyIdentifier);
        if (baseProperty == null)
            return false;
        return baseProperty.propertyComponents().propertyAnnotation().identity() != null;
    }
    public getFailureMessage(context: MetaEdGrammar.DomainEntitySubclassContext): string {
        let identifier = context.entityName().getText();
        let baseIdentifier = context.baseName().getText();
        let identityRenames = context.property().filter(x => getProperty(x).propertyComponents().propertyAnnotation().identityRename() != null).map(y => getProperty(y).propertyComponents().propertyAnnotation().identityRename());
        let basePropertyIdentifier = identityRenames.First().baseKeyName().getText();
        return `DomainEntity '${identifier}' based on '${baseIdentifier}' tries to rename ${basePropertyIdentifier} which is not part of the identity.`;
    }
}
