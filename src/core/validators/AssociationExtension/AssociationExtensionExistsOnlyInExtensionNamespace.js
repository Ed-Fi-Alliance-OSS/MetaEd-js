var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var AssociationExtension;
            (function (AssociationExtension) {
                class AssociationExtensionExistsOnlyInExtensionNamespace extends ValidationRuleBase {
                    isValid(context) {
                        var namespaceInfo = context.GetAncestorContext();
                        return namespaceInfo.IsExtension;
                    }
                    getFailureMessage(context) {
                        var namespaceInfo = context.GetAncestorContext();
                        return string.Format("Association additions '{0}' is not valid in core namespace '{1}'.", context.extendeeName().GetText(), namespaceInfo.NamespaceName);
                    }
                }
                AssociationExtension.AssociationExtensionExistsOnlyInExtensionNamespace = AssociationExtensionExistsOnlyInExtensionNamespace;
            })(AssociationExtension = Validator.AssociationExtension || (Validator.AssociationExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=AssociationExtensionExistsOnlyInExtensionNamespace.js.map