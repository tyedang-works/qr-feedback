// export const SESSION_DURATION_MS = 5 * 60 * 60 * 1000;
// export const SESSION_REMINDER_BEFORE_MS = 5 * 60 * 1000;
export const SESSION_DURATION_MS = 1 * 60 * 1000;
export const SESSION_REMINDER_BEFORE_MS = 30 * 1000;

const SESSION_STARTED_AT_KEY = "qr-session-started-at";

export function getSessionStartedAt(): number | null {
    if (typeof window === "undefined") return null;

    const value = sessionStorage.getItem(SESSION_STARTED_AT_KEY);

    if (!value) return null;

    const timestamp = Number(value);

    return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : null;
}

export function startSessionCycle(timestamp = Date.now()): void {
    if (typeof window === "undefined") return;

    sessionStorage.setItem(SESSION_STARTED_AT_KEY, String(timestamp));
}

export function clearSessionCycle(): void {
    if (typeof window === "undefined") return;

    sessionStorage.removeItem(SESSION_STARTED_AT_KEY);
}
