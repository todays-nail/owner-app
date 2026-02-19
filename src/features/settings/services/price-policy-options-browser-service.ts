import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type PricePolicyOptionType = "ADDON" | "QUANTITY" | "SELECT";

export interface PricePolicyOptionDto {
  id: string;
  shopId: string;
  type: PricePolicyOptionType;
  name: string;
  price: number | null;
  unitPrice: number | null;
  isActive: boolean;
  createdAt: string;
}

type OptionRow = {
  id: string;
  shop_id: string;
  type: string;
  name: string;
  price: number | null;
  unit_price: number | null;
  is_active: boolean;
  created_at: string;
};

function mapOptionType(rawType: string): PricePolicyOptionType | null {
  if (rawType === "ADDON" || rawType === "QUANTITY" || rawType === "SELECT") {
    return rawType;
  }

  return null;
}

function mapOptionRow(row: OptionRow): PricePolicyOptionDto | null {
  const type = mapOptionType(row.type);

  if (!type) {
    return null;
  }

  return {
    id: row.id,
    shopId: row.shop_id,
    type,
    name: row.name,
    price: row.price,
    unitPrice: row.unit_price,
    isActive: row.is_active,
    createdAt: row.created_at
  };
}

function requireSupabaseClient() {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return supabase;
}

export async function fetchPricePolicyOptions(shopId: string): Promise<PricePolicyOptionDto[]> {
  const supabase = requireSupabaseClient();

  const { data, error } = await supabase
    .from("options")
    .select("id,shop_id,type,name,price,unit_price,is_active,created_at")
    .eq("shop_id", shopId)
    .in("type", ["ADDON", "QUANTITY", "SELECT"])
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as OptionRow[])
    .map((row) => mapOptionRow(row))
    .filter((row): row is PricePolicyOptionDto => row !== null);
}

export async function createPricePolicyOption(
  shopId: string,
  payload: {
    type: PricePolicyOptionType;
    name: string;
    amount: number;
    isActive: boolean;
  }
): Promise<PricePolicyOptionDto> {
  const supabase = requireSupabaseClient();

  const insertPayload = {
    shop_id: shopId,
    type: payload.type,
    name: payload.name,
    price: payload.type === "ADDON" || payload.type === "SELECT" ? payload.amount : null,
    unit_price: payload.type === "QUANTITY" ? payload.amount : null,
    is_active: payload.isActive
  };

  const { data, error } = await supabase
    .from("options")
    .insert(insertPayload)
    .select("id,shop_id,type,name,price,unit_price,is_active,created_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const mapped = mapOptionRow(data as OptionRow);

  if (!mapped) {
    throw new Error("Invalid option type response");
  }

  return mapped;
}

export async function updatePricePolicyOption(
  shopId: string,
  optionId: string,
  patch: {
    type?: PricePolicyOptionType;
    name?: string;
    amount?: number;
    isActive?: boolean;
  }
): Promise<PricePolicyOptionDto> {
  const supabase = requireSupabaseClient();

  const updatePayload: {
    type?: PricePolicyOptionType;
    name?: string;
    is_active?: boolean;
    price?: number | null;
    unit_price?: number | null;
  } = {};

  if (patch.type !== undefined) {
    updatePayload.type = patch.type;
  }

  if (patch.name !== undefined) {
    updatePayload.name = patch.name;
  }

  if (patch.isActive !== undefined) {
    updatePayload.is_active = patch.isActive;
  }

  if (patch.amount !== undefined) {
    if (!patch.type) {
      throw new Error("type is required when amount is provided");
    }

    if (patch.type === "QUANTITY") {
      updatePayload.price = null;
      updatePayload.unit_price = patch.amount;
    } else {
      updatePayload.price = patch.amount;
      updatePayload.unit_price = null;
    }
  }

  const { data, error } = await supabase
    .from("options")
    .update(updatePayload)
    .eq("shop_id", shopId)
    .eq("id", optionId)
    .select("id,shop_id,type,name,price,unit_price,is_active,created_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const mapped = mapOptionRow(data as OptionRow);

  if (!mapped) {
    throw new Error("Invalid option type response");
  }

  return mapped;
}
