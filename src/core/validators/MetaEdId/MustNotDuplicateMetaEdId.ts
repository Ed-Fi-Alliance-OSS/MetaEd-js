import { ValidationRuleBase } from "../ValidationRuleBase";
export class MustNotDuplicateMetaEdId extends ValidationRuleBase<MetaEdGrammar.MetaEdIdContext>
{
    private _trackedMetaEdIds: ISet<string> = new HashSet<string>();
    public isValid(context: MetaEdGrammar.MetaEdIdContext): boolean {
        let metaEdId: string = context.GetValue();
        return this._trackedMetaEdIds.Add(metaEdId);
    }
    public getFailureMessage(context: MetaEdGrammar.MetaEdIdContext): string {
        let metaEdId: string = context.GetValue();
        return `MetaEdId '${metaEdId}' exists on multiple entities.  All MetaEdIds must be globally unique.';
    }
}
