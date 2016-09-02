"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
const SymbolTableEntityType_1 = require("../SymbolTableEntityType");
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;
class AssociationExtensionMustNotDuplicateAssociationPropertyName extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTableEntityType = new SymbolTableEntityType_1.default();
        this.symbolTable = symbolTable;
    }
    handlesContext(context) {
        return context.ruleIndex === MetaEdGrammar.RULE_associationExtension;
    }
    isValid(context) {
        return this.propertyRuleContextsForDuplicates(context).length == 0;
    }
    getFailureMessage(context) {
        let duplicatePropertyIdentifierList = this.propertyRuleContextsForDuplicates(context).map(x => x.propertyName().ID().getText());
        return `Association additions '${context.extendeeName().getText()}' declares '${duplicatePropertyIdentifierList.join(',')}' already in property list of Association.`;
    }
    propertyRuleContextsForDuplicates(context) {
        let entityType = context.ASSOCIATION().getText();
        let extensionType = context.ASSOCIATION().getText() + context.ADDITIONS().getText();
        let identifier = context.extendeeName().getText();
        let associationPropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(entityType, identifier);
        let duplicates = this.symbolTable.contextsForMatchingPropertyIdentifiers(extensionType, identifier, Array.from(associationPropertyIdentifiers));
        return duplicates.filter(x => this.isNotIncludePropertyContextWithExtension(x));
    }
    isNotIncludePropertyContextWithExtension(context) {
        if (context.ruleIndex !== MetaEdGrammar.RULE_includeProperty)
            return true;
        return context.includeExtensionOverride() === null;
    }
}
exports.AssociationExtensionMustNotDuplicateAssociationPropertyName = AssociationExtensionMustNotDuplicateAssociationPropertyName;
//# sourceMappingURL=AssociationExtensionMustNotDuplicateAssociationPropertyName.js.map