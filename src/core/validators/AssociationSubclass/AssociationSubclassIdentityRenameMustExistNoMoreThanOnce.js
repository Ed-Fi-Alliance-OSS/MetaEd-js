"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class AssociationSubclassIdentityRenameMustExistNoMoreThanOnce extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        var identityRenameCount = context.property().Count(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null);
        return identityRenameCount <= 1;
    }
    getFailureMessage(context) {
        var identifier = context.associationName().GetText();
        var baseIdentifier = context.baseName().GetText();
        var identityRenames = context.property().Select(y => y.GetProperty().propertyComponents().propertyAnnotation().identityRename()).Where(x => x != null);
        var basePropertyIdentifier = identityRenames.Select(pkr => pkr.baseKeyName().GetText()).join(', ');
        return `Association '${identifier}' based on '${baseIdentifier}' tries to rename columns ${basePropertyIdentifier}.  Only one identity rename is allowed for a given Association.`;
    }
}
exports.AssociationSubclassIdentityRenameMustExistNoMoreThanOnce = AssociationSubclassIdentityRenameMustExistNoMoreThanOnce;
//# sourceMappingURL=AssociationSubclassIdentityRenameMustExistNoMoreThanOnce.js.map