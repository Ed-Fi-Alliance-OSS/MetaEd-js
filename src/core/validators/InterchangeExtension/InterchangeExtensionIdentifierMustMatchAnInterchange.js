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
        return string.Format("Interchange additions '{0}' does not match any declared Interchange.", context.extendeeName().GetText());
    }
}
exports.InterchangeExtensionIdentifierMustMatchAnInterchange = InterchangeExtensionIdentifierMustMatchAnInterchange;
//# sourceMappingURL=InterchangeExtensionIdentifierMustMatchAnInterchange.js.map