"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity extends ValidationRuleBase_1.ValidationRuleBase {
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
exports.DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity = DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity;
//# sourceMappingURL=DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity.js.map