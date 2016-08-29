"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
const SymbolTableEntityType_1 = require('../SymbolTableEntityType');
class EnumerationPropertyMustMatchAnEnumeration extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTableEntityType = new SymbolTableEntityType_1.default();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let identifierToMatch = context.propertyName().GetText();
        return this.symbolTable.identifierExists(this.symbolTableEntityType.enumerationEntityType(), identifierToMatch);
    }
    getFailureMessage(context) {
        return `Enumeration property '${context.propertyName().GetText()}' does not match any declared enumeration.`;
    }
}
exports.EnumerationPropertyMustMatchAnEnumeration = EnumerationPropertyMustMatchAnEnumeration;
//# sourceMappingURL=EnumerationPropertyMustMatchAnEnumeration.js.map