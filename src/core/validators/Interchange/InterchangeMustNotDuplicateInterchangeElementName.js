"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class InterchangeMustNotDuplicateInterchangeElementName extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    static duplicateInterchangeElements(context) {
        let interchangeElements = context.interchangeComponent().interchangeElement().Select(x => x.ID().GetText());
        return interchangeElements.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    isValid(context) {
        return InterchangeMustNotDuplicateInterchangeElementName.duplicateInterchangeElements(context).length == 0;
    }
    getFailureMessage(context) {
        let identifier = context.interchangeName().GetText();
        let duplicateInterchangeElements = InterchangeMustNotDuplicateInterchangeElementName.duplicateInterchangeElements(context);
        return `Interchange '${identifier}' declares duplicate interchange element${duplicateInterchangeElements.length > 1 ? "s" : ""} '${duplicateInterchangeElements.join(', ')}'.`;
    }
}
exports.InterchangeMustNotDuplicateInterchangeElementName = InterchangeMustNotDuplicateInterchangeElementName;
//# sourceMappingURL=InterchangeMustNotDuplicateInterchangeElementName.js.map