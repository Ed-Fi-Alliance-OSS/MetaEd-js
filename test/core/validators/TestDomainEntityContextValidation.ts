export class TestDomainEntityContextValidation 
{
    public isValid(context: MetaEdGrammar.PropertyContext): boolean {
        return false;
    }
    public getFailureMessage(context: MetaEdGrammar.PropertyContext): string {
        return "Property is a validation.";
    }
}
  