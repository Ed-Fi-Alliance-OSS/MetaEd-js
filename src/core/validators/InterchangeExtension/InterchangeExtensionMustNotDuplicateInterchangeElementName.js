"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class InterchangeExtensionMustNotDuplicateInterchangeElementName extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    static duplicateInterchangeElements(context) {
        var interchangeElements = context.interchangeExtensionComponent().interchangeElement().Select(x => x.ID().GetText());
        return interchangeElements.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    isValid(context) {
        return !DuplicateInterchangeElements(context).Any();
    }
    getFailureMessage(context) {
        var identifier = context.extendeeName().GetText();
        var duplicateInterchangeElements = DuplicateInterchangeElements(context);
        return string.Format("Interchange additions '{0}' declares duplicate interchange element{2} '{1}'.", identifier, string.Join("', '", duplicateInterchangeElements), duplicateInterchangeElements.Count() > 1 ? "s" : string.Empty);
    }
}
exports.InterchangeExtensionMustNotDuplicateInterchangeElementName = InterchangeExtensionMustNotDuplicateInterchangeElementName;
//# sourceMappingURL=InterchangeExtensionMustNotDuplicateInterchangeElementName.js.map