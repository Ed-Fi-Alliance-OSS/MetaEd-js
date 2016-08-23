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
                class DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits {
                }
                ValidationRuleBase < MetaEdGrammar.DecimalPropertyContext >
                    {
                        override: bool, IsValid(MetaEdGrammar, DecimalPropertyContext = context) {
                            // if there are convert exceptions, let it bomb out -- language parser should have handled
                            var decimalPlaces = context.decimalPlaces().DecimalPlaces();
                            var totalDigits = context.totalDigits().TotalDigits();
                            return Convert.ToInt32(decimalPlaces) <= Convert.ToInt32(totalDigits);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, DecimalPropertyContext = context) {
                            return string.Format("Decimal Property '{0}' in {1} '{2}' has decimal places greater than total digits.", context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
                        }
                    };
            })(DecimalProperty = Validator.DecimalProperty || (Validator.DecimalProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits.js.map