const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey);
export const googleAuthEnabled = supabaseEnabled;

export function getSupabaseEnv() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("SUPABASE_ENV_MISSING");
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
}
