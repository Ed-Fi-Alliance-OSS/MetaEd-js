"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class CommonTypeExtensionIdentifierMustMatchACommonType extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var entityType = context.COMMON_TYPE().GetText();
        var identifier = context.extendeeName().GetText();
        return this._symbolTable.IdentifiersForEntityType(entityType).Any(x => x.Equals(identifier));
    }
    getFailureMessage(context) {
        return `Common Type additions '${context.extendeeName().GetText()}' does not match any declared Common Type.`;
    }
}
exports.CommonTypeExtensionIdentifierMustMatchACommonType = CommonTypeExtensionIdentifierMustMatchACommonType;
//# sourceMappingURL=CommonTypeExtensionIdentifierMustMatchACommonType.js.map