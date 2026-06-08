import express from "express";
import { supabaseAdmin } from "../lib/supabase.js";

const router = express.Router();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

async function findUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  const perPage = 1000;
  let page = 1;

  while (page <= 10) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw error;
    }

    const users = data?.users || [];
    const matchedUser = users.find((user) => user.email?.toLowerCase() === normalizedEmail);

    if (matchedUser) {
      return matchedUser;
    }

    if (users.length < perPage) {
      return null;
    }

    page += 1;
  }

  return null;
}

router.post("/check-email", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      res.status(400).json({ message: "Email is required." });
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      res.status(400).json({ message: "Enter a valid email address." });
      return;
    }

    if (!supabaseAdmin) {
      res.status(503).json({
        code: "ACCOUNT_LOOKUP_NOT_CONFIGURED",
        message: "Password reset lookup is not configured. Add SUPABASE_SERVICE_ROLE_KEY on the server and restart it.",
      });
      return;
    }

    let user = null;

    try {
      const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email,
      });

      if (error) {
        const notFound = /not found|does not exist|unable to find|no user/i.test(error.message);

        if (notFound) {
          res.status(404).json({ message: "Account not found. Please sign up first." });
          return;
        }

        throw error;
      }

      user = data?.user || null;
    } catch (generateLinkError) {
      if (!/not found|does not exist|unable to find|no user/i.test(generateLinkError.message || "")) {
        user = await findUserByEmail(email);
      }
    }

    if (!user) {
      res.status(404).json({ message: "Account not found. Please sign up first." });
      return;
    }

    res.json({ exists: true });
  } catch (error) {
    next(error);
  }
});

export default router;
