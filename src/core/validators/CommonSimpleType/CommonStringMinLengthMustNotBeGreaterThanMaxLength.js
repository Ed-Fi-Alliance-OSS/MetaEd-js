"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class CommonStringMinLengthMustNotBeGreaterThanMaxLength extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        if (context.minLength() == null)
            return true;
        var minLength = Convert.ToInt32(context.minLength().MinLength());
        var maxLength = Convert.ToInt32(context.maxLength().MaxLength());
        return minLength <= maxLength;
    }
    getFailureMessage(context) {
        return `Common String '${context.commonStringName().GetText()}' has min length greater than max length.`;
    }
}
exports.CommonStringMinLengthMustNotBeGreaterThanMaxLength = CommonStringMinLengthMustNotBeGreaterThanMaxLength;
//# sourceMappingURL=CommonStringMinLengthMustNotBeGreaterThanMaxLength.js.map