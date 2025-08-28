// schema from the joi library
// https://github.com/hapijs/joi/blob/master/API.md
export type JoiSchema = any;

export interface JoiErrorDetail {
  message: string;
  path: string[];
}

export interface JoiError {
  details: JoiErrorDetail[];
  message: string;
}

export interface JoiResult {
  error: JoiError | null;
}
