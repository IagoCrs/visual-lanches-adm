/**
 * Confere se o painel consegue falar com o Supabase.
 * Uso: npm run supabase:check
 *
 * Lê as chaves do .env.local e chama o endereço de saúde do projeto.
 * Não lê nem cria nenhuma tabela.
 */
import { existsSync, readFileSync } from 'node:fs';

const envFile = '.env.local';
if (!existsSync(envFile)) {
  console.error(
    '✗ Não achei o .env.local. Copie o .env.example para .env.local e preencha as chaves.'
  );
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(envFile, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith('#') && line.includes('='))
    .map((line) => {
      const index = line.indexOf('=');
      return [
        line.slice(0, index).trim(),
        line
          .slice(index + 1)
          .trim()
          .replace(/^["']|["']$/g, ''),
      ];
    })
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error(
    '✗ Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY no .env.local.'
  );
  process.exit(1);
}
if (key.startsWith('sb_secret_')) {
  console.error('✗ Essa é a chave SECRETA. Use a chave publishable (sb_publishable_...).');
  process.exit(1);
}

try {
  const response = await fetch(`${url.replace(/\/$/, '')}/auth/v1/health`, {
    headers: { apikey: key },
  });
  if (response.ok) {
    console.log(`✓ Supabase conectado: ${url}`);
    console.log(`  Modo atual do painel: ${env.NEXT_PUBLIC_API_MODE || 'mock'}`);
  } else {
    console.error(
      `✗ O Supabase respondeu com erro ${response.status}. Confira a chave publishable.`
    );
    process.exit(1);
  }
} catch {
  console.error('✗ Não consegui falar com o Supabase. Confira a URL e a internet.');
  process.exit(1);
}
