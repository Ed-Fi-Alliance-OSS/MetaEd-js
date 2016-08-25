"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class AssociationExtensionExistsOnlyInExtensionNamespace extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        var namespaceInfo = context.GetAncestorContext();
        return namespaceInfo.IsExtension;
    }
    getFailureMessage(context) {
        var namespaceInfo = context.GetAncestorContext();
        return string.Format("Association additions '{0}' is not valid in core namespace '{1}'.", context.extendeeName().GetText(), namespaceInfo.NamespaceName);
    }
}
exports.AssociationExtensionExistsOnlyInExtensionNamespace = AssociationExtensionExistsOnlyInExtensionNamespace;
//# sourceMappingURL=AssociationExtensionExistsOnlyInExtensionNamespace.js.map