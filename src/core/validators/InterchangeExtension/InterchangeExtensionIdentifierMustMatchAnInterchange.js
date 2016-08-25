"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class InterchangeExtensionIdentifierMustMatchAnInterchange extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var entityType = context.INTERCHANGE().GetText();
        var identifier = context.extendeeName().GetText();
        return this._symbolTable.IdentifiersForEntityType(entityType).Any(x => x.Equals(identifier));
    }
    getFailureMessage(context) {
        return `Interchange additions '${context.extendeeName().GetText()}' does not match any declared Interchange.`;
    }
}
exports.InterchangeExtensionIdentifierMustMatchAnInterchange = InterchangeExtensionIdentifierMustMatchAnInterchange;
//# sourceMappingURL=InterchangeExtensionIdentifierMustMatchAnInterchange.js.map