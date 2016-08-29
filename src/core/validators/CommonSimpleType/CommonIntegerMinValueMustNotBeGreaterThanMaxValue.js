"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class CommonIntegerMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        if (context.minValue() == null || context.maxValue() == null)
            return true;
        let minValue = Number(context.minValue().MinValue());
        let maxValue = Number(context.maxValue().MaxValue());
        return minValue <= maxValue;
    }
    getFailureMessage(context) {
        return `Common Integer '${context.commonIntegerName().GetText()}' has min value greater than max value.`;
    }
}
exports.CommonIntegerMinValueMustNotBeGreaterThanMaxValue = CommonIntegerMinValueMustNotBeGreaterThanMaxValue;
//# sourceMappingURL=CommonIntegerMinValueMustNotBeGreaterThanMaxValue.js.map