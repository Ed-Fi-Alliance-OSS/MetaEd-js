var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var AssociationExtension;
            (function (AssociationExtension) {
                class AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var identifierToMatch = context.extendeeName().GetText();
                        return this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch);
                    }
                    getFailureMessage(context) {
                        return string.Format("Association additions '{0}' does not match any declared Association or subclass.", context.extendeeName().GetText());
                    }
                }
                AssociationExtension.AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass = AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass;
            })(AssociationExtension = Validator.AssociationExtension || (Validator.AssociationExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass.js.map