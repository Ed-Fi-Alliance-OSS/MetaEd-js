"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DecimalPropertyMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        if (context.minValueDecimal() == null || context.maxValueDecimal() == null)
            return true;
        let minValue = context.minValueDecimal().MinValue();
        let maxValue = context.maxValueDecimal().MaxValue();
        return Number(minValue) <= Number(maxValue);
    }
    getFailureMessage(context) {
        return `Decimal Property '${context.propertyName().GetText()}' in ${context.ParentTypeName()} '${context.ParentIdentifier()}' has min value greater than max value.`;
    }
}
exports.DecimalPropertyMinValueMustNotBeGreaterThanMaxValue = DecimalPropertyMinValueMustNotBeGreaterThanMaxValue;
//# sourceMappingURL=DecimalPropertyMinValueMustNotBeGreaterThanMaxValue.js.map