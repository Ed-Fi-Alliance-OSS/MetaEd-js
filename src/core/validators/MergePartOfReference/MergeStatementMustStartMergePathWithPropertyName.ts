import { ValidationRuleBase } from "../ValidationRuleBase";
    export class MergeStatementMustStartMergePathWithPropertyName extends ValidationRuleBase<MetaEdGrammar.MergePartOfReferenceContext>
    {
        public isValid(context: MetaEdGrammar.MergePartOfReferenceContext): boolean {
            var parent = __as__<MetaEdGrammar.ReferencePropertyContext>(context.Parent, MetaEdGrammar.ReferencePropertyContext);
            if (parent == null)
                return false;
            var referenceName = parent.propertyName().IdText();
            return context.mergePropertyPath().propertyPath().PropertyPathParts()[0] == referenceName;
        }
        public getFailureMessage(context: MetaEdGrammar.MergePartOfReferenceContext): string {
            return "Merge statement must start first property path with the referenced entity name of the current property.";
        }
    }
