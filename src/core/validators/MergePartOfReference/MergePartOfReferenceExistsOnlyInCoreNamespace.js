"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class MergePartOfReferenceExistsOnlyInCoreNamespace extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        var namespaceInfo = context.GetAncestorContext();
        return !namespaceInfo.IsExtension;
    }
    getFailureMessage(context) {
        var namespaceInfo = context.GetAncestorContext();
        var topLevelEntity = context.GetAncestorContext();
        var propertyWithComponents = context.GetAncestorContext();
        return `'merge' is invalid for property ${propertyWithComponents.IdNode().GetText()} on ${topLevelEntity.EntityIdentifier()} '${topLevelEntity.EntityName()}' in extension namespace ${namespaceInfo.NamespaceName}.  'merge' is only valid for properties on types in a core namespace.`;
    }
}
exports.MergePartOfReferenceExistsOnlyInCoreNamespace = MergePartOfReferenceExistsOnlyInCoreNamespace;
//# sourceMappingURL=MergePartOfReferenceExistsOnlyInCoreNamespace.js.map