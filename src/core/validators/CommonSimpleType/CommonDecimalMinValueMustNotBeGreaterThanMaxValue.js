"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class CommonDecimalMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        if (context.minValueDecimal() == null || context.maxValueDecimal() == null)
            return true;
        var minValue = context.minValueDecimal().MinValue();
        var maxValue = context.maxValueDecimal().MaxValue();
        return Convert.ToDecimal(minValue) <= Convert.ToDecimal(maxValue);
    }
    getFailureMessage(context) {
        return string.Format("Common Decimal '{0}' has min value greater than max value.", context.commonDecimalName().GetText());
    }
}
exports.CommonDecimalMinValueMustNotBeGreaterThanMaxValue = CommonDecimalMinValueMustNotBeGreaterThanMaxValue;
//# sourceMappingURL=CommonDecimalMinValueMustNotBeGreaterThanMaxValue.js.map