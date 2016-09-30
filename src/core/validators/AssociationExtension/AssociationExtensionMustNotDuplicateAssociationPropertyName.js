import {ValidationRuleBase} from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
import SymbolTableEntityType from "../SymbolTableEntityType";
import {MetaEdGrammar} from '../../../../src/grammar/gen/MetaEdGrammar';

export class AssociationExtensionMustNotDuplicateAssociationPropertyName extends ValidationRuleBase
{
    private symbolTable: ISymbolTable;
    private symbolTableEntityType: SymbolTableEntityType = new SymbolTableEntityType();
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }

    public handlesContext(context: any) : boolean {
        return context.ruleIndex === MetaEdGrammar.RULE_associationExtension;
    }

    public isValid(context: any): boolean {
        return this.propertyRuleContextsForDuplicates(context).length == 0;
    }
    public getFailureMessage(context: any): string {
        let duplicatePropertyIdentifierList = this.propertyRuleContextsForDuplicates(context).map(x => x.propertyName().ID().getText());
        return `Association additions '${context.extendeeName().getText()}' declares '${duplicatePropertyIdentifierList.join(',')}' already in property list of Association.`;
    }
    protected propertyRuleContextsForDuplicates(context: any): Array<any> {
        let entityType = context.ASSOCIATION().getText();
        let extensionType = context.ASSOCIATION().getText() + context.ADDITIONS().getText();
        let identifier = context.extendeeName().getText();
        let associationPropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(entityType, identifier);
        let duplicates = this.symbolTable.contextsForMatchingPropertyIdentifiers(extensionType, identifier, Array.from(associationPropertyIdentifiers));
        return duplicates.filter(x => this.isNotIncludePropertyContextWithExtension(x));
    }

    private isNotIncludePropertyContextWithExtension(context: any): boolean {
        if (context.ruleIndex !== MetaEdGrammar.RULE_includeProperty) return true;
        return context.includeExtensionOverride() === null;
    }
}
