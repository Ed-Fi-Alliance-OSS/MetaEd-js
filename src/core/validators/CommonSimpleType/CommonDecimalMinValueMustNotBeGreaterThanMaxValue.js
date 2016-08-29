"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class CommonDecimalMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        if (context.minValueDecimal() == null || context.maxValueDecimal() == null)
            return true;
        let minValue = context.minValueDecimal().MinValue();
        let maxValue = context.maxValueDecimal().MaxValue();
        return Number(minValue) <= Number(maxValue);
    }
    getFailureMessage(context) {
        return `Common Decimal '${context.commonDecimalName().GetText()}' has min value greater than max value.`;
    }
}
exports.CommonDecimalMinValueMustNotBeGreaterThanMaxValue = CommonDecimalMinValueMustNotBeGreaterThanMaxValue;
//# sourceMappingURL=CommonDecimalMinValueMustNotBeGreaterThanMaxValue.js.map