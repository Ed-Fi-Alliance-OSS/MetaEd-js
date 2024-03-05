export interface SuccessfulDeployResult {
  success: true;
}

export interface FailureDeployResult {
  success: false;
  failureMessage: string;
}

export type DeployResult = SuccessfulDeployResult | FailureDeployResult;
