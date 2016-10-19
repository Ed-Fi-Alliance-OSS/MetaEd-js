"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class CommonTypeExtensionIdentifierMustMatchACommonType extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let entityType = context.COMMON_TYPE().GetText();
        let identifier = context.extendeeName().GetText();
        return this.symbolTable.identifiersForEntityType(entityType).Any(x => x.Equals(identifier));
    }
    getFailureMessage(context) {
        return `Common Type additions '${context.extendeeName().GetText()}' does not match any declared Common Type.`;
    }
}
exports.CommonTypeExtensionIdentifierMustMatchACommonType = CommonTypeExtensionIdentifierMustMatchACommonType;
//# sourceMappingURL=CommonTypeExtensionIdentifierMustMatchACommonType.js.map