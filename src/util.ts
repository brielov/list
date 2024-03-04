export function assert(
  // deno-lint-ignore no-explicit-any
  condition: any,
  message = "Assertion failed",
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function isDefined<T>(value: T): value is NonNullable<T> {
  return typeof value !== "undefined" && value !== null;
}

/**
 * Type guard to check if an object is iterable.
 * @param {unknown} obj The object to check.
 * @returns {obj is Iterable<unknown>} True if the object is iterable, false otherwise.
 */
export function isIterable(obj: unknown): obj is Iterable<unknown> {
  return typeof obj === "object" && obj !== null && Symbol.iterator in obj;
}
