/**
 * Checks if a string matches the common format of a Swedish personal or organization number.
 * This is a format check, not a full Luhn algorithm validation. It is intended for
 * identifying probable Swedish numbers for UI or routing logic.
 *
 * @param {string | null | undefined} idNumber The number to check.
 * @returns {boolean} True if the format matches, false otherwise.
 */
export function isSwedishIdentityNumber(idNumber) {
  if (!idNumber || typeof idNumber !== 'string') {
    return false;
  }
  // Regex for YYYYMMDD-XXXX, YYMMDD-XXXX, or the 12/10 digit versions without hyphen.
  const swedishIdRegex = /^(19|20)?\d{6}[-+]?\d{4}$/;
  return swedishIdRegex.test(idNumber.trim());
}
