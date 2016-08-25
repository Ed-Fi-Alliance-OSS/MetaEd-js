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
        return string.Format("Common String '{0}' has min length greater than max length.", context.commonStringName().GetText());
    }
}
exports.CommonStringMinLengthMustNotBeGreaterThanMaxLength = CommonStringMinLengthMustNotBeGreaterThanMaxLength;
//# sourceMappingURL=CommonStringMinLengthMustNotBeGreaterThanMaxLength.js.map