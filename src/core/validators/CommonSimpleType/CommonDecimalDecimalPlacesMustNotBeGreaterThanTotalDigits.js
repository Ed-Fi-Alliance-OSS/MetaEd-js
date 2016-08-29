"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
var MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;
class CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits extends ValidationRuleBase_1.ValidationRuleBase {
    handlesContext(context) {
        return context.ruleIndex === MetaEdGrammar.RULE_commonDecimal;
    }
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