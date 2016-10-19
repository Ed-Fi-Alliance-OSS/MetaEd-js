"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DomainEntityExtensionExistsOnlyInExtensionNamespace extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        let namespaceInfo = context.GetAncestorContext();
        return namespaceInfo.IsExtension;
    }
    getFailureMessage(context) {
        let namespaceInfo = context.GetAncestorContext();
        return `Domain Entity additions '${context.extendeeName().GetText()}' is not valid in core namespace '${namespaceInfo.NamespaceName}`;
    }
}
exports.DomainEntityExtensionExistsOnlyInExtensionNamespace = DomainEntityExtensionExistsOnlyInExtensionNamespace;
//# sourceMappingURL=DomainEntityExtensionExistsOnlyInExtensionNamespace.js.map