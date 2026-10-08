/**
 * Conexão com o Supabase (task VS-05).
 *
 * Só a função central de API (src/services/api.ts) usa este arquivo.
 * Nenhuma tela deve importar daqui.
 *
 * O cliente só é criado quando alguém pede (modo "database"). Com a flag em
 * "mock", nada aqui roda e as chaves podem ficar vazias.
 */
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

let client: SupabaseClient | null = null;

/** true quando o .env.local tem a URL e a chave pública do projeto. */
export function isSupabaseConfigured() {
  return SUPABASE_URL !== '' && SUPABASE_PUBLISHABLE_KEY !== '';
}

/**
 * Devolve o cliente do Supabase, criando na primeira vez.
 * Devolve null se as chaves não estiverem no .env.local.
 */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  }
  return client;
}
