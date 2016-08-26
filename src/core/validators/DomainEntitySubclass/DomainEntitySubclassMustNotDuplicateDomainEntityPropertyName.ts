import { ValidationRuleBase } from "../ValidationRuleBase";
export class DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName extends ValidationRuleBase<MetaEdGrammar.DomainEntitySubclassContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.DomainEntitySubclassContext): boolean {
        let entityType = context.DOMAIN_ENTITY().GetText();
        let extensionType = context.DOMAIN_ENTITY().GetText() + context.BASED_ON();
        let identifier = context.entityName().GetText();
        let baseIdentifier = context.baseName().GetText();
        let basePropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(entityType, baseIdentifier);
        let subclassPropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(extensionType, identifier);
        return !basePropertyIdentifiers.Intersect(subclassPropertyIdentifiers).Any();
    }
    public getFailureMessage(context: MetaEdGrammar.DomainEntitySubclassContext): string {
        let domainEntityType = context.DOMAIN_ENTITY().GetText();
        let extensionType = context.DOMAIN_ENTITY().GetText() + context.BASED_ON();
        let identifier = context.entityName().GetText();
        let baseIdentifier = context.baseName().GetText();
        let associationPropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(domainEntityType, baseIdentifier).ToList();
        let propertyRuleContextsForDuplicates = this._symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, associationPropertyIdentifiers);
        let duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.Select(x => x.IdNode().GetText());
        return `DomainEntity '${identifier}' based on '${baseIdentifier}' declares '${duplicatePropertyIdentifierList.join(", ")}' already in property list of base DomainEntity.`;
    }
}
