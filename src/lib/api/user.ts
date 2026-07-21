import type { User, Address, NotificationPreference } from "@/types/user";
import { apiClient, mockDelay, USE_MOCK } from "./client";

// In-memory mock store. Resets on full page reload since there's no backend yet;
// AuthContext calls seedMockUser() on login/register to populate it.
let mockUserStore: User | null = null;
let mockAddresses: Address[] = [];
let mockNotificationPrefs: NotificationPreference = {
  orderUpdates: true,
  promotions: false,
  newsletter: true,
};

/** Called by auth.ts after a successful login/register in mock mode. */
export function seedMockUser(user: User): void {
  mockUserStore = user;
  mockAddresses = user.addresses ?? [];
}

export function clearMockUser(): void {
  mockUserStore = null;
  mockAddresses = [];
}

export async function getCurrentUser(): Promise<User | null> {
  if (!USE_MOCK) {
    return apiClient.get<User>("/user/me");
  }
  await mockDelay();
  return mockUserStore;
}

export async function updateProfile(
  updates: Partial<Pick<User, "firstName" | "lastName" | "phone" | "avatarUrl">>
): Promise<User> {
  if (!USE_MOCK) {
    return apiClient.patch<User>("/user/me", updates);
  }
  await mockDelay();
  if (!mockUserStore) throw new Error("No user is currently signed in.");
  mockUserStore = { ...mockUserStore, ...updates };
  return mockUserStore;
}

export async function getAddresses(): Promise<Address[]> {
  if (!USE_MOCK) {
    return apiClient.get<Address[]>("/user/addresses");
  }
  await mockDelay();
  return mockAddresses;
}

export async function addAddress(address: Omit<Address, "id">): Promise<Address> {
  if (!USE_MOCK) {
    return apiClient.post<Address>("/user/addresses", address);
  }
  await mockDelay();
  const newAddress: Address = { ...address, id: `addr-${Date.now()}` };
  mockAddresses = address.isDefault
    ? [...mockAddresses.map((a) => ({ ...a, isDefault: false })), newAddress]
    : [...mockAddresses, newAddress];
  return newAddress;
}

export async function updateAddress(id: string, updates: Partial<Address>): Promise<Address> {
  if (!USE_MOCK) {
    return apiClient.patch<Address>(`/user/addresses/${id}`, updates);
  }
  await mockDelay();
  let updated: Address | undefined;
  mockAddresses = mockAddresses.map((a) => {
    if (a.id !== id) return updates.isDefault ? { ...a, isDefault: false } : a;
    updated = { ...a, ...updates };
    return updated;
  });
  if (!updated) throw new Error(`Address ${id} not found.`);
  return updated;
}

export async function deleteAddress(id: string): Promise<void> {
  if (!USE_MOCK) {
    await apiClient.delete<void>(`/user/addresses/${id}`);
    return;
  }
  await mockDelay();
  mockAddresses = mockAddresses.filter((a) => a.id !== id);
}

export async function getNotificationPreferences(): Promise<NotificationPreference> {
  if (!USE_MOCK) {
    return apiClient.get<NotificationPreference>("/user/notifications");
  }
  await mockDelay();
  return mockNotificationPrefs;
}

export async function updateNotificationPreferences(
  updates: Partial<NotificationPreference>
): Promise<NotificationPreference> {
  if (!USE_MOCK) {
    return apiClient.patch<NotificationPreference>("/user/notifications", updates);
  }
  await mockDelay();
  mockNotificationPrefs = { ...mockNotificationPrefs, ...updates };
  return mockNotificationPrefs;
}