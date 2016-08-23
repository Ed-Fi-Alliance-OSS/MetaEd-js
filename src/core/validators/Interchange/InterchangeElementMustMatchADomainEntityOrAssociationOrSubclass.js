var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var Interchange;
            (function (Interchange) {
                class InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var identifierToMatch = context.IdText();
                        return this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
                    }
                    getFailureMessage(context) {
                        return string.Format("Interchange element '{0}' does not match any declared domain entity or subclass, association or subclass.", context.IdText());
                    }
                }
                Interchange.InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass = InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass;
            })(Interchange = Validator.Interchange || (Validator.Interchange = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass.js.map