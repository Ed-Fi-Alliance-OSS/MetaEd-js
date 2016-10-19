"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class InterchangeExtensionMustNotDuplicateIdentityTemplateName extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    static duplicateIdentityTemplates(context) {
        let identityTemplates = context.interchangeExtensionComponent().interchangeIdentityTemplate().Select(x => x.ID().GetText());
        return identityTemplates.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    isValid(context) {
        return InterchangeExtensionMustNotDuplicateIdentityTemplateName.duplicateIdentityTemplates(context).length == 0;
    }
    getFailureMessage(context) {
        let identifier = context.extendeeName().GetText();
        let duplicateIdentityTemplates = InterchangeExtensionMustNotDuplicateIdentityTemplateName.duplicateIdentityTemplates(context);
        return `Interchange additions '${identifier}' declares duplicate identity template${duplicateIdentityTemplates.length > 1 ? "s" : ""} '${duplicateIdentityTemplates.join(', ')}'`;
    }
}
exports.InterchangeExtensionMustNotDuplicateIdentityTemplateName = InterchangeExtensionMustNotDuplicateIdentityTemplateName;
//# sourceMappingURL=InterchangeExtensionMustNotDuplicateIdentityTemplateName.js.map