var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var CommonSimpleType;
            (function (CommonSimpleType) {
                class CommonShortMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase {
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
                CommonSimpleType.CommonShortMinValueMustNotBeGreaterThanMaxValue = CommonShortMinValueMustNotBeGreaterThanMaxValue;
            })(CommonSimpleType = Validator.CommonSimpleType || (Validator.CommonSimpleType = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=CommonShortMinValueMustNotBeGreaterThanMaxValue.js.map