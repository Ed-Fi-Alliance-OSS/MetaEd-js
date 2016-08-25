"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class ShortPropertyMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        if (context.minValue() == null || context.maxValue() == null)
            return true;
        var minValue = Number(context.minValue().MinValue());
        var maxValue = Number(context.maxValue().MaxValue());
        return minValue <= maxValue;
    }
    getFailureMessage(context) {
        return `Short Property '${context.propertyName().GetText()}' in ${context.ParentTypeName()} '${context.ParentIdentifier()}' has min value greater than max value.`;
    }
}
exports.ShortPropertyMinValueMustNotBeGreaterThanMaxValue = ShortPropertyMinValueMustNotBeGreaterThanMaxValue;
//# sourceMappingURL=ShortPropertyMinValueMustNotBeGreaterThanMaxValue.js.map