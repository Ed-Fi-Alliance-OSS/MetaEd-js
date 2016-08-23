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
            var DomainEntityExtension;
            (function (DomainEntityExtension) {
                class DomainEntityExtensionExistsOnlyInExtensionNamespace {
                }
                ValidationRuleBase < MetaEdGrammar.DomainEntityExtensionContext >
                    {
                        override: bool, IsValid(MetaEdGrammar, DomainEntityExtensionContext = context) {
                            var namespaceInfo = context.GetAncestorContext();
                            return namespaceInfo.IsExtension;
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, DomainEntityExtensionContext = context) {
                            var namespaceInfo = context.GetAncestorContext();
                            return string.Format("Domain Entity additions '{0}' is not valid in core namespace '{1}'.", context.extendeeName().GetText(), namespaceInfo.NamespaceName);
                        }
                    };
            })(DomainEntityExtension = Validator.DomainEntityExtension || (Validator.DomainEntityExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntityExtensionExistsOnlyInExtensionNamespace.js.map