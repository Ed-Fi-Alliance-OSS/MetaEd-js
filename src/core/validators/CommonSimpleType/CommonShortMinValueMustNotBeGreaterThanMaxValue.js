"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class CommonShortMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        if (context.minValue() == null || context.maxValue() == null)
            return true;
        var minValue = Number(context.minValue().MinValue());
        var maxValue = Number(context.maxValue().MaxValue());
        return minValue <= maxValue;
    }
    getFailureMessage(context) {
        return `Common Short '${context.commonShortName().GetText()}' has min value greater than max value.`;
    }
}
exports.CommonShortMinValueMustNotBeGreaterThanMaxValue = CommonShortMinValueMustNotBeGreaterThanMaxValue;
//# sourceMappingURL=CommonShortMinValueMustNotBeGreaterThanMaxValue.js.map