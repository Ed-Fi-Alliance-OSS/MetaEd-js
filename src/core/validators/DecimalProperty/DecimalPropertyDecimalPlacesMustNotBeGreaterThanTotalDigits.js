"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        let decimalPlaces = context.decimalPlaces().DecimalPlaces();
        let totalDigits = context.totalDigits().TotalDigits();
        return Number(decimalPlaces) <= Number(totalDigits);
    }
    getFailureMessage(context) {
        return `Decimal Property '${context.propertyName().GetText()}' in ${context.ParentTypeName()} '${context.ParentIdentifier()}' has decimal places greater than total digits.`;
    }
}
exports.DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits = DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits;
//# sourceMappingURL=DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits.js.map