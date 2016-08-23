var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var CommonSimpleType;
            (function (CommonSimpleType) {
                class CommonDecimalMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase {
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
                CommonSimpleType.CommonDecimalMinValueMustNotBeGreaterThanMaxValue = CommonDecimalMinValueMustNotBeGreaterThanMaxValue;
            })(CommonSimpleType = Validator.CommonSimpleType || (Validator.CommonSimpleType = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=CommonDecimalMinValueMustNotBeGreaterThanMaxValue.js.map