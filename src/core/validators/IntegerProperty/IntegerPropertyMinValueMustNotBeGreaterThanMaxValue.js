"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class IntegerPropertyMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        if (context.minValue() == null || context.maxValue() == null)
            return true;
        let minValue = Number(context.minValue().MinValue());
        let maxValue = Number(context.maxValue().MaxValue());
        return minValue <= maxValue;
    }
    getFailureMessage(context) {
        return `Integer Property '${context.propertyName().GetText()}' in ${context.ParentTypeName()} '${context.ParentIdentifier()}' has min value greater than max value.`;
    }
}
exports.IntegerPropertyMinValueMustNotBeGreaterThanMaxValue = IntegerPropertyMinValueMustNotBeGreaterThanMaxValue;
//# sourceMappingURL=IntegerPropertyMinValueMustNotBeGreaterThanMaxValue.js.map