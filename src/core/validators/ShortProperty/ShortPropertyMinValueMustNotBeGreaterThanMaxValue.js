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
            var ShortProperty;
            (function (ShortProperty) {
                class ShortPropertyMinValueMustNotBeGreaterThanMaxValue {
                }
                ValidationRuleBase < MetaEdGrammar.ShortPropertyContext >
                    {
                        override: bool, IsValid(MetaEdGrammar, ShortPropertyContext = context) {
                            if (context.minValue() == null || context.maxValue() == null)
                                return true;
                            // if there are convert exceptions, let it bomb out -- language parser should have handled
                            var minValue = Convert.ToInt32(context.minValue().MinValue());
                            var maxValue = Convert.ToInt32(context.maxValue().MaxValue());
                            return minValue <= maxValue;
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, ShortPropertyContext = context) {
                            return string.Format("Short Property '{0}' in {1} '{2}' has min value greater than max value.", context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
                        }
                    };
            })(ShortProperty = Validator.ShortProperty || (Validator.ShortProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=ShortPropertyMinValueMustNotBeGreaterThanMaxValue.js.map