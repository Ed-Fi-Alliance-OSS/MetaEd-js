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
        return string.Format("'merge' is invalid for property {0} on {1} '{2}' in extension namespace {3}.  'merge' is only valid for properties on types in a core namespace.", propertyWithComponents.IdNode().GetText(), topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), namespaceInfo.NamespaceName);
    }
}
exports.MergePartOfReferenceExistsOnlyInCoreNamespace = MergePartOfReferenceExistsOnlyInCoreNamespace;
//# sourceMappingURL=MergePartOfReferenceExistsOnlyInCoreNamespace.js.map