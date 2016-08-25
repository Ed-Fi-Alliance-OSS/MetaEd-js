"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class CommonShortMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        if (context.minValue() == null || context.maxValue() == null)
            return true;
        var minValue = Convert.ToInt32(context.minValue().MinValue());
        var maxValue = Convert.ToInt32(context.maxValue().MaxValue());
        return minValue <= maxValue;
    }
    getFailureMessage(context) {
        return string.Format("Common Short '{0}' has min value greater than max value.", context.commonShortName().GetText());
    }
}
exports.CommonShortMinValueMustNotBeGreaterThanMaxValue = CommonShortMinValueMustNotBeGreaterThanMaxValue;
//# sourceMappingURL=CommonShortMinValueMustNotBeGreaterThanMaxValue.js.map