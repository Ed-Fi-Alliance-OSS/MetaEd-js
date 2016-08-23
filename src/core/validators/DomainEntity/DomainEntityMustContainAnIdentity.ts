import { ValidationRuleBase } from "../ValidationRuleBase";
    export class DomainEntityMustContainAnIdentity extends ValidationRuleBase<MetaEdGrammar.DomainEntityContext>
    {
        public isValid(context: MetaEdGrammar.DomainEntityContext): boolean {
            return context.property().Any(x => x.GetProperty().propertyComponents().propertyAnnotation().identity() != null);
        }
        public getFailureMessage(context: MetaEdGrammar.DomainEntityContext): string {
            return string.Format("Domain Entity {0} does not have an identity specified.", context.entityName().ID().GetText());
        }
    }
}