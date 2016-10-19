"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class MustNotDuplicateMetaEdId extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(...args) {
        super(...args);
        this._trackedMetaEdIds = new HashSet();
    }
    isValid(context) {
        let metaEdId = context.GetValue();
        return this._trackedMetaEdIds.Add(metaEdId);
    }
    getFailureMessage(context) {
        let metaEdId = context.GetValue();
        return `MetaEdId '${metaEdId}' exists on multiple entities.  All MetaEdIds must be globally unique.';
    }
}
;
    }
}
exports.MustNotDuplicateMetaEdId = MustNotDuplicateMetaEdId;
//# sourceMappingURL=MustNotDuplicateMetaEdId.js.map