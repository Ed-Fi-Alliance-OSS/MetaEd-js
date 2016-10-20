import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class CommonTypeExtensionMustNotDuplicateCommonTypePropertyName extends ValidationRuleBase<MetaEdGrammar.CommonTypeExtensionContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.CommonTypeExtensionContext): boolean {
        let entityType = context.COMMON_TYPE().getText();
        let extensionType = context.COMMON_TYPE().getText() + context.ADDITIONS();
        let identifier = context.extendeeName().getText();
        let commonTypePropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(entityType, identifier);
        let extensionPropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(extensionType, identifier);
        return !commonTypePropertyIdentifiers.Intersect(extensionPropertyIdentifiers).Any();
    }
    public getFailureMessage(context: MetaEdGrammar.CommonTypeExtensionContext): string {
        let entityType = context.COMMON_TYPE().getText();
        let extensionType = context.COMMON_TYPE().getText() + context.ADDITIONS();
        let identifier = context.extendeeName().getText();
        let commonTypePropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(entityType, identifier).ToList();
        let propertyRuleContextsForDuplicates = this.symbolTable.contextsForMatchingPropertyIdentifiers(extensionType, identifier, commonTypePropertyIdentifiers);
        let duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.map(x => x.IdNode().getText());
        let joinedString = duplicatePropertyIdentifierList;
        return `Common Type additions '${identifier}' declares '${joinedString}' already in property list of Common Type.`;
    }
}
