var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var ShortProperty;
            (function (ShortProperty) {
                class ShortPropertyMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase {
                    isValid(context) {
                        if (context.minValue() == null || context.maxValue() == null)
                            return true;
                        var minValue = Convert.ToInt32(context.minValue().MinValue());
                        var maxValue = Convert.ToInt32(context.maxValue().MaxValue());
                        return minValue <= maxValue;
                    }
                    getFailureMessage(context) {
                        return string.Format("Short Property '{0}' in {1} '{2}' has min value greater than max value.", context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
                    }
                }
                ShortProperty.ShortPropertyMinValueMustNotBeGreaterThanMaxValue = ShortPropertyMinValueMustNotBeGreaterThanMaxValue;
            })(ShortProperty = Validator.ShortProperty || (Validator.ShortProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=ShortPropertyMinValueMustNotBeGreaterThanMaxValue.js.map