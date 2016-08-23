var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var CommonSimpleType;
            (function (CommonSimpleType) {
                class CommonStringMinLengthMustNotBeGreaterThanMaxLength extends ValidationRuleBase {
                    isValid(context) {
                        if (context.minLength() == null)
                            return true;
                        var minLength = Convert.ToInt32(context.minLength().MinLength());
                        var maxLength = Convert.ToInt32(context.maxLength().MaxLength());
                        return minLength <= maxLength;
                    }
                    getFailureMessage(context) {
                        return string.Format("Common String '{0}' has min length greater than max length.", context.commonStringName().GetText());
                    }
                }
                CommonSimpleType.CommonStringMinLengthMustNotBeGreaterThanMaxLength = CommonStringMinLengthMustNotBeGreaterThanMaxLength;
            })(CommonSimpleType = Validator.CommonSimpleType || (Validator.CommonSimpleType = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=CommonStringMinLengthMustNotBeGreaterThanMaxLength.js.map