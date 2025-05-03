export const networkQueryKeys = {
  all: ['networks'] as const,
  detail: (id: string) => ['networks', 'detail', id] as const,
};
