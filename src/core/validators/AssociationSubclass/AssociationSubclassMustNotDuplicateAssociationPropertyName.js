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
        let entityType = context.ASSOCIATION().getText();
        let extensionType = context.ASSOCIATION().getText() + context.BASED_ON();
        let identifier = context.associationName().getText();
        let baseIdentifier = context.baseName().getText();
        let basePropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(entityType, baseIdentifier);
        let subclassPropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(extensionType, identifier);
        return !basePropertyIdentifiers.Intersect(subclassPropertyIdentifiers).Any();
    }
    public getFailureMessage(context: MetaEdGrammar.AssociationSubclassContext): string {
        let entityType = context.ASSOCIATION().getText();
        let extensionType = context.ASSOCIATION().getText() + context.BASED_ON();
        let identifier = context.associationName().getText();
        let baseIdentifier = context.baseName().getText();
        let associationPropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(entityType, baseIdentifier).ToList();
        let propertyRuleContextsForDuplicates = this.symbolTable.contextsForMatchingPropertyIdentifiers(extensionType, identifier, associationPropertyIdentifiers);
        let duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.map(x => x.IdNode().getText());
        return `Association '${identifier}' based on '${baseIdentifier}' declares '${duplicatePropertyIdentifierList.join(',')}' already in property list of base Association.`;
    }
}
