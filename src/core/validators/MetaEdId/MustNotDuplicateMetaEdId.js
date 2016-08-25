"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class MustNotDuplicateMetaEdId extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(...args) {
        super(...args);
        this._trackedMetaEdIds = new HashSet();
    }
    isValid(context) {
        var metaEdId = context.GetValue();
        return this._trackedMetaEdIds.Add(metaEdId);
    }
    getFailureMessage(context) {
        var metaEdId = context.GetValue();
        return string.Format("MetaEdId '{0}' exists on multiple entities.  All MetaEdIds must be globally unique.", metaEdId);
    }
}
exports.MustNotDuplicateMetaEdId = MustNotDuplicateMetaEdId;
//# sourceMappingURL=MustNotDuplicateMetaEdId.js.map