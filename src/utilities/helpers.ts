/**
 * Helpers that are used throughout the API to reduce duplicated code.
 */

/**
 * Name: ProcessMessage
 * Take two parameters, a string or string array as current, and a string as
 * addition, if current is an empty string it returns addition, if current
 * is a string it returns an array of the current string and the addition
 * string, and if current is an array, it pushes addition onto currect and
 * returns current.
 */
export const ProcessMessage = (
    current: string | string[],
    addition: string
): string | string[] => {
  if (typeof current === 'string' && current.length) {
    return [current, addition];
  }
  if (Array.isArray(current)) {
    current.push(addition)
    return current;
  }
  return addition;
}


