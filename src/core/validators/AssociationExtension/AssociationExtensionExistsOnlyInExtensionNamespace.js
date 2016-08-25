"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class AssociationExtensionExistsOnlyInExtensionNamespace extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        var namespaceInfo = context.GetAncestorContext();
        return namespaceInfo.IsExtension;
    }
    getFailureMessage(context) {
        var namespaceInfo = context.GetAncestorContext();
        return `Association additions '${context.extendeeName().GetText()}' is not valid in core namespace '${namespaceInfo.NamespaceName}`;
    }
}
exports.AssociationExtensionExistsOnlyInExtensionNamespace = AssociationExtensionExistsOnlyInExtensionNamespace;
//# sourceMappingURL=AssociationExtensionExistsOnlyInExtensionNamespace.js.map