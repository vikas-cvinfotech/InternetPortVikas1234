// In-memory session storage as a workaround for broken Next.js cookie handling
// This is a temporary solution until we can figure out the cookie issue

const sessions = new Map();
const SESSION_TTL = 10 * 60 * 1000; // 10 minutes

// Clean up expired sessions every minute
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessions) {
    if (now > session.expiresAt) {
      sessions.delete(sessionId);
    }
  }
}, 60 * 1000);

function generateSessionId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function createMemorySession(sessionData) {
  const sessionId = generateSessionId();
  const expiresAt = Date.now() + SESSION_TTL;
  
  sessions.set(sessionId, {
    data: sessionData,
    createdAt: Date.now(),
    expiresAt: expiresAt
  });
  
  return sessionId;
}

export function getMemorySession(sessionId) {
  if (!sessionId) {
    return null;
  }
  
  const session = sessions.get(sessionId);
  if (!session) {
    return null;
  }
  
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return null;
  }
  
  return session.data;
}

export function destroyMemorySession(sessionId) {
  if (!sessionId) {
    return;
  }
  
  sessions.delete(sessionId);
}

export function listActiveSessions() {
  const activeSessions = [];
  for (const [sessionId, session] of sessions) {
    activeSessions.push({
      sessionId,
      expiresIn: Math.round((session.expiresAt - Date.now()) / 1000)
    });
  }
  return activeSessions;
}