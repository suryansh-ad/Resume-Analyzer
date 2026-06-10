import { supabase } from "../../server/src/lib/supabase.js";

export async function getAuthenticatedUser(request) {
  const authorization = request.headers.get("authorization") || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return {
      user: null,
      response: Response.json({ message: "Authentication is required." }, { status: 401 }),
    };
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return {
      user: null,
      response: Response.json({ message: "Invalid or expired session." }, { status: 401 }),
    };
  }

  return { user: data.user, response: null };
}
