import { z } from 'zod';
import { insertDreamSchema, dreams, analyses } from './schema';

export const api = {
  dreams: {
    list: {
      method: 'GET' as const,
      path: '/api/dreams',
      responses: {
        200: z.array(z.custom<typeof dreams.$inferSelect & { analysis?: typeof analyses.$inferSelect | null }>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/dreams/:id',
      responses: {
        200: z.custom<typeof dreams.$inferSelect & { analysis?: typeof analyses.$inferSelect | null }>(),
        404: z.object({ message: z.string() }),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/dreams',
      input: insertDreamSchema,
      responses: {
        201: z.custom<typeof dreams.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/dreams/:id',
      input: insertDreamSchema.partial(),
      responses: {
        200: z.custom<typeof dreams.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/dreams/:id',
      responses: {
        204: z.void(),
        404: z.object({ message: z.string() }),
      },
    },
    analyze: {
      method: 'POST' as const,
      path: '/api/dreams/:id/analyze',
      responses: {
        200: z.custom<typeof analyses.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    search: {
      method: 'GET' as const,
      path: '/api/dreams/search',
      input: z.object({ q: z.string() }),
      responses: {
        200: z.array(z.custom<typeof dreams.$inferSelect & { similarity: number }>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
