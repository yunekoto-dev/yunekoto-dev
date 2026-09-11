export async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "User-Agent": "yunekoto-dev-profile/1.0",
      "Accept": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }

  return response.json() as Promise<T>;
}

export function safe<T>(label: string, fallback: T, fn: () => Promise<T>): Promise<T> {
  return fn().catch((error) => {
    console.warn(`[${label}]`, error instanceof Error ? error.message : error);
    return fallback;
  });
}
