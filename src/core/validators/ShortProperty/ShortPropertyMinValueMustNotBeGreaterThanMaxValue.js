"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class ShortPropertyMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        if (context.minValue() == null || context.maxValue() == null)
            return true;
        var minValue = Convert.ToInt32(context.minValue().MinValue());
        var maxValue = Convert.ToInt32(context.maxValue().MaxValue());
        return minValue <= maxValue;
    }
    getFailureMessage(context) {
        return string.Format("Short Property '{0}' in {1} '{2}' has min value greater than max value.", context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
    }
}
exports.ShortPropertyMinValueMustNotBeGreaterThanMaxValue = ShortPropertyMinValueMustNotBeGreaterThanMaxValue;
//# sourceMappingURL=ShortPropertyMinValueMustNotBeGreaterThanMaxValue.js.map