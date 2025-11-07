/**
 * Checks if a string matches the format of a Swedish organization number (10 digits).
 * This is a format check, not a full Luhn algorithm validation.
 *
 * @param {string | null | undefined} idNumber The number to check.
 * @returns {boolean} True if the format matches, false otherwise.
 */
export function isSwedishOrganizationNumber(idNumber) {
  if (!idNumber || typeof idNumber !== 'string') {
    return false;
  }
  // Remove all non-digit characters.
  const numericVal = idNumber.replace(/\D/g, '');
  // Check if it's exactly 10 digits long.
  return /^\d{10}$/.test(numericVal);
}
