"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class InterchangeExtensionMustNotDuplicateInterchangeElementName extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    static duplicateInterchangeElements(context) {
        let interchangeElements = context.interchangeExtensionComponent().interchangeElement().Select(x => x.ID().GetText());
        return interchangeElements.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    isValid(context) {
        return InterchangeExtensionMustNotDuplicateInterchangeElementName.duplicateInterchangeElements(context).length == 0;
    }
    getFailureMessage(context) {
        let identifier = context.extendeeName().GetText();
        let duplicateInterchangeElements = InterchangeExtensionMustNotDuplicateInterchangeElementName.duplicateInterchangeElements(context);
        return `Interchange additions '${identifier}' declares duplicate interchange element{duplicateInterchangeElements.length > 1 ? "s" : ""} '${duplicateInterchangeElements.join(', ')}'`;
    }
}
exports.InterchangeExtensionMustNotDuplicateInterchangeElementName = InterchangeExtensionMustNotDuplicateInterchangeElementName;
//# sourceMappingURL=InterchangeExtensionMustNotDuplicateInterchangeElementName.js.map