"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DomainEntityMustContainNoMoreThanOneUniqueIdColumn extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        var namespaceInfo = context.GetAncestorContext();
        return namespaceInfo.IsExtension || context.property().Count(x => x.GetProperty().PropertyName() == "UniqueId") <= 1;
    }
    getFailureMessage(context) {
        return string.Format("Domain Entity {0} has multiple properties with a property name of 'UniqueId'.  Only one column in a core domain entity can be named 'UniqueId'.", context.entityName().ID().GetText());
    }
}
exports.DomainEntityMustContainNoMoreThanOneUniqueIdColumn = DomainEntityMustContainNoMoreThanOneUniqueIdColumn;
//# sourceMappingURL=DomainEntityMustContainNoMoreThanOneUniqueIdColumn.js.map