export function ensureArray<T>(input: unknown, label?: string): T[] {
  if (Array.isArray(input)) {
    return input as T[];
  }

  const descriptor = input === null ? "null" : typeof input;
  console.warn(
    `[ensureArray] Expected array${label ? ` for ${label}` : ""} but received ${descriptor}.`,
    input,
  );
  return [];
}
