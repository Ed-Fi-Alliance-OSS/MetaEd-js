var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var StringProperty;
            (function (StringProperty) {
                class StringPropertyMinLengthMustNotBeGreaterThanMaxLength extends ValidationRuleBase {
                    isValid(context) {
                        if (context.minLength() == null)
                            return true;
                        var minLength = Convert.ToInt32(context.minLength().MinLength());
                        var maxLength = Convert.ToInt32(context.maxLength().MaxLength());
                        return minLength <= maxLength;
                    }
                    getFailureMessage(context) {
                        return string.Format("String Property '{0}' in {1} '{2}' has min length greater than max length.", context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
                    }
                }
                StringProperty.StringPropertyMinLengthMustNotBeGreaterThanMaxLength = StringPropertyMinLengthMustNotBeGreaterThanMaxLength;
            })(StringProperty = Validator.StringProperty || (Validator.StringProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=StringPropertyMinLengthMustNotBeGreaterThanMaxLength.js.map