"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class StringPropertyMinLengthMustNotBeGreaterThanMaxLength extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        if (context.minLength() == null)
            return true;
        let minLength = Number(context.minLength().MinLength());
        let maxLength = Number(context.maxLength().MaxLength());
        return minLength <= maxLength;
    }
    getFailureMessage(context) {
        return `String Property '${context.propertyName().GetText()}' in ${context.ParentTypeName()} '${context.ParentIdentifier()}' has min length greater than max length.`;
    }
}
exports.StringPropertyMinLengthMustNotBeGreaterThanMaxLength = StringPropertyMinLengthMustNotBeGreaterThanMaxLength;
//# sourceMappingURL=StringPropertyMinLengthMustNotBeGreaterThanMaxLength.js.map