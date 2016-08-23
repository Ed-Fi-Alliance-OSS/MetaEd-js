var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var DomainEntitySubclass;
            (function (DomainEntitySubclass) {
                class DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var anyIdentityRenames = context.property().Any(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null);
                        if (!anyIdentityRenames)
                            return true;
                        var baseIdentifier = context.baseName().GetText();
                        var baseSymbolTable = this._symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), baseIdentifier);
                        if (baseSymbolTable == null)
                            return true;
                        return baseSymbolTable.PropertySymbolTable.Values().Count(v => v.propertyComponents().propertyAnnotation().identity() != null) <= 1;
                    }
                    getFailureMessage(context) {
                        var identifier = context.entityName().GetText();
                        var baseIdentifier = context.baseName().GetText();
                        return string.Format("Domain Entity '{0}' based on '{1}' is invalid for identity rename because parent entity '{1}' has more than one identity property.", identifier, baseIdentifier);
                    }
                }
                DomainEntitySubclass.DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity = DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity;
            })(DomainEntitySubclass = Validator.DomainEntitySubclass || (Validator.DomainEntitySubclass = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity.js.map