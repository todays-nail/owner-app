import { createClient } from "@supabase/supabase-js";

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function safeHost(url) {
  try {
    return new URL(url).host;
  } catch {
    return "(invalid url)";
  }
}

function lower(s) {
  return (s || "").toLowerCase();
}

async function findUserByEmail(admin, email) {
  const target = lower(email);
  const perPage = 1000;
  for (let page = 1; page <= 200; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data?.users || [];
    const hit = users.find((u) => lower(u.email) === target);
    if (hit) return hit;
    if (users.length < perPage) return null;
  }
  return null;
}

async function ensureUser(admin, { email, password }) {
  const existing = await findUserByEmail(admin, email);
  if (!existing) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    if (error) throw error;
    if (!data?.user?.id) throw new Error(`createUser succeeded but user.id missing for ${email}`);
    return { id: data.user.id, action: "created" };
  }

  const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true
  });
  if (error) throw error;
  if (!data?.user?.id) throw new Error(`updateUser succeeded but user.id missing for ${email}`);
  return { id: data.user.id, action: "updated" };
}

async function upsertVerification(admin, { userId, status, shopName }) {
  const now = new Date().toISOString();
  const { error } = await admin.from("owner_verifications").upsert(
    {
      user_id: userId,
      status,
      shop_name: shopName,
      submitted_at: now,
      rejected_reason: null
    },
    { onConflict: "user_id" }
  );
  if (error) throw error;
}

async function main() {
  if (!process.argv.includes("--yes")) {
    console.error("Refusing to run without --yes.");
    process.exit(1);
  }

  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const password = process.env.DEV_OWNER_PASSWORD || "testtest";
  if (password.length < 8) {
    console.error("DEV_OWNER_PASSWORD must be at least 8 characters (policy 유지).");
    process.exit(1);
  }

  const emailBase = process.env.DEV_OWNER_EMAIL || "owner@example.com";
  const emailPending = process.env.DEV_OWNER_PENDING_EMAIL || "owner-pending@example.com";
  const emailApproved = process.env.DEV_OWNER_APPROVED_EMAIL || "owner-approved@example.com";

  console.log(`Seeding dev users into: ${safeHost(supabaseUrl)}`);

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const base = await ensureUser(admin, { email: emailBase, password });
  console.log(`[${base.action}] ${emailBase}`);

  const pending = await ensureUser(admin, { email: emailPending, password });
  await upsertVerification(admin, {
    userId: pending.id,
    status: "PENDING",
    shopName: "데모(검토중)"
  });
  console.log(`[${pending.action}] ${emailPending} + verification=PENDING`);

  const approved = await ensureUser(admin, { email: emailApproved, password });
  await upsertVerification(admin, {
    userId: approved.id,
    status: "APPROVED",
    shopName: "데모(승인완료)"
  });
  console.log(`[${approved.action}] ${emailApproved} + verification=APPROVED`);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});

