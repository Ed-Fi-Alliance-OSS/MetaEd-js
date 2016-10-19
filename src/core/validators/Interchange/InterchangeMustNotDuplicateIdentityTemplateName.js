"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class InterchangeMustNotDuplicateIdentityTemplateName extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    static duplicateIdentityTemplates(context) {
        let identityTemplates = context.interchangeComponent().interchangeIdentityTemplate().Select(x => x.ID().GetText());
        return identityTemplates.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    isValid(context) {
        return InterchangeMustNotDuplicateIdentityTemplateName.duplicateIdentityTemplates(context).length == 0;
    }
    getFailureMessage(context) {
        let identifier = context.interchangeName().GetText();
        let duplicateIdentityTemplates = InterchangeMustNotDuplicateIdentityTemplateName.duplicateIdentityTemplates(context);
        return `Interchange '${identifier}' declares duplicate identity template${duplicateIdentityTemplates.length > 1 ? "s" : ""} '${duplicateIdentityTemplates.join(', ')}'.`;
    }
}
exports.InterchangeMustNotDuplicateIdentityTemplateName = InterchangeMustNotDuplicateIdentityTemplateName;
//# sourceMappingURL=InterchangeMustNotDuplicateIdentityTemplateName.js.map