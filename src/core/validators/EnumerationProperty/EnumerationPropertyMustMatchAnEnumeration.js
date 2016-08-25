"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class EnumerationPropertyMustMatchAnEnumeration extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var identifierToMatch = context.propertyName().GetText();
        return this._symbolTable.IdentifierExists(SymbolTableEntityType.EnumerationEntityType(), identifierToMatch);
    }
    getFailureMessage(context) {
        return string.Format("Enumeration property '{0}' does not match any declared enumeration.", context.propertyName().GetText());
    }
}
exports.EnumerationPropertyMustMatchAnEnumeration = EnumerationPropertyMustMatchAnEnumeration;
//# sourceMappingURL=EnumerationPropertyMustMatchAnEnumeration.js.map