var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var DomainEntityExtension;
            (function (DomainEntityExtension) {
                class DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var identifier = context.extendeeName().GetText();
                        return this._symbolTable.IdentifiersForEntityType(SymbolTableEntityType.DomainEntityEntityType()).Any(x => x.Equals(identifier)) || this._symbolTable.IdentifiersForEntityType(SymbolTableEntityType.DomainEntitySubclassEntityType()).Any(x => x.Equals(identifier));
                    }
                    getFailureMessage(context) {
                        return string.Format("Domain Entity additions '{0}' does not match any declared Domain Entity or Domain Entity Subclass.", context.extendeeName().GetText());
                    }
                }
                DomainEntityExtension.DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass = DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass;
            })(DomainEntityExtension = Validator.DomainEntityExtension || (Validator.DomainEntityExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass.js.map