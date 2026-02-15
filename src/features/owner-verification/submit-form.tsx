"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type InitialValues = {
  status: "UNSUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";
  business_number: string;
  shop_name: string;
  owner_name: string;
  contact_phone: string;
  rejected_reason: string | null;
};

const LICENSE_BUCKET = "owner-licenses";

function safeFileExt(filename: string) {
  const lastDot = filename.lastIndexOf(".");
  const ext = lastDot >= 0 ? filename.slice(lastDot + 1) : "";
  const cleaned = ext.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned || "bin";
}

export function OwnerVerificationSubmitForm({ initial }: { initial: InitialValues }) {
  const router = useRouter();

  const [businessNumber, setBusinessNumber] = React.useState(initial.business_number);
  const [shopName, setShopName] = React.useState(initial.shop_name);
  const [ownerName, setOwnerName] = React.useState(initial.owner_name);
  const [contactPhone, setContactPhone] = React.useState(initial.contact_phone);
  const [licenseFile, setLicenseFile] = React.useState<File | null>(null);

  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md items-center px-4">
      <div className="w-full rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Business verification</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Submit business details to activate your owner account.
        </p>

        {initial.status === "REJECTED" && initial.rejected_reason ? (
          <div className="mt-4 rounded-md border border-border bg-muted px-3 py-2 text-sm">
            <div className="font-medium">Rejected</div>
            <div className="mt-1 text-muted-foreground">{initial.rejected_reason}</div>
          </div>
        ) : null}

        <form
          className="mt-6 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);

            if (!licenseFile) {
              setError("Business license image is required.");
              return;
            }

            setPending(true);
            try {
              const supabase = createSupabaseBrowserClient();
              if (!supabase) {
                setError(
                  "Missing env: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY"
                );
                return;
              }

              const {
                data: { user },
                error: userError
              } = await supabase.auth.getUser();

              if (userError || !user) {
                setError("Not authenticated. Please sign in again.");
                return;
              }

              const ext = safeFileExt(licenseFile.name);
              const path = `licenses/${user.id}/${crypto.randomUUID()}.${ext}`;

              const { error: uploadError } = await supabase.storage
                .from(LICENSE_BUCKET)
                .upload(path, licenseFile, { upsert: false });

              if (uploadError) {
                setError(uploadError.message);
                return;
              }

              const { error: upsertError } = await supabase.from("owner_verifications").upsert(
                {
                  user_id: user.id,
                  status: "PENDING",
                  business_number: businessNumber,
                  shop_name: shopName,
                  owner_name: ownerName,
                  contact_phone: contactPhone,
                  business_license_path: path,
                  rejected_reason: null,
                  submitted_at: new Date().toISOString()
                },
                { onConflict: "user_id" }
              );

              if (upsertError) {
                setError(upsertError.message);
                return;
              }

              router.refresh();
              router.push("/verification/pending");
            } finally {
              setPending(false);
            }
          }}
        >
          <div className="space-y-1">
            <label className="text-sm font-medium">Business number</label>
            <Input
              value={businessNumber}
              onChange={(e) => setBusinessNumber(e.target.value)}
              placeholder="000-00-00000"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Shop name</label>
            <Input
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="My Nail Shop"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Owner name</label>
            <Input
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="홍길동"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Contact phone</label>
            <Input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="010-0000-0000"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Business license image</label>
            <input
              className="block w-full rounded-md border border-border bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:text-foreground"
              type="file"
              accept="image/*"
              required
              onChange={(e) => setLicenseFile(e.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-muted-foreground">
              Uploaded to Supabase Storage (private). Only the object path is saved.
            </p>
          </div>

          {error ? (
            <div className="rounded-md border border-border bg-muted px-3 py-2 text-sm">
              {error}
            </div>
          ) : null}

          <Button className="w-full" disabled={pending} type="submit">
            {pending ? "Submitting..." : "Submit for review"}
          </Button>
        </form>
      </div>
    </div>
  );
}

