"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        let decimalPlaces = context.decimalPlaces().UNSIGNED_INT().getText();
        let totalDigits = context.totalDigits().UNSIGNED_INT().getText();
        return Number(decimalPlaces) <= Number(totalDigits);
    }
    getFailureMessage(context) {
        return `Common Decimal '${context.commonDecimalName().getText()} has decimal places greater than total digits.`;
    }
}
exports.CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits = CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits;
//# sourceMappingURL=CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits.js.map