var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var DecimalProperty;
            (function (DecimalProperty) {
                class DecimalPropertyMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase {
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
                DecimalProperty.DecimalPropertyMinValueMustNotBeGreaterThanMaxValue = DecimalPropertyMinValueMustNotBeGreaterThanMaxValue;
            })(DecimalProperty = Validator.DecimalProperty || (Validator.DecimalProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DecimalPropertyMinValueMustNotBeGreaterThanMaxValue.js.map