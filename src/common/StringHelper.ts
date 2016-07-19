export default class StringHelper {
  static format(formatString: string, ...args: string[]): string {
    let result = formatString;
    for (let i = 0; i < args.length; i++) {
      result = result.replace(new RegExp('\\{' + i + '\\}', 'gm'), args[i]);
    }
    return result;
  }
}
