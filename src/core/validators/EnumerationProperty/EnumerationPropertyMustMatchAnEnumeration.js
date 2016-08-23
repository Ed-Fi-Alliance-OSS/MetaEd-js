var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var EnumerationProperty;
            (function (EnumerationProperty) {
                class EnumerationPropertyMustMatchAnEnumeration extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var identifierToMatch = context.propertyName().GetText();
                        return this._symbolTable.IdentifierExists(SymbolTableEntityType.EnumerationEntityType(), identifierToMatch);
                    }
                    getFailureMessage(context) {
                        return string.Format("Enumeration property '{0}' does not match any declared enumeration.", context.propertyName().GetText());
                    }
                }
                EnumerationProperty.EnumerationPropertyMustMatchAnEnumeration = EnumerationPropertyMustMatchAnEnumeration;
            })(EnumerationProperty = Validator.EnumerationProperty || (Validator.EnumerationProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=EnumerationPropertyMustMatchAnEnumeration.js.map