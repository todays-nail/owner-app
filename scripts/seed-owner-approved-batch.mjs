import { createClient } from "@supabase/supabase-js";

const TARGET_DOMAIN = "example.com";
const APPROVED_TARGET_COUNT = 5;

const NAME_POOL = ["김민지", "이준호", "박서연", "최지훈", "정유진", "오세린", "문하늘"];
const FIXED_APPROVED_NAMES = {
  owner1: "김대환",
  owner2: "한수연"
};
const LEGACY_DEFAULT_NAMES = {
  "owner@example.com": "김민지",
  "owner-pending@example.com": "이준호",
  "owner-approved@example.com": "박서연"
};

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

function safeHost(url) {
  try {
    return new URL(url).host;
  } catch {
    return "(invalid url)";
  }
}

function lower(value) {
  return String(value || "").toLowerCase();
}

function normalizeNullableString(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickUnusedName(usedNames, randomQueue, fallback) {
  for (let i = 0; i < randomQueue.length; i += 1) {
    const candidate = randomQueue[i];
    if (!usedNames.has(candidate)) {
      usedNames.add(candidate);
      randomQueue.splice(i, 1);
      return candidate;
    }
  }
  usedNames.add(fallback);
  return fallback;
}

function buildApprovedTargets() {
  return Array.from({ length: APPROVED_TARGET_COUNT }, (_, idx) => {
    const index = idx + 1;
    const key = `owner${index}`;
    return {
      mode: "approved",
      index,
      key,
      email: `${key}@${TARGET_DOMAIN}`,
      shopName: `테스트샵 ${key}`,
      businessNumber: `123-45-${String(67890 + index).padStart(5, "0")}`,
      contactPhone: `010-1234-${String(1000 + index).padStart(4, "0")}`
    };
  });
}

function buildLegacyTargets() {
  return Object.keys(LEGACY_DEFAULT_NAMES).map((email, idx) => ({
    mode: "legacy",
    index: 100 + idx + 1,
    key: `legacy-${idx + 1}`,
    email
  }));
}

async function listAllUsers(admin) {
  const all = [];
  const perPage = 1000;
  for (let page = 1; page <= 200; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data?.users || [];
    all.push(...users);
    if (users.length < perPage) break;
  }
  return all;
}

async function fetchOwnerVerifications(admin, userIds) {
  if (!userIds.length) return [];
  const { data, error } = await admin
    .from("owner_verifications")
    .select("user_id,status,owner_name,shop_name,contact_phone,business_number,rejected_reason")
    .in("user_id", userIds);
  if (error) throw error;
  return data || [];
}

function verificationChanged(existingRow, payload) {
  if (!existingRow) return true;
  return !(
    existingRow.status === payload.status &&
    normalizeNullableString(existingRow.owner_name) === normalizeNullableString(payload.owner_name) &&
    normalizeNullableString(existingRow.shop_name) === normalizeNullableString(payload.shop_name) &&
    normalizeNullableString(existingRow.contact_phone) ===
      normalizeNullableString(payload.contact_phone) &&
    normalizeNullableString(existingRow.business_number) ===
      normalizeNullableString(payload.business_number) &&
    normalizeNullableString(existingRow.rejected_reason) ===
      normalizeNullableString(payload.rejected_reason)
  );
}

function resolveDesiredNames({
  targets,
  existingByEmail,
  existingVerificationByUserId,
  randomQueue
}) {
  const usedNames = new Set();
  const assigned = new Map();

  for (const target of targets) {
    const emailKey = lower(target.email);
    const existingUser = existingByEmail.get(emailKey);
    const existingContactName = normalizeNullableString(existingUser?.user_metadata?.contact_name);
    if (existingContactName) {
      usedNames.add(existingContactName);
      assigned.set(emailKey, existingContactName);
      continue;
    }

    const existingVerification = existingUser
      ? existingVerificationByUserId.get(existingUser.id)
      : undefined;
    const existingOwnerName = normalizeNullableString(existingVerification?.owner_name);
    if (existingOwnerName) {
      usedNames.add(existingOwnerName);
      assigned.set(emailKey, existingOwnerName);
      continue;
    }

    if (target.mode === "approved" && FIXED_APPROVED_NAMES[target.key]) {
      const fixed = FIXED_APPROVED_NAMES[target.key];
      usedNames.add(fixed);
      assigned.set(emailKey, fixed);
      continue;
    }

    if (target.mode === "legacy" && LEGACY_DEFAULT_NAMES[target.email]) {
      const fixed = LEGACY_DEFAULT_NAMES[target.email];
      usedNames.add(fixed);
      assigned.set(emailKey, fixed);
      continue;
    }

    const picked = pickUnusedName(usedNames, randomQueue, `테스터${target.index}`);
    assigned.set(emailKey, picked);
  }

  return assigned;
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
    console.error("DEV_OWNER_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  const approvedTargets = buildApprovedTargets();
  const legacyTargets = buildLegacyTargets();
  const allTargets = [...approvedTargets, ...legacyTargets];

  console.log(`Seeding owner users into: ${safeHost(supabaseUrl)}`);

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const allUsers = await listAllUsers(admin);
  const existingByEmail = new Map(
    allUsers
      .filter((u) => allTargets.some((t) => lower(t.email) === lower(u.email)))
      .map((u) => [lower(u.email), u])
  );

  const existingUserIds = [...existingByEmail.values()].map((u) => u.id);
  const existingVerifications = await fetchOwnerVerifications(admin, existingUserIds);
  const existingVerificationByUserId = new Map(existingVerifications.map((v) => [v.user_id, v]));

  const desiredNameByEmail = resolveDesiredNames({
    targets: allTargets,
    existingByEmail,
    existingVerificationByUserId,
    randomQueue: shuffle(NAME_POOL)
  });

  const userCounts = { created: 0, updated: 0, kept: 0, skipped: 0 };
  const processedUsers = [];
  const skippedLegacyUsers = [];

  for (const target of allTargets) {
    const emailKey = lower(target.email);
    const desiredName = desiredNameByEmail.get(emailKey);
    if (!desiredName) {
      throw new Error(`Failed to assign name for ${target.email}`);
    }

    const existing = existingByEmail.get(emailKey);

    if (!existing && target.mode === "legacy") {
      userCounts.skipped += 1;
      skippedLegacyUsers.push(target.email);
      continue;
    }

    if (!existing && target.mode === "approved") {
      const { data, error } = await admin.auth.admin.createUser({
        email: target.email,
        password,
        email_confirm: true,
        user_metadata: { contact_name: desiredName }
      });
      if (error) throw error;
      if (!data?.user?.id) throw new Error(`createUser succeeded but user.id missing for ${target.email}`);

      userCounts.created += 1;
      processedUsers.push({
        ...target,
        userId: data.user.id,
        contactName: normalizeNullableString(data.user.user_metadata?.contact_name) || desiredName,
        emailConfirmed: Boolean(data.user.email_confirmed_at),
        userAction: "created"
      });
      continue;
    }

    const existingContactName = normalizeNullableString(existing.user_metadata?.contact_name);

    if (target.mode === "approved") {
      let updatePayload = { password, email_confirm: true };
      if (!existingContactName) {
        updatePayload = {
          ...updatePayload,
          user_metadata: {
            ...(existing.user_metadata || {}),
            contact_name: desiredName
          }
        };
      }

      const { data, error } = await admin.auth.admin.updateUserById(existing.id, updatePayload);
      if (error) throw error;
      if (!data?.user?.id) throw new Error(`updateUserById succeeded but user.id missing for ${target.email}`);

      userCounts.updated += 1;
      processedUsers.push({
        ...target,
        userId: data.user.id,
        contactName:
          normalizeNullableString(data.user.user_metadata?.contact_name) ||
          existingContactName ||
          desiredName,
        emailConfirmed: Boolean(data.user.email_confirmed_at),
        userAction: "updated"
      });
      continue;
    }

    if (existingContactName) {
      userCounts.kept += 1;
      processedUsers.push({
        ...target,
        userId: existing.id,
        contactName: existingContactName,
        emailConfirmed: Boolean(existing.email_confirmed_at),
        userAction: "kept"
      });
      continue;
    }

    const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
      user_metadata: {
        ...(existing.user_metadata || {}),
        contact_name: desiredName
      }
    });
    if (error) throw error;
    if (!data?.user?.id) throw new Error(`updateUserById succeeded but user.id missing for ${target.email}`);

    userCounts.updated += 1;
    processedUsers.push({
      ...target,
      userId: data.user.id,
      contactName: normalizeNullableString(data.user.user_metadata?.contact_name) || desiredName,
      emailConfirmed: Boolean(data.user.email_confirmed_at),
      userAction: "updated"
    });
  }

  const approvedUsers = processedUsers.filter((u) => u.mode === "approved");
  const legacyUsers = processedUsers.filter((u) => u.mode === "legacy");

  const approvedVerificationRows = await fetchOwnerVerifications(
    admin,
    approvedUsers.map((u) => u.userId)
  );
  const approvedVerificationByUserId = new Map(approvedVerificationRows.map((v) => [v.user_id, v]));

  const nowIso = new Date().toISOString();
  const approvedVerificationPayloads = approvedUsers.map((u) => ({
    user_id: u.userId,
    status: "APPROVED",
    owner_name: u.contactName,
    shop_name: u.shopName,
    business_number: u.businessNumber,
    contact_phone: u.contactPhone,
    submitted_at: nowIso,
    rejected_reason: null
  }));

  const approvedVerificationCounts = { created: 0, updated: 0, kept: 0 };
  for (const payload of approvedVerificationPayloads) {
    const existing = approvedVerificationByUserId.get(payload.user_id);
    if (!existing) {
      approvedVerificationCounts.created += 1;
      continue;
    }
    if (verificationChanged(existing, payload)) {
      approvedVerificationCounts.updated += 1;
    } else {
      approvedVerificationCounts.kept += 1;
    }
  }

  const { error: approvedUpsertError } = await admin
    .from("owner_verifications")
    .upsert(approvedVerificationPayloads, { onConflict: "user_id" });
  if (approvedUpsertError) throw approvedUpsertError;

  const legacyVerificationRows = await fetchOwnerVerifications(
    admin,
    legacyUsers.map((u) => u.userId)
  );
  const legacyVerificationByUserId = new Map(legacyVerificationRows.map((v) => [v.user_id, v]));
  const legacyVerificationCounts = { updated: 0, kept: 0, skipped_no_row: 0 };

  for (const user of legacyUsers) {
    const existing = legacyVerificationByUserId.get(user.userId);
    if (!existing) {
      legacyVerificationCounts.skipped_no_row += 1;
      continue;
    }

    if (normalizeNullableString(existing.owner_name) === normalizeNullableString(user.contactName)) {
      legacyVerificationCounts.kept += 1;
      continue;
    }

    const { error } = await admin
      .from("owner_verifications")
      .update({ owner_name: user.contactName })
      .eq("user_id", user.userId);
    if (error) throw error;
    legacyVerificationCounts.updated += 1;
  }

  const finalVerifications = await fetchOwnerVerifications(
    admin,
    processedUsers.map((u) => u.userId)
  );
  const finalVerificationByUserId = new Map(finalVerifications.map((v) => [v.user_id, v]));

  const summary = processedUsers
    .sort((a, b) => a.index - b.index)
    .map((u) => {
      const finalVerification = finalVerificationByUserId.get(u.userId);
      return {
        scope: u.mode,
        email: u.email,
        user_id: u.userId,
        contact_name: u.contactName,
        owner_name: normalizeNullableString(finalVerification?.owner_name),
        status: finalVerification?.status || null,
        shop_name: normalizeNullableString(finalVerification?.shop_name),
        user_action: u.userAction,
        email_confirmed: u.emailConfirmed
      };
    });

  const report = {
    target_domain: TARGET_DOMAIN,
    totals: {
      approved_targets: approvedTargets.length,
      legacy_targets: legacyTargets.length,
      users: userCounts,
      approved_owner_verifications: approvedVerificationCounts,
      legacy_owner_name_updates: legacyVerificationCounts
    },
    skipped_legacy_users: skippedLegacyUsers,
    users: summary
  };

  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
