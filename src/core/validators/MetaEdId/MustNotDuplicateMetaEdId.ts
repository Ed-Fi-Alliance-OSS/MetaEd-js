import { ValidationRuleBase } from "../ValidationRuleBase";
    export class MustNotDuplicateMetaEdId extends ValidationRuleBase<MetaEdGrammar.MetaEdIdContext>
    {
        private _trackedMetaEdIds: ISet<string> = new HashSet<string>();
        public isValid(context: MetaEdGrammar.MetaEdIdContext): boolean {
            var metaEdId: string = context.GetValue();
            return this._trackedMetaEdIds.Add(metaEdId);
        }
        public getFailureMessage(context: MetaEdGrammar.MetaEdIdContext): string {
            var metaEdId: string = context.GetValue();
            return string.Format("MetaEdId '{0}' exists on multiple entities.  All MetaEdIds must be globally unique.",
                metaEdId);
        }
    }
}