"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class StringPropertyMinLengthMustNotBeGreaterThanMaxLength extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        if (context.minLength() == null)
            return true;
        var minLength = Convert.ToInt32(context.minLength().MinLength());
        var maxLength = Convert.ToInt32(context.maxLength().MaxLength());
        return minLength <= maxLength;
    }
    getFailureMessage(context) {
        return string.Format("String Property '{0}' in {1} '{2}' has min length greater than max length.", context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
    }
}
exports.StringPropertyMinLengthMustNotBeGreaterThanMaxLength = StringPropertyMinLengthMustNotBeGreaterThanMaxLength;
//# sourceMappingURL=StringPropertyMinLengthMustNotBeGreaterThanMaxLength.js.map