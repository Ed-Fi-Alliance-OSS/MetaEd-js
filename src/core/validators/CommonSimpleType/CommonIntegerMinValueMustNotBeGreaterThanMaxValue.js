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
                class CommonIntegerMinValueMustNotBeGreaterThanMaxValue {
                }
                ValidationRuleBase < MetaEdGrammar.CommonIntegerContext >
                    {
                        override: bool, IsValid(MetaEdGrammar, CommonIntegerContext = context) {
                            if (context.minValue() == null || context.maxValue() == null)
                                return true;
                            // if there are convert exceptions, let it bomb out -- language parser should have handled
                            var minValue = Convert.ToInt32(context.minValue().MinValue());
                            var maxValue = Convert.ToInt32(context.maxValue().MaxValue());
                            return minValue <= maxValue;
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, CommonIntegerContext = context) {
                            return string.Format("Common Integer '{0}' has min value greater than max value.", context.commonIntegerName().GetText());
                        }
                    };
            })(CommonSimpleType = Validator.CommonSimpleType || (Validator.CommonSimpleType = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=CommonIntegerMinValueMustNotBeGreaterThanMaxValue.js.map