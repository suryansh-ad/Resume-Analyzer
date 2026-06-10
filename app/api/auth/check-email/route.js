import { supabaseAdmin } from "../../../../server/src/lib/supabase.js";

export const runtime = "nodejs";

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

export async function POST(request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);

    if (!email) {
      return Response.json({ message: "Email is required." }, { status: 400 });
    }

    if (!EMAIL_PATTERN.test(email)) {
      return Response.json({ message: "Enter a valid email address." }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return Response.json(
        {
          code: "ACCOUNT_LOOKUP_NOT_CONFIGURED",
          message: "Password reset lookup is not configured. Add SUPABASE_SERVICE_ROLE_KEY on the server and restart it.",
        },
        { status: 503 }
      );
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
          return Response.json({ message: "Account not found. Please sign up first." }, { status: 404 });
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
      return Response.json({ message: "Account not found. Please sign up first." }, { status: 404 });
    }

    return Response.json({ exists: true });
  } catch (error) {
    return Response.json({ message: error.message || "Something went wrong." }, { status: error.status || 500 });
  }
}
