import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";
import { config } from "../config.js";

const nodeSupabaseOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    transport: WebSocket,
  },
};

export const supabase = createClient(
  config.supabaseUrl,
  config.supabasePublishableKey,
  nodeSupabaseOptions,
);

export const supabaseAdmin = config.supabaseServiceRoleKey
  ? createClient(config.supabaseUrl, config.supabaseServiceRoleKey, nodeSupabaseOptions)
  : null;
