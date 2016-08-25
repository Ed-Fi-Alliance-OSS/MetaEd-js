"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        var decimalPlaces = context.decimalPlaces().DecimalPlaces();
        var totalDigits = context.totalDigits().TotalDigits();
        return Convert.ToInt32(decimalPlaces) <= Convert.ToInt32(totalDigits);
    }
    getFailureMessage(context) {
        return string.Format("Decimal Property '{0}' in {1} '{2}' has decimal places greater than total digits.", context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
    }
}
exports.DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits = DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits;
//# sourceMappingURL=DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits.js.map