"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class InlineCommonTypeExistsOnlyInCoreNamespace extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        var namespaceInfo = context.GetAncestorContext();
        return !namespaceInfo.IsExtension;
    }
    getFailureMessage(context) {
        var namespaceInfo = context.GetAncestorContext();
        return `Inline Common Type '${context.EntityName()}' is not valid in extension namespace '${namespaceInfo.NamespaceName}'.", );
    }
}
;
    }
}
exports.InlineCommonTypeExistsOnlyInCoreNamespace = InlineCommonTypeExistsOnlyInCoreNamespace;
//# sourceMappingURL=InlineCommonTypeExistsOnlyInCoreNamespace.js.map