"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var identifier = context.extendeeName().GetText();
        return this._symbolTable.IdentifiersForEntityType(SymbolTableEntityType.DomainEntityEntityType()).Any(x => x.Equals(identifier)) || this._symbolTable.IdentifiersForEntityType(SymbolTableEntityType.DomainEntitySubclassEntityType()).Any(x => x.Equals(identifier));
    }
    getFailureMessage(context) {
        return `Domain Entity additions '${context.extendeeName().GetText()}' does not match any declared Domain Entity or Domain Entity Subclass.`;
    }
}
exports.DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass = DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass;
//# sourceMappingURL=DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass.js.map