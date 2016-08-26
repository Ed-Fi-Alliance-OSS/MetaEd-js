import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class AssociationSubclassMustNotDuplicateAssociationPropertyName extends ValidationRuleBase<MetaEdGrammar.AssociationSubclassContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.AssociationSubclassContext): boolean {
        let entityType = context.ASSOCIATION().GetText();
        let extensionType = context.ASSOCIATION().GetText() + context.BASED_ON();
        let identifier = context.associationName().GetText();
        let baseIdentifier = context.baseName().GetText();
        let basePropertyIdentifiers = this.symbolTable.IdentifiersForEntityProperties(entityType, baseIdentifier);
        let subclassPropertyIdentifiers = this.symbolTable.IdentifiersForEntityProperties(extensionType, identifier);
        return !basePropertyIdentifiers.Intersect(subclassPropertyIdentifiers).Any();
    }
    public getFailureMessage(context: MetaEdGrammar.AssociationSubclassContext): string {
        let entityType = context.ASSOCIATION().GetText();
        let extensionType = context.ASSOCIATION().GetText() + context.BASED_ON();
        let identifier = context.associationName().GetText();
        let baseIdentifier = context.baseName().GetText();
        let associationPropertyIdentifiers = this.symbolTable.IdentifiersForEntityProperties(entityType, baseIdentifier).ToList();
        let propertyRuleContextsForDuplicates = this.symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, associationPropertyIdentifiers);
        let duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.Select(x => x.IdNode().GetText());
        return `Association '${identifier}' based on '${baseIdentifier}' declares '${duplicatePropertyIdentifierList.join(','))}' already in property list of base Association.`;
    }
}
