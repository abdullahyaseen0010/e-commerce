import type { AuthCredentials, AuthSession, RegisterPayload, User } from "@/types/user";
import { apiClient, mockDelay, USE_MOCK } from "./client";
import { seedMockUser, clearMockUser } from "./user";

const MOCK_TOKEN_PREFIX = "mock-token-";
const SESSION_LENGTH_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

// Mock user directory keyed by email. Plain-text passwords are for local
// demo purposes only — a real backend must never work this way.
const mockDirectory = new Map<string, { password: string; user: User }>([
  [
    "amelia@example.com",
    {
      password: "password123",
      user: {
        id: "user-001",
        email: "amelia@example.com",
        firstName: "Amelia",
        lastName: "Stone",
        createdAt: "2026-01-05T09:00:00.000Z",
      },
    },
  ],
]);

function createMockSession(user: User): AuthSession {
  return {
    user,
    token: `${MOCK_TOKEN_PREFIX}${user.id}`,
    expiresAt: new Date(Date.now() + SESSION_LENGTH_MS).toISOString(),
  };
}

export async function login(credentials: AuthCredentials): Promise<AuthSession> {
  if (!USE_MOCK) {
    return apiClient.post<AuthSession>("/auth/login", credentials);
  }

  await mockDelay();
  const record = mockDirectory.get(credentials.email.toLowerCase());
  if (!record || record.password !== credentials.password) {
    throw new Error("Invalid email or password.");
  }

  seedMockUser(record.user);
  return createMockSession(record.user);
}

export async function register(payload: RegisterPayload): Promise<AuthSession> {
  if (!USE_MOCK) {
    return apiClient.post<AuthSession>("/auth/register", payload);
  }

  await mockDelay();
  const email = payload.email.toLowerCase();
  if (mockDirectory.has(email)) {
    throw new Error("An account with this email already exists.");
  }

  const user: User = {
    id: `user-${Date.now()}`,
    email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    createdAt: new Date().toISOString(),
  };

  mockDirectory.set(email, { password: payload.password, user });
  seedMockUser(user);
  return createMockSession(user);
}

export async function logout(): Promise<void> {
  if (!USE_MOCK) {
    await apiClient.post<void>("/auth/logout");
    return;
  }
  await mockDelay(150);
  clearMockUser();
}

export async function requestPasswordReset(email: string): Promise<{ sent: boolean }> {
  if (!USE_MOCK) {
    return apiClient.post<{ sent: boolean }>("/auth/forgot-password", { email });
  }
  await mockDelay();
  // Always resolve as sent in mock mode, so the UI never leaks which emails are registered.
  return { sent: true };
}

export async function resetPassword(token: string, newPassword: string): Promise<{ success: boolean }> {
  if (!USE_MOCK) {
    return apiClient.post<{ success: boolean }>("/auth/reset-password", { token, newPassword });
  }
  await mockDelay();
  return { success: true };
}
