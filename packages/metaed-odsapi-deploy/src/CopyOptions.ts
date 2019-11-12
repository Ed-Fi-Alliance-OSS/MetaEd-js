export interface CopyOptions {
  src: string;
  dest: string;
  options?: {
    filter?: (src: string, dest: string) => boolean;
  };
}
