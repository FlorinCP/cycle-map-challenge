export const apiClient = {
  get: async <T>(url: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unknown error');
      throw new Error(`API Error: ${response.status} ${response.statusText}`, {
        cause: { status: response.status, body: errorBody },
      });
    }

    return response.json();
  },
};
