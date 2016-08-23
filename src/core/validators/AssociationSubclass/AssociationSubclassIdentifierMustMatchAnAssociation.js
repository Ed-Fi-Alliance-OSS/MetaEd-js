var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var AssociationSubclass;
            (function (AssociationSubclass) {
                class AssociationSubclassIdentifierMustMatchAnAssociation extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var associationEntityType = context.ASSOCIATION().GetText();
                        var basedOnName = context.baseName().GetText();
                        return this._symbolTable.IdentifiersForEntityType(associationEntityType).Any(x => x.Equals(basedOnName));
                    }
                    getFailureMessage(context) {
                        return string.Format("Association '{0}' based on '{1}' does not match any declared Association.", context.associationName().GetText(), context.baseName().GetText());
                    }
                }
                AssociationSubclass.AssociationSubclassIdentifierMustMatchAnAssociation = AssociationSubclassIdentifierMustMatchAnAssociation;
            })(AssociationSubclass = Validator.AssociationSubclass || (Validator.AssociationSubclass = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=AssociationSubclassIdentifierMustMatchAnAssociation.js.map