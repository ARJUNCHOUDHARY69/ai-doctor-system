import { readFileSync } from 'fs';
import { join } from 'path';

const URL_PLACEHOLDERS = ['your_project_ref', 'YOUR_PROJECT_REF'];
const KEY_PLACEHOLDERS = ['your_anon_key_here'];

function isPlaceholder(url: string | undefined, key: string | undefined): boolean {
  if (!url || !key) return true;
  if (URL_PLACEHOLDERS.some((p) => url.includes(p))) return true;
  if (KEY_PLACEHOLDERS.some((p) => key.includes(p))) return true;
  return false;
}

function loadEnvLocal(): { url: string; anonKey: string } | null {
  try {
    const path = join(process.cwd(), '.env.local');
    const content = readFileSync(path, 'utf-8');
    const env: Record<string, string> = {};
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq > 0) {
        const k = trimmed.slice(0, eq).trim();
        const v = trimmed.slice(eq + 1).trim();
        if (v.startsWith('"') && v.endsWith('"')) env[k] = v.slice(1, -1);
        else env[k] = v;
      }
    }
    const url = env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && anonKey && !isPlaceholder(url, anonKey)) return { url, anonKey };
  } catch {
    // .env.local not found or unreadable
  }
  return null;
}

export function getSupabaseEnv(): { url: string; anonKey: string } {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isPlaceholder(url, anonKey)) {
    const loaded = loadEnvLocal();
    if (loaded) {
      url = loaded.url;
      anonKey = loaded.anonKey;
    }
  }

  if (!url || !anonKey || isPlaceholder(url, anonKey)) {
    throw new Error(
      "Supabase URL and anon key are missing or still placeholders. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, then restart the dev server."
    );
  }

  return { url, anonKey };
}
