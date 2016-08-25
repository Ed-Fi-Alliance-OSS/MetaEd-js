"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DecimalPropertyMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        if (context.minValueDecimal() == null || context.maxValueDecimal() == null)
            return true;
        var minValue = context.minValueDecimal().MinValue();
        var maxValue = context.maxValueDecimal().MaxValue();
        return Convert.ToDecimal(minValue) <= Convert.ToDecimal(maxValue);
    }
    getFailureMessage(context) {
        return string.Format("Decimal Property '{0}' in {1} '{2}' has min value greater than max value.", context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
    }
}
exports.DecimalPropertyMinValueMustNotBeGreaterThanMaxValue = DecimalPropertyMinValueMustNotBeGreaterThanMaxValue;
//# sourceMappingURL=DecimalPropertyMinValueMustNotBeGreaterThanMaxValue.js.map