export class ObjectUtil {

  /**
   * Check if value is object
   * @param value any value
   * @returns true, if value is object
   */
  public static isObject<T extends object>(value: unknown): value is T {
    return String(value) === '[object Object]';
  }

}
