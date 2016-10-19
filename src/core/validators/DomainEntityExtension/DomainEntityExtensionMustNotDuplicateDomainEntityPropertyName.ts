import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName extends ValidationRuleBase<MetaEdGrammar.DomainEntityExtensionContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.DomainEntityExtensionContext): boolean {
        return this.propertyRuleContextsForDuplicates(context).length == 0;
    }
    public getFailureMessage(context: MetaEdGrammar.DomainEntityExtensionContext): string {
        let duplicatePropertyIdentifierList = this.propertyRuleContextsForDuplicates(context).Select(x => x.IdNode().GetText());
        return `Domain Entity additions '${context.extendeeName().GetText()}' declares '${duplicatePropertyIdentifierList.join(', ')}' already in property list of Domain Entity.`;
    }
    protected propertyRuleContextsForDuplicates(context: MetaEdGrammar.DomainEntityExtensionContext): IEnumerable<IPropertyWithComponents> {
        let entityType = context.DOMAIN_ENTITY().GetText();
        let extensionType = context.DOMAIN_ENTITY().GetText() + context.ADDITIONS();
        let identifier = context.extendeeName().GetText();
        let domainEntityPropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(entityType, identifier).ToList();
        let duplicates = this.symbolTable.contextsForMatchingPropertyIdentifiers(extensionType, identifier, domainEntityPropertyIdentifiers);
        return duplicates.Where(isNotIncludePropertyContextWithExtension);
    }
    private static isNotIncludePropertyContextWithExtension(context: IPropertyWithComponents): boolean {
        if (!(context instanceof MetaEdGrammar.IncludePropertyContext))
            return true;
        return (<MetaEdGrammar.IncludePropertyContext>context).includeExtensionOverride() == null;
    }
}
