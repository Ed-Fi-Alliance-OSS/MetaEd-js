"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DomainEntityExtensionExistsOnlyInExtensionNamespace extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        var namespaceInfo = context.GetAncestorContext();
        return namespaceInfo.IsExtension;
    }
    getFailureMessage(context) {
        var namespaceInfo = context.GetAncestorContext();
        return string.Format("Domain Entity additions '{0}' is not valid in core namespace '{1}'.", context.extendeeName().GetText(), namespaceInfo.NamespaceName);
    }
}
exports.DomainEntityExtensionExistsOnlyInExtensionNamespace = DomainEntityExtensionExistsOnlyInExtensionNamespace;
//# sourceMappingURL=DomainEntityExtensionExistsOnlyInExtensionNamespace.js.map