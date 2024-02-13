/**
 * In copying Shared entity restrictions (e.g. minValue) over to their referring properties,
 * there is a mismatch between entity restriction types and property restriction types.
 *
 * Entities do not allow null restrictions, and so restrictions are initialized to empty string.
 * However, the corresponding properties do allow null restrictions, and in fact the
 * code expects a non-empty value if the restriction is not null.
 *
 * This function fixes the mismatch that would otherwise occur when copying restrictions over.
 */
export function withEmptyAsNull(value: string): string | null {
  return value === '' ? null : value;
}
