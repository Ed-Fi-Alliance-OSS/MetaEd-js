using;
System;
using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var CommonSimpleType;
            (function (CommonSimpleType) {
                class CommonStringMinLengthMustNotBeGreaterThanMaxLength {
                }
                ValidationRuleBase < MetaEdGrammar.CommonStringContext >
                    {
                        override: bool, IsValid(MetaEdGrammar, CommonStringContext = context) {
                            // minLength is optional
                            if (context.minLength() == null)
                                return true;
                            // if there are convert exceptions, let it bomb out -- language parser should have handled
                            var minLength = Convert.ToInt32(context.minLength().MinLength());
                            var maxLength = Convert.ToInt32(context.maxLength().MaxLength());
                            return minLength <= maxLength;
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, CommonStringContext = context) {
                            return string.Format("Common String '{0}' has min length greater than max length.", context.commonStringName().GetText());
                        }
                    };
            })(CommonSimpleType = Validator.CommonSimpleType || (Validator.CommonSimpleType = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=CommonStringMinLengthMustNotBeGreaterThanMaxLength.js.map