import { ValidationRuleBase } from "../ValidationRuleBase";
    export class IncludePropertyMustNotContainIdentity extends ValidationRuleBase<MetaEdGrammar.IncludePropertyContext>
    {
        public isValid(context: MetaEdGrammar.IncludePropertyContext): boolean {
            return context.propertyComponents().propertyAnnotation().identity() == null;
        }
        public getFailureMessage(context: MetaEdGrammar.IncludePropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return string.Format("Include property '{0}' is invalid to be used for the identity of {1} '{2}'", context.propertyName().GetText(), topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName());
        }
    }
}