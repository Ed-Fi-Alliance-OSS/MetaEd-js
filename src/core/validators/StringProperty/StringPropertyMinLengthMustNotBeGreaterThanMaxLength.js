using;
System;
using;
MetaEd.Grammar.Antlr;
using;
MetaEd.Grammar.Antlr.Extensions;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var StringProperty;
            (function (StringProperty) {
                class StringPropertyMinLengthMustNotBeGreaterThanMaxLength {
                }
                ValidationRuleBase < MetaEdGrammar.StringPropertyContext >
                    {
                        override: bool, IsValid(MetaEdGrammar, StringPropertyContext = context) {
                            // minLength is optional
                            if (context.minLength() == null)
                                return true;
                            // if there are convert exceptions, let it bomb out -- language parser should have handled
                            var minLength = Convert.ToInt32(context.minLength().MinLength());
                            var maxLength = Convert.ToInt32(context.maxLength().MaxLength());
                            return minLength <= maxLength;
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, StringPropertyContext = context) {
                            return string.Format("String Property '{0}' in {1} '{2}' has min length greater than max length.", context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
                        }
                    };
            })(StringProperty = Validator.StringProperty || (Validator.StringProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=StringPropertyMinLengthMustNotBeGreaterThanMaxLength.js.map