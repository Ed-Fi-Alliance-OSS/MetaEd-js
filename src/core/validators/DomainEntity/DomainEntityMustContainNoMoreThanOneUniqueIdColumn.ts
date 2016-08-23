import { ValidationRuleBase } from "../ValidationRuleBase";
    export class DomainEntityMustContainNoMoreThanOneUniqueIdColumn extends ValidationRuleBase<MetaEdGrammar.DomainEntityContext>
    {
        public isValid(context: MetaEdGrammar.DomainEntityContext): boolean {
            var namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
            return namespaceInfo.IsExtension || context.property().Count(x => x.GetProperty().PropertyName() == "UniqueId") <= 1;
        }
        public getFailureMessage(context: MetaEdGrammar.DomainEntityContext): string {
            return string.Format("Domain Entity {0} has multiple properties with a property name of 'UniqueId'.  Only one column in a core domain entity can be named 'UniqueId'.", context.entityName().ID().GetText());
        }
    }
}