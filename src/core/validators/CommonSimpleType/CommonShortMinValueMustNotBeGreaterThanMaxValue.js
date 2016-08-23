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
                class CommonShortMinValueMustNotBeGreaterThanMaxValue {
                }
                ValidationRuleBase < MetaEdGrammar.CommonShortContext >
                    {
                        override: bool, IsValid(MetaEdGrammar, CommonShortContext = context) {
                            if (context.minValue() == null || context.maxValue() == null)
                                return true;
                            // if there are convert exceptions, let it bomb out -- language parser should have handled
                            var minValue = Convert.ToInt32(context.minValue().MinValue());
                            var maxValue = Convert.ToInt32(context.maxValue().MaxValue());
                            return minValue <= maxValue;
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, CommonShortContext = context) {
                            return string.Format("Common Short '{0}' has min value greater than max value.", context.commonShortName().GetText());
                        }
                    };
            })(CommonSimpleType = Validator.CommonSimpleType || (Validator.CommonSimpleType = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=CommonShortMinValueMustNotBeGreaterThanMaxValue.js.map