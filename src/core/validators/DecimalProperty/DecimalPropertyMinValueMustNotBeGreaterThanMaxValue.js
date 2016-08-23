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
            var DecimalProperty;
            (function (DecimalProperty) {
                class DecimalPropertyMinValueMustNotBeGreaterThanMaxValue {
                }
                ValidationRuleBase < MetaEdGrammar.DecimalPropertyContext >
                    {
                        override: bool, IsValid(MetaEdGrammar, DecimalPropertyContext = context) {
                            if (context.minValueDecimal() == null || context.maxValueDecimal() == null)
                                return true;
                            // if there are convert exceptions, let it bomb out -- language parser should have handled
                            var minValue = context.minValueDecimal().MinValue();
                            var maxValue = context.maxValueDecimal().MaxValue();
                            return Convert.ToDecimal(minValue) <= Convert.ToDecimal(maxValue);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, DecimalPropertyContext = context) {
                            return string.Format("Decimal Property '{0}' in {1} '{2}' has min value greater than max value.", context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
                        }
                    };
            })(DecimalProperty = Validator.DecimalProperty || (Validator.DecimalProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DecimalPropertyMinValueMustNotBeGreaterThanMaxValue.js.map