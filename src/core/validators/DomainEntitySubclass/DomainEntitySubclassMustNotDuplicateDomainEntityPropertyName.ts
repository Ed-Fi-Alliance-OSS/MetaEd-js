import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName extends ValidationRuleBase<MetaEdGrammar.DomainEntitySubclassContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.DomainEntitySubclassContext): boolean {
        let entityType = context.DOMAIN_ENTITY().GetText();
        let extensionType = context.DOMAIN_ENTITY().GetText() + context.BASED_ON();
        let identifier = context.entityName().GetText();
        let baseIdentifier = context.baseName().GetText();
        let basePropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(entityType, baseIdentifier);
        let subclassPropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(extensionType, identifier);
        return !basePropertyIdentifiers.Intersect(subclassPropertyIdentifiers).Any();
    }
    public getFailureMessage(context: MetaEdGrammar.DomainEntitySubclassContext): string {
        let domainEntityType = context.DOMAIN_ENTITY().GetText();
        let extensionType = context.DOMAIN_ENTITY().GetText() + context.BASED_ON();
        let identifier = context.entityName().GetText();
        let baseIdentifier = context.baseName().GetText();
        let associationPropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(domainEntityType, baseIdentifier).ToList();
        let propertyRuleContextsForDuplicates = this.symbolTable.contextsForMatchingPropertyIdentifiers(extensionType, identifier, associationPropertyIdentifiers);
        let duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.Select(x => x.IdNode().GetText());
        return `DomainEntity '${identifier}' based on '${baseIdentifier}' declares '${duplicatePropertyIdentifierList.join(", ")}' already in property list of base DomainEntity.`;
    }
}
