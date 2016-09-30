export class TestDomainEntityContextValidation 
{
    public isValid(context: any): boolean {
        return false;
    }
    public getFailureMessage(context: any): string {
        return "Property is a validation.";
    }
}
  