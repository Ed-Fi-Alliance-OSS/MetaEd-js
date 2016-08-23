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
            var InlineCommonType;
            (function (InlineCommonType) {
                class InlineCommonTypeExistsOnlyInCoreNamespace {
                }
                ValidationRuleBase < MetaEdGrammar.InlineCommonTypeContext >
                    {
                        override: bool, IsValid(MetaEdGrammar, InlineCommonTypeContext = context) {
                            var namespaceInfo = context.GetAncestorContext();
                            return !namespaceInfo.IsExtension;
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, InlineCommonTypeContext = context) {
                            var namespaceInfo = context.GetAncestorContext();
                            return string.Format("Inline Common Type '{0}' is not valid in extension namespace '{1}'.", context.EntityName(), namespaceInfo.NamespaceName);
                        }
                    };
            })(InlineCommonType = Validator.InlineCommonType || (Validator.InlineCommonType = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=InlineCommonTypeExistsOnlyInCoreNamespace.js.map