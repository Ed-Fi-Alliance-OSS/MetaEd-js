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
                class CommonDecimalMinValueMustNotBeGreaterThanMaxValue {
                }
                ValidationRuleBase < MetaEdGrammar.CommonDecimalContext >
                    {
                        override: bool, IsValid(MetaEdGrammar, CommonDecimalContext = context) {
                            if (context.minValueDecimal() == null || context.maxValueDecimal() == null)
                                return true;
                            // if there are convert exceptions, let it bomb out -- language parser should have handled
                            var minValue = context.minValueDecimal().MinValue();
                            var maxValue = context.maxValueDecimal().MaxValue();
                            return Convert.ToDecimal(minValue) <= Convert.ToDecimal(maxValue);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, CommonDecimalContext = context) {
                            return string.Format("Common Decimal '{0}' has min value greater than max value.", context.commonDecimalName().GetText());
                        }
                    };
            })(CommonSimpleType = Validator.CommonSimpleType || (Validator.CommonSimpleType = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=CommonDecimalMinValueMustNotBeGreaterThanMaxValue.js.map