/**
 * BankID Session Manager
 * Handles session persistence across page reloads and browser navigation
 */

const STORAGE_KEY = 'bankid-session-state';
const SESSION_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

export const bankidSessionManager = {
  /**
   * Save session state to localStorage
   */
  saveState: (sessionData) => {
    try {
      const stateToStore = {
        ...sessionData,
        timestamp: Date.now(),
        expiresAt: Date.now() + SESSION_EXPIRY_MS
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore));
    } catch (error) {
      console.warn('[SESSION MANAGER] Failed to save state:', error);
    }
  },

  /**
   * Get session state from localStorage
   */
  getState: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return null;
      }

      const state = JSON.parse(stored);
      const now = Date.now();
      
      // Check if session has expired
      if (state.expiresAt && now > state.expiresAt) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return state;
    } catch (error) {
      console.warn('[SESSION MANAGER] Failed to get state:', error);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  },

  /**
   * Clear session state
   */
  clearState: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('[SESSION MANAGER] Failed to clear state:', error);
    }
  },

  /**
   * Update session state (partial update)
   */
  updateState: (updates) => {
    try {
      const currentState = bankidSessionManager.getState();
      if (currentState) {
        const newState = { ...currentState, ...updates };
        bankidSessionManager.saveState(newState);
      }
    } catch (error) {
      console.warn('[SESSION MANAGER] Failed to update state:', error);
    }
  },

  /**
   * Check if we have a potentially active session
   */
  hasActiveState: () => {
    const state = bankidSessionManager.getState();
    return state && state.status && ['initializing', 'active', 'pending'].includes(state.status);
  }
};

export default bankidSessionManager;