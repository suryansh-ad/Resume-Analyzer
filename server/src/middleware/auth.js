import { supabase } from "../lib/supabase.js";
export async function requireAuth(req, res, next) {
  try {
    const authorization = req.get("authorization") || "";
    const [scheme, token] = authorization.split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token) {
      res.status(401).json({ message: "Authentication is required." });
      return;
    }
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      res.status(401).json({ message: "Invalid or expired session." });
      return;
    }
    req.user = data.user;
    next();
  } catch (error){
    next(error);
  }
}
