/**
 * Shared session tracker for BankID initiations
 * Prevents race conditions and session conflicts
 */

class BankIdSessionTracker {
  constructor() {
    this.ongoingInitiations = new Map();
  }

  /**
   * Check if a personal number has an ongoing initiation
   * @param {string} personalNumber 
   * @returns {boolean}
   */
  hasOngoingInitiation(personalNumber) {
    if (!this.ongoingInitiations.has(personalNumber)) {
      return false;
    }

    // Check if the initiation is stale (older than 30 seconds)
    const initiationTime = this.ongoingInitiations.get(personalNumber);
    if (Date.now() - initiationTime > 30000) {
      // Clean up stale initiation
      this.ongoingInitiations.delete(personalNumber);
      return false;
    }

    return true;
  }

  /**
   * Mark a personal number as having an ongoing initiation
   * @param {string} personalNumber 
   */
  setOngoingInitiation(personalNumber) {
    this.ongoingInitiations.set(personalNumber, Date.now());
  }

  /**
   * Clear an ongoing initiation
   * @param {string} personalNumber 
   */
  clearOngoingInitiation(personalNumber) {
    this.ongoingInitiations.delete(personalNumber);
  }

  /**
   * Clean up stale initiations (older than 5 minutes)
   * This should be called periodically
   */
  cleanupStaleInitiations() {
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    for (const [personalNumber, timestamp] of this.ongoingInitiations) {
      if (timestamp < fiveMinutesAgo) {
        this.ongoingInitiations.delete(personalNumber);
      }
    }
  }
}

// Singleton instance
const bankIdSessionTracker = new BankIdSessionTracker();

// Clean up stale initiations every 5 minutes
setInterval(() => {
  bankIdSessionTracker.cleanupStaleInitiations();
}, 5 * 60 * 1000);

export default bankIdSessionTracker;