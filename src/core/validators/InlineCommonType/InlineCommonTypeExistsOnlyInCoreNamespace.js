"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class InlineCommonTypeExistsOnlyInCoreNamespace extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        var namespaceInfo = context.GetAncestorContext();
        return !namespaceInfo.IsExtension;
    }
    getFailureMessage(context) {
        var namespaceInfo = context.GetAncestorContext();
        return string.Format("Inline Common Type '{0}' is not valid in extension namespace '{1}'.", context.EntityName(), namespaceInfo.NamespaceName);
    }
}
exports.InlineCommonTypeExistsOnlyInCoreNamespace = InlineCommonTypeExistsOnlyInCoreNamespace;
//# sourceMappingURL=InlineCommonTypeExistsOnlyInCoreNamespace.js.map