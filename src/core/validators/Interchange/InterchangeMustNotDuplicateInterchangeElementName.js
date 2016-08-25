"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class InterchangeMustNotDuplicateInterchangeElementName extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    static duplicateInterchangeElements(context) {
        var interchangeElements = context.interchangeComponent().interchangeElement().Select(x => x.ID().GetText());
        return interchangeElements.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    isValid(context) {
        return !DuplicateInterchangeElements(context).Any();
    }
    getFailureMessage(context) {
        var identifier = context.interchangeName().GetText();
        var duplicateInterchangeElements = DuplicateInterchangeElements(context);
        return string.Format("Interchange '{0}' declares duplicate interchange element{2} '{1}'.", identifier, string.Join("', '", duplicateInterchangeElements), duplicateInterchangeElements.Count() > 1 ? "s" : string.Empty);
    }
}
exports.InterchangeMustNotDuplicateInterchangeElementName = InterchangeMustNotDuplicateInterchangeElementName;
//# sourceMappingURL=InterchangeMustNotDuplicateInterchangeElementName.js.map