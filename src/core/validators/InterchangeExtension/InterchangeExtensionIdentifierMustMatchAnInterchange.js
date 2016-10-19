"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class InterchangeExtensionIdentifierMustMatchAnInterchange extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let entityType = context.INTERCHANGE().GetText();
        let identifier = context.extendeeName().GetText();
        return this.symbolTable.identifiersForEntityType(entityType).Any(x => x.Equals(identifier));
    }
    getFailureMessage(context) {
        return `Interchange additions '${context.extendeeName().GetText()}' does not match any declared Interchange.`;
    }
}
exports.InterchangeExtensionIdentifierMustMatchAnInterchange = InterchangeExtensionIdentifierMustMatchAnInterchange;
//# sourceMappingURL=InterchangeExtensionIdentifierMustMatchAnInterchange.js.map