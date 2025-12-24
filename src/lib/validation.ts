/**
 * Validates and parses a positive integer from a string input.
 * @param value - The string value to parse
 * @param defaultValue - The default value if parsing fails
 * @param max - Optional maximum allowed value
 * @returns A valid positive integer
 */
export const validatePositiveInteger = (
  value: string,
  defaultValue: number,
  max?: number
): number => {
  const trimmed = value.trim();
  
  // Check if the string only contains digits
  if (!/^\d+$/.test(trimmed)) {
    return defaultValue;
  }
  
  const parsed = parseInt(trimmed, 10);
  
  if (isNaN(parsed) || parsed < 0) {
    return defaultValue;
  }
  
  if (max !== undefined && parsed > max) {
    return max;
  }
  
  return parsed;
};

/**
 * Safely parses an integer with radix 10
 * @param value - The string value to parse
 * @param defaultValue - The default value if parsing fails
 * @returns The parsed integer or default value
 */
export const safeParseInt = (value: string, defaultValue: number): number => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};
