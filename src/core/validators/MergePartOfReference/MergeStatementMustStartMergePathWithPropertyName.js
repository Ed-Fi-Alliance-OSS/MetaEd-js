"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class MergeStatementMustStartMergePathWithPropertyName extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        let parent = __as__(context.Parent, MetaEdGrammar.ReferencePropertyContext);
        if (parent == null)
            return false;
        let referenceName = parent.propertyName().IdText();
        return context.mergePropertyPath().propertyPath().PropertyPathParts()[0] == referenceName;
    }
    getFailureMessage(context) {
        return "Merge statement must start first property path with the referenced entity name of the current property.";
    }
}
exports.MergeStatementMustStartMergePathWithPropertyName = MergeStatementMustStartMergePathWithPropertyName;
//# sourceMappingURL=MergeStatementMustStartMergePathWithPropertyName.js.map