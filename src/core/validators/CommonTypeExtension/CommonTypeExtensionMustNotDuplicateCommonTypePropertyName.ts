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
        let entityType = context.COMMON_TYPE().GetText();
        let extensionType = context.COMMON_TYPE().GetText() + context.ADDITIONS();
        let identifier = context.extendeeName().GetText();
        let commonTypePropertyIdentifiers = this.symbolTable.IdentifiersForEntityProperties(entityType, identifier);
        let extensionPropertyIdentifiers = this.symbolTable.IdentifiersForEntityProperties(extensionType, identifier);
        return !commonTypePropertyIdentifiers.Intersect(extensionPropertyIdentifiers).Any();
    }
    public getFailureMessage(context: MetaEdGrammar.CommonTypeExtensionContext): string {
        let entityType = context.COMMON_TYPE().GetText();
        let extensionType = context.COMMON_TYPE().GetText() + context.ADDITIONS();
        let identifier = context.extendeeName().GetText();
        let commonTypePropertyIdentifiers = this.symbolTable.IdentifiersForEntityProperties(entityType, identifier).ToList();
        let propertyRuleContextsForDuplicates = this.symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, commonTypePropertyIdentifiers);
        let duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.Select(x => x.IdNode().GetText());
        let joinedString = duplicatePropertyIdentifierList;
        return `Common Type additions '${identifier}' declares '${joinedString}' already in property list of Common Type.`;
    }
}
