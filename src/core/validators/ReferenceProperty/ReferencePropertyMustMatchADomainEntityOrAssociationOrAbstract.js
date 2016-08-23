var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var ReferenceProperty;
            (function (ReferenceProperty) {
                class ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var identifierToMatch = context.propertyName().GetText();
                        return this._symbolTable.IdentifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
                    }
                    getFailureMessage(context) {
                        return string.Format("Reference property '{0}' does not match any declared domain entity or subclass, association or subclass, or abstract entity.", context.propertyName().GetText());
                    }
                }
                ReferenceProperty.ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract = ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract;
            })(ReferenceProperty = Validator.ReferenceProperty || (Validator.ReferenceProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract.js.map