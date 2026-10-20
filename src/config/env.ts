/**
 * Configurações lidas do .env.local (veja .env.example).
 * Mesmo formato do src/config/env.ts do app do cliente.
 */
export const ENV = {
  /** "mock" (dados de exemplo) ou "database" (Supabase) */
  dataSource: (process.env.NEXT_PUBLIC_API_MODE === 'database' ? 'database' : 'mock') as
    'mock' | 'database',
  /** true faz o modo mock devolver erro, para testar as telas de erro */
  simulateMockError: process.env.NEXT_PUBLIC_MOCK_ERROR === 'true',
};
