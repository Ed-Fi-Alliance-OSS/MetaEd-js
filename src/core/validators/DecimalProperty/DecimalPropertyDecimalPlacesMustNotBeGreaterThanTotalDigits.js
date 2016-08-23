var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var DecimalProperty;
            (function (DecimalProperty) {
                class DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits extends ValidationRuleBase {
                    isValid(context) {
                        var decimalPlaces = context.decimalPlaces().DecimalPlaces();
                        var totalDigits = context.totalDigits().TotalDigits();
                        return Convert.ToInt32(decimalPlaces) <= Convert.ToInt32(totalDigits);
                    }
                    getFailureMessage(context) {
                        return string.Format("Decimal Property '{0}' in {1} '{2}' has decimal places greater than total digits.", context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
                    }
                }
                DecimalProperty.DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits = DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits;
            })(DecimalProperty = Validator.DecimalProperty || (Validator.DecimalProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits.js.map