var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var DomainEntityExtension;
            (function (DomainEntityExtension) {
                class DomainEntityExtensionExistsOnlyInExtensionNamespace extends ValidationRuleBase {
                    isValid(context) {
                        var namespaceInfo = context.GetAncestorContext();
                        return namespaceInfo.IsExtension;
                    }
                    getFailureMessage(context) {
                        var namespaceInfo = context.GetAncestorContext();
                        return string.Format("Domain Entity additions '{0}' is not valid in core namespace '{1}'.", context.extendeeName().GetText(), namespaceInfo.NamespaceName);
                    }
                }
                DomainEntityExtension.DomainEntityExtensionExistsOnlyInExtensionNamespace = DomainEntityExtensionExistsOnlyInExtensionNamespace;
            })(DomainEntityExtension = Validator.DomainEntityExtension || (Validator.DomainEntityExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntityExtensionExistsOnlyInExtensionNamespace.js.map