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
            var IntegerProperty;
            (function (IntegerProperty) {
                class IntegerPropertyMinValueMustNotBeGreaterThanMaxValue {
                }
                ValidationRuleBase < MetaEdGrammar.IntegerPropertyContext >
                    {
                        override: bool, IsValid(MetaEdGrammar, IntegerPropertyContext = context) {
                            if (context.minValue() == null || context.maxValue() == null)
                                return true;
                            // if there are convert exceptions, let it bomb out -- language parser should have handled
                            var minValue = Convert.ToInt32(context.minValue().MinValue());
                            var maxValue = Convert.ToInt32(context.maxValue().MaxValue());
                            return minValue <= maxValue;
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, IntegerPropertyContext = context) {
                            return string.Format("Integer Property '{0}' in {1} '{2}' has min value greater than max value.", context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
                        }
                    };
            })(IntegerProperty = Validator.IntegerProperty || (Validator.IntegerProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=IntegerPropertyMinValueMustNotBeGreaterThanMaxValue.js.map