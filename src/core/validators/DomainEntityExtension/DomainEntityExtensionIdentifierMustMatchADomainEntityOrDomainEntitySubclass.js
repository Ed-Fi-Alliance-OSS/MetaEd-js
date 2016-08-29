"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
const SymbolTableEntityType_1 = require('../SymbolTableEntityType');
class DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTableEntityType = new SymbolTableEntityType_1.default();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let identifier = context.extendeeName().GetText();
        return this.symbolTable.identifiersForEntityType(this.symbolTableEntityType.domainEntityEntityType()).Any(x => x.Equals(identifier)) || this.symbolTable.identifiersForEntityType(this.symbolTableEntityType.domainEntitySubclassEntityType()).Any(x => x.Equals(identifier));
    }
    getFailureMessage(context) {
        return `Domain Entity additions '${context.extendeeName().GetText()}' does not match any declared Domain Entity or Domain Entity Subclass.`;
    }
}
exports.DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass = DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass;
//# sourceMappingURL=DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass.js.map