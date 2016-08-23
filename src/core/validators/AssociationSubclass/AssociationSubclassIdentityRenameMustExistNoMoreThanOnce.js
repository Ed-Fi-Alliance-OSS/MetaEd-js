var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var AssociationSubclass;
            (function (AssociationSubclass) {
                class AssociationSubclassIdentityRenameMustExistNoMoreThanOnce extends ValidationRuleBase {
                    isValid(context) {
                        var identityRenameCount = context.property().Count(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null);
                        return identityRenameCount <= 1;
                    }
                    getFailureMessage(context) {
                        var identifier = context.associationName().GetText();
                        var baseIdentifier = context.baseName().GetText();
                        var identityRenames = context.property().Select(y => y.GetProperty().propertyComponents().propertyAnnotation().identityRename()).Where(x => x != null);
                        var basePropertyIdentifier = string.Join(", ", identityRenames.Select(pkr => pkr.baseKeyName().GetText()));
                        return string.Format("Association '{0}' based on '{1}' tries to rename columns {2}.  Only one identity rename is allowed for a given Association.", identifier, baseIdentifier, basePropertyIdentifier);
                    }
                }
                AssociationSubclass.AssociationSubclassIdentityRenameMustExistNoMoreThanOnce = AssociationSubclassIdentityRenameMustExistNoMoreThanOnce;
            })(AssociationSubclass = Validator.AssociationSubclass || (Validator.AssociationSubclass = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=AssociationSubclassIdentityRenameMustExistNoMoreThanOnce.js.map