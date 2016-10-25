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
        let entityType = context.DOMAIN_ENTITY().getText();
        let extensionType = context.DOMAIN_ENTITY().getText() + context.BASED_ON();
        let identifier = context.entityName().getText();
        let baseIdentifier = context.baseName().getText();
        let basePropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(entityType, baseIdentifier);
        let subclassPropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(extensionType, identifier);
        return !basePropertyIdentifiers.Intersect(subclassPropertyIdentifiers).Any();
    }
    public getFailureMessage(context: MetaEdGrammar.DomainEntitySubclassContext): string {
        let domainEntityType = context.DOMAIN_ENTITY().getText();
        let extensionType = context.DOMAIN_ENTITY().getText() + context.BASED_ON();
        let identifier = context.entityName().getText();
        let baseIdentifier = context.baseName().getText();
        let associationPropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(domainEntityType, baseIdentifier).ToList();
        let propertyRuleContextsForDuplicates = this.symbolTable.contextsForMatchingPropertyIdentifiers(extensionType, identifier, associationPropertyIdentifiers);
        let duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.map(x => x.IdNode().getText());
        return `DomainEntity '${identifier}' based on '${baseIdentifier}' declares '${duplicatePropertyIdentifierList.join(", ")}' already in property list of base DomainEntity.`;
    }
}
