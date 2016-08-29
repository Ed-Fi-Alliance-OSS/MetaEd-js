"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class CommonStringMinLengthMustNotBeGreaterThanMaxLength extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        if (context.minLength() == null)
            return true;
        let minLength = Number(context.minLength().MinLength());
        let maxLength = Number(context.maxLength().MaxLength());
        return minLength <= maxLength;
    }
    getFailureMessage(context) {
        return `Common String '${context.commonStringName().GetText()}' has min length greater than max length.`;
    }
}
exports.CommonStringMinLengthMustNotBeGreaterThanMaxLength = CommonStringMinLengthMustNotBeGreaterThanMaxLength;
//# sourceMappingURL=CommonStringMinLengthMustNotBeGreaterThanMaxLength.js.map