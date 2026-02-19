"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from "react";

import {
  createPricePolicyOption,
  fetchPricePolicyOptions,
  updatePricePolicyOption,
  type PricePolicyOptionDto,
  type PricePolicyOptionType
} from "@/features/settings/services/price-policy-options-browser-service";
import { cn } from "@/lib/utils";

type TemplateKey =
  | "BASE_GEL"
  | "REMOVAL"
  | "HAND_CARE"
  | "SELF_REMOVAL"
  | "EXTENSION_PER"
  | "EXTENSION_FULL"
  | "ART_UNIT"
  | "CUSTOM";

type PricePolicyTemplate = {
  key: TemplateKey;
  label: string;
  type: PricePolicyOptionType;
  name: string;
};

type LocalOptionRow = {
  id: string;
  type: PricePolicyOptionType;
  name: string;
  description: string;
  amountInput: string;
  isActive: boolean;
  isPendingCreate: boolean;
};

type OriginalOptionState = {
  id: string;
  type: PricePolicyOptionType;
  name: string;
  amount: number;
  isActive: boolean;
};

type DirtyPatch = {
  type?: PricePolicyOptionType;
  isActive?: boolean;
  amount?: number;
};

type PendingCreateRow = {
  tempId: string;
  type: PricePolicyOptionType;
  name: string;
  description: string;
  amount: number;
  isActive: boolean;
};

type SaveResult = {
  ok: boolean;
  errorMessage?: string;
};

export interface PricePolicyEditorHandle {
  validateBeforeSave: () => string | null;
  saveChanges: () => Promise<SaveResult>;
}

const PRICE_POLICY_TEMPLATES: ReadonlyArray<PricePolicyTemplate> = [
  {
    key: "BASE_GEL",
    label: "기본 젤",
    type: "ADDON",
    name: "기본 젤"
  },
  {
    key: "REMOVAL",
    label: "타샵 제거",
    type: "ADDON",
    name: "타샵 제거"
  },
  {
    key: "HAND_CARE",
    label: "손 기본 케어",
    type: "ADDON",
    name: "손 기본 케어"
  },
  {
    key: "SELF_REMOVAL",
    label: "자샵 제거",
    type: "ADDON",
    name: "자샵 제거"
  },
  {
    key: "EXTENSION_PER",
    label: "연장 개당",
    type: "QUANTITY",
    name: "연장"
  },
  {
    key: "EXTENSION_FULL",
    label: "연장 전체",
    type: "ADDON",
    name: "연장 전체"
  },
  {
    key: "ART_UNIT",
    label: "아트 추가 단위",
    type: "QUANTITY",
    name: "아트 추가"
  },
  {
    key: "CUSTOM",
    label: "직접 추가",
    type: "ADDON",
    name: ""
  }
];

const OPTION_TYPE_LABEL: Record<PricePolicyOptionType, string> = {
  ADDON: "전체",
  QUANTITY: "개당",
  SELECT: "선택형"
};

const TYPE_LOCKED_TO_ADDON_ITEM_NAMES = new Set([
  "기본젤",
  "타샵제거",
  "손기본케어",
  "자샵제거"
]);

const MAX_DESCRIPTION_LENGTH = 120;

function isUuidLike(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function normalizeItemName(value: string) {
  return value.replace(/\s+/g, "").toLowerCase();
}

function isTypeLockedToAddon(itemName: string) {
  return TYPE_LOCKED_TO_ADDON_ITEM_NAMES.has(normalizeItemName(itemName));
}

function formatNumberWithCommas(value: number) {
  return value.toLocaleString("ko-KR");
}

function normalizeNumberInput(value: string) {
  const digits = value.replace(/[^0-9]/g, "");
  if (digits.length === 0) {
    return "";
  }

  return formatNumberWithCommas(Number(digits));
}

function parseAmountInput(value: string) {
  const digits = value.replace(/[^0-9]/g, "");
  if (digits.length === 0) {
    return null;
  }

  const parsed = Number(digits);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

function getAmountFromDto(option: Pick<PricePolicyOptionDto, "type" | "price" | "unitPrice">) {
  return option.type === "QUANTITY" ? option.unitPrice ?? 0 : option.price ?? 0;
}

function getUnitLabel(optionType: PricePolicyOptionType, optionName: string) {
  if (optionType !== "QUANTITY") {
    return "원";
  }

  if (optionName.includes("연장")) {
    return "원/개";
  }

  return "원/단위";
}

function mapDtoToLocalOption(dto: PricePolicyOptionDto): LocalOptionRow {
  const normalizedType = isTypeLockedToAddon(dto.name) ? "ADDON" : dto.type;

  return {
    id: dto.id,
    type: normalizedType,
    name: dto.name,
    description: "",
    amountInput: formatNumberWithCommas(getAmountFromDto(dto)),
    isActive: dto.isActive,
    isPendingCreate: false
  };
}

function mapDtoToOriginalOption(dto: PricePolicyOptionDto): OriginalOptionState {
  return {
    id: dto.id,
    type: dto.type,
    name: dto.name,
    amount: getAmountFromDto(dto),
    isActive: dto.isActive
  };
}

function buildTemplateDefault(templateKey: TemplateKey) {
  const template = PRICE_POLICY_TEMPLATES.find((item) => item.key === templateKey);

  if (!template) {
    return {
      templateKey: "BASE_GEL" as TemplateKey,
      type: "ADDON" as PricePolicyOptionType,
      name: "기본 젤",
      amountInput: "",
      description: ""
    };
  }

  return {
    templateKey: template.key,
    type: isTypeLockedToAddon(template.name) ? "ADDON" : template.type,
    name: template.name,
    amountInput: "",
    description: ""
  };
}

export const PricePolicyEditor = forwardRef<
  PricePolicyEditorHandle,
  {
    shopId: string;
    disabled?: boolean;
    onRequestSave?: () => void;
  }
>(function PricePolicyEditor({ shopId, disabled = false, onRequestSave }, ref) {
  const useRemoteStore = isUuidLike(shopId);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [options, setOptions] = useState<LocalOptionRow[]>([]);
  const [originalById, setOriginalById] = useState<Record<string, OriginalOptionState>>({});
  const [dirtyMap, setDirtyMap] = useState<Record<string, DirtyPatch>>({});
  const [pendingCreates, setPendingCreates] = useState<PendingCreateRow[]>([]);
  const [localDescriptionDirtyIds, setLocalDescriptionDirtyIds] = useState<string[]>([]);

  const [showInactive, setShowInactive] = useState(false);

  const [addTemplateKey, setAddTemplateKey] = useState<TemplateKey>("BASE_GEL");
  const [addType, setAddType] = useState<PricePolicyOptionType>("ADDON");
  const [addName, setAddName] = useState("기본 젤");
  const [addAmountInput, setAddAmountInput] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [addErrorMessage, setAddErrorMessage] = useState<string | null>(null);

  const [rowErrorMessage, setRowErrorMessage] = useState<string | null>(null);

  const activeOptions = useMemo(() => options.filter((option) => option.isActive), [options]);
  const inactiveOptions = useMemo(() => options.filter((option) => !option.isActive), [options]);

  useEffect(() => {
    let cancelled = false;

    const fetchOptions = async () => {
      if (!useRemoteStore) {
        setOptions([]);
        setOriginalById({});
        setDirtyMap({});
        setPendingCreates([]);
        setLocalDescriptionDirtyIds([]);
        setLoadError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const fetchedOptions = await fetchPricePolicyOptions(shopId);
        if (cancelled) {
          return;
        }

        const mappedOptions = fetchedOptions.map((option) => mapDtoToLocalOption(option));
        const nextOriginalById = fetchedOptions.reduce<Record<string, OriginalOptionState>>((acc, option) => {
          acc[option.id] = mapDtoToOriginalOption(option);
          return acc;
        }, {});

        setOptions(mappedOptions);
        setOriginalById(nextOriginalById);
        setDirtyMap({});
        setPendingCreates([]);
        setLocalDescriptionDirtyIds([]);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setLoadError(error instanceof Error ? error.message : "가격 정책을 불러오지 못했습니다.");
        setOptions([]);
        setOriginalById({});
        setDirtyMap({});
        setPendingCreates([]);
        setLocalDescriptionDirtyIds([]);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchOptions();

    return () => {
      cancelled = true;
    };
  }, [shopId, useRemoteStore]);

  const hasActiveDuplicate = (
    name: string,
    type: PricePolicyOptionType,
    excludeId?: string
  ) => {
    const normalizedName = name.trim().toLowerCase();

    return activeOptions.some(
      (option) =>
        option.id !== excludeId &&
        option.type === type &&
        option.name.trim().toLowerCase() === normalizedName
    );
  };

  const hasInactiveDuplicate = (name: string, type: PricePolicyOptionType) => {
    const normalizedName = name.trim().toLowerCase();

    return inactiveOptions.some(
      (option) => option.type === type && option.name.trim().toLowerCase() === normalizedName
    );
  };

  const markDescriptionDirty = (optionId: string) => {
    setLocalDescriptionDirtyIds((prev) => {
      if (prev.includes(optionId)) {
        return prev;
      }

      return [...prev, optionId];
    });
  };

  const focusOptionDescription = (optionId: string) => {
    const target = document.getElementById(`price-option-description-${optionId}`) as HTMLInputElement | null;
    target?.focus();
  };

  const applyDirtyPatchFromRow = (row: LocalOptionRow) => {
    if (row.isPendingCreate) {
      return;
    }

    const original = originalById[row.id];
    if (!original) {
      return;
    }

    const amount = parseAmountInput(row.amountInput);
    const nextPatch: DirtyPatch = {};

    if (row.isActive !== original.isActive) {
      nextPatch.isActive = row.isActive;
    }

    if (row.type !== original.type) {
      nextPatch.type = row.type;
      if (amount !== null) {
        nextPatch.amount = amount;
      }
    } else if (amount !== null && amount !== original.amount) {
      nextPatch.type = row.type;
      nextPatch.amount = amount;
    }

    setDirtyMap((prev) => {
      const hasPatch = Object.keys(nextPatch).length > 0;

      if (!hasPatch) {
        if (!(row.id in prev)) {
          return prev;
        }

        const rest = { ...prev };
        delete rest[row.id];
        return rest;
      }

      return {
        ...prev,
        [row.id]: nextPatch
      };
    });
  };

  const updateOptionRow = (optionId: string, updater: (row: LocalOptionRow) => LocalOptionRow) => {
    const current = options.find((option) => option.id === optionId);
    if (!current) {
      return;
    }

    const nextCandidate = updater(current);
    const next = isTypeLockedToAddon(nextCandidate.name)
      ? { ...nextCandidate, type: "ADDON" as PricePolicyOptionType }
      : nextCandidate;

    setOptions((prev) => prev.map((option) => (option.id === optionId ? next : option)));

    if (next.isPendingCreate) {
      const amount = parseAmountInput(next.amountInput) ?? 0;

      setPendingCreates((prev) =>
        prev.map((item) =>
          item.tempId === next.id
            ? {
                ...item,
                type: next.type,
                description: next.description,
                amount,
                isActive: next.isActive
              }
            : item
        )
      );
      return;
    }

    applyDirtyPatchFromRow(next);
  };

  const validateRows = useCallback(() => {
    for (const [index, row] of options.entries()) {
      const trimmedName = row.name.trim();
      if (trimmedName.length === 0) {
        return `${index + 1}번째 항목 이름이 비어 있습니다.`;
      }

      const amount = parseAmountInput(row.amountInput);
      if (amount === null) {
        return `${trimmedName} 항목의 금액은 0 이상의 정수로 입력해 주세요.`;
      }

      if (isTypeLockedToAddon(trimmedName) && row.type !== "ADDON") {
        return `${trimmedName} 항목은 타입이 전체로 고정됩니다.`;
      }

      if (row.description.length > MAX_DESCRIPTION_LENGTH) {
        return `${trimmedName} 항목 설명은 ${MAX_DESCRIPTION_LENGTH}자 이내로 입력해 주세요.`;
      }
    }

    return null;
  }, [options]);

  useImperativeHandle(
    ref,
    () => ({
      validateBeforeSave() {
        setRowErrorMessage(null);
        return validateRows();
      },
      async saveChanges() {
        setRowErrorMessage(null);

        const rowValidationError = validateRows();
        if (rowValidationError) {
          setRowErrorMessage(rowValidationError);
          return {
            ok: false,
            errorMessage: rowValidationError
          };
        }

        if (!useRemoteStore) {
          const nextOptions = options.map((row) =>
            row.isPendingCreate
              ? {
                  ...row,
                  id: `mock-option-${crypto.randomUUID()}`,
                  isPendingCreate: false
                }
              : row
          );

          const nextOriginalById = nextOptions.reduce<Record<string, OriginalOptionState>>((acc, option) => {
            const amount = parseAmountInput(option.amountInput) ?? 0;
            acc[option.id] = {
              id: option.id,
              type: option.type,
              name: option.name,
              amount,
              isActive: option.isActive
            };
            return acc;
          }, {});

          setOptions(nextOptions);
          setPendingCreates([]);
          setDirtyMap({});
          setOriginalById(nextOriginalById);
          setLocalDescriptionDirtyIds([]);

          return {
            ok: true
          };
        }

        const nextOptions = [...options];
        const nextOriginalById = { ...originalById };

        for (const pending of pendingCreates) {
          try {
            const created = await createPricePolicyOption(shopId, {
              type: pending.type,
              name: pending.name,
              amount: pending.amount,
              isActive: pending.isActive
            });

            const mapped = mapDtoToLocalOption(created);
            const targetIndex = nextOptions.findIndex((option) => option.id === pending.tempId);

            if (targetIndex >= 0) {
              nextOptions[targetIndex] = {
                ...mapped,
                description: pending.description
              };
            }

            nextOriginalById[created.id] = mapDtoToOriginalOption(created);
          } catch (error) {
            return {
              ok: false,
              errorMessage: `${pending.name} 생성에 실패했습니다. ${error instanceof Error ? error.message : ""}`
            };
          }
        }

        for (const [optionId, patch] of Object.entries(dirtyMap)) {
          const target = nextOptions.find((option) => option.id === optionId);

          if (!target) {
            continue;
          }

          try {
            const updated = await updatePricePolicyOption(shopId, optionId, {
              type: patch.type,
              amount: patch.amount,
              isActive: patch.isActive
            });

            const mapped = mapDtoToLocalOption(updated);
            const targetIndex = nextOptions.findIndex((option) => option.id === optionId);

            if (targetIndex >= 0) {
              nextOptions[targetIndex] = {
                ...mapped,
                description: target.description
              };
            }

            nextOriginalById[updated.id] = mapDtoToOriginalOption(updated);
          } catch (error) {
            return {
              ok: false,
              errorMessage: `${target.name} 저장에 실패했습니다. ${error instanceof Error ? error.message : ""}`
            };
          }
        }

        setOptions(nextOptions);
        setPendingCreates([]);
        setDirtyMap({});
        setOriginalById(nextOriginalById);
        setLocalDescriptionDirtyIds([]);

        return {
          ok: true
        };
      }
    }),
    [dirtyMap, options, originalById, pendingCreates, shopId, useRemoteStore, validateRows]
  );

  const resetAddForm = () => {
    const defaults = buildTemplateDefault("BASE_GEL");

    setAddTemplateKey(defaults.templateKey);
    setAddType(defaults.type);
    setAddName(defaults.name);
    setAddAmountInput(defaults.amountInput);
    setAddDescription(defaults.description);
    setAddErrorMessage(null);
  };

  const handleTemplateChange = (templateKey: TemplateKey) => {
    const defaults = buildTemplateDefault(templateKey);

    setAddTemplateKey(defaults.templateKey);
    setAddType(defaults.type);
    setAddName(defaults.name);
    setAddErrorMessage(null);
  };

  const handleAddOption = () => {
    setAddErrorMessage(null);

    const selectedTemplate = PRICE_POLICY_TEMPLATES.find((template) => template.key === addTemplateKey);

    if (!selectedTemplate) {
      setAddErrorMessage("항목을 선택해 주세요.");
      return;
    }

    const selectedName = addTemplateKey === "CUSTOM" ? addName.trim() : selectedTemplate.name;

    if (selectedName.length === 0) {
      setAddErrorMessage("직접 추가 항목명을 입력해 주세요.");
      return;
    }

    if (selectedName.length > 30) {
      setAddErrorMessage("항목명은 30자 이내로 입력해 주세요.");
      return;
    }

    const finalType = isTypeLockedToAddon(selectedName) ? "ADDON" : addType;

    if (hasActiveDuplicate(selectedName, finalType)) {
      setAddErrorMessage("이미 추가된 항목입니다.");
      return;
    }

    if (hasInactiveDuplicate(selectedName, finalType)) {
      setAddErrorMessage("숨긴 항목에 이미 있습니다. 숨긴 항목에서 다시 추가해 주세요.");
      return;
    }

    const parsedAmount = parseAmountInput(addAmountInput);
    if (parsedAmount === null) {
      setAddErrorMessage("금액은 0 이상의 정수로 입력해 주세요.");
      return;
    }

    if (addDescription.length > MAX_DESCRIPTION_LENGTH) {
      setAddErrorMessage(`설명은 ${MAX_DESCRIPTION_LENGTH}자 이내로 입력해 주세요.`);
      return;
    }

    const tempId = `temp-${crypto.randomUUID()}`;

    const nextRow: LocalOptionRow = {
      id: tempId,
      type: finalType,
      name: selectedName,
      description: addDescription.trim(),
      amountInput: formatNumberWithCommas(parsedAmount),
      isActive: true,
      isPendingCreate: true
    };

    setOptions((prev) => [...prev, nextRow]);
    setPendingCreates((prev) => [
      ...prev,
      {
        tempId,
        type: finalType,
        name: selectedName,
        description: addDescription.trim(),
        amount: parsedAmount,
        isActive: true
      }
    ]);

    resetAddForm();
  };

  const hasPendingChanges =
    pendingCreates.length > 0 ||
    Object.keys(dirtyMap).length > 0 ||
    localDescriptionDirtyIds.length > 0;

  const selectedTemplate = PRICE_POLICY_TEMPLATES.find((template) => template.key === addTemplateKey);
  const addTypeLockTargetName =
    addTemplateKey === "CUSTOM" ? addName.trim() : (selectedTemplate?.name ?? "");
  const addTypeLocked = isTypeLockedToAddon(addTypeLockTargetName);

  return (
    <section className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-surface-dark md:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <span className="material-icons-round" aria-hidden="true">
              payments
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800 dark:text-white">가격 정책</h2>
            <p className="text-sm text-stone-500">샵 운영 방식에 맞게 항목을 유연하게 관리하세요.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRequestSave}
          disabled={disabled}
          className="inline-flex items-center justify-center gap-2 self-end rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:self-start"
        >
          <span className="material-icons-round text-sm" aria-hidden="true">
            save
          </span>
          {disabled ? "저장 중..." : "변경사항 저장하기"}
        </button>
      </div>

      {loadError ? (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
          가격 정책 로딩에 실패했습니다. 저장 시 다시 시도됩니다. ({loadError})
        </div>
      ) : null}

      {rowErrorMessage ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          {rowErrorMessage}
        </div>
      ) : null}

      <div className="mb-6 rounded-xl border border-stone-200 bg-stone-50/80 p-4 dark:border-stone-700 dark:bg-stone-800/40">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-stone-500">항목</label>
            {addTemplateKey === "CUSTOM" ? (
              <input
                value={addName}
                onChange={(event) => setAddName(event.target.value)}
                placeholder="직접 추가"
                className="w-full rounded-lg border border-stone-200 bg-stone-100 px-3 py-2.5 text-sm text-stone-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-700/70 dark:text-stone-100"
              />
            ) : (
              <select
                value={addTemplateKey}
                onChange={(event) => handleTemplateChange(event.target.value as TemplateKey)}
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                {PRICE_POLICY_TEMPLATES.map((template) => (
                  <option key={template.key} value={template.key}>
                    {template.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-stone-500">타입</label>
            <select
              value={addTypeLocked ? "ADDON" : addType}
              onChange={(event) => setAddType(event.target.value as PricePolicyOptionType)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              <option value="ADDON">전체</option>
              {addTypeLocked ? null : (
                <>
                  <option value="QUANTITY">개당</option>
                  <option value="SELECT">선택형</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-stone-500">금액</label>
            <input
              value={addAmountInput}
              onChange={(event) => setAddAmountInput(normalizeNumberInput(event.target.value))}
              inputMode="numeric"
              placeholder="0"
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-right text-sm text-stone-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs font-semibold text-stone-500">설명 (선택)</label>
          <input
            value={addDescription}
            onChange={(event) => setAddDescription(event.target.value)}
            placeholder="예: 케어가 기본으로 포함된 금액입니다."
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
          />
          <p className="mt-1 text-xs text-stone-500">최대 {MAX_DESCRIPTION_LENGTH}자</p>
        </div>

        {addErrorMessage ? (
          <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-300">{addErrorMessage}</p>
        ) : null}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={resetAddForm}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-100 dark:border-stone-600 dark:text-stone-200 dark:hover:bg-stone-700"
          >
            초기화
          </button>
          <button
            type="button"
            onClick={handleAddOption}
            className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            추가
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="rounded-xl border border-dashed border-stone-300 px-4 py-5 text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
            가격 정책을 불러오는 중...
          </div>
        ) : activeOptions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-300 px-4 py-5 text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
            활성화된 가격 항목이 없습니다. 위 입력 박스에서 항목을 추가해 주세요.
          </div>
        ) : (
          activeOptions.map((option, index) => {
            const unitLabel = getUnitLabel(option.type, option.name);
            const typeLocked = isTypeLockedToAddon(option.name);

            return (
              <div
                key={option.id}
                className="relative grid grid-cols-1 gap-3 rounded-xl border border-stone-100 bg-stone-50/70 p-4 pt-7 dark:border-stone-800/50 dark:bg-stone-800/30 md:grid-cols-[1.2fr_140px_1fr_auto]"
              >
                <span className="absolute left-4 top-2 text-xs font-bold text-stone-700 dark:text-stone-200">
                  옵션 {index + 1}
                </span>
                <div>
                  <p className="mb-1 text-xs font-semibold text-stone-500">항목</p>
                  <p className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-800 dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-100">
                    {option.name}
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-stone-500">타입</label>
                  <select
                    value={option.type}
                    onChange={(event) =>
                      updateOptionRow(option.id, (row) => ({
                        ...row,
                        type: event.target.value as PricePolicyOptionType
                      }))
                    }
                    disabled={disabled}
                    className={cn(
                      "w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-70",
                      "border-stone-200 bg-white text-stone-800 dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-100"
                    )}
                  >
                    <option value="ADDON">전체</option>
                    {typeLocked ? null : (
                      <>
                        <option value="QUANTITY">개당</option>
                        <option value="SELECT">선택형</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-stone-500">금액 ({unitLabel})</label>
                  <input
                    value={option.amountInput}
                    onChange={(event) =>
                      updateOptionRow(option.id, (row) => ({
                        ...row,
                        amountInput: normalizeNumberInput(event.target.value)
                      }))
                    }
                    disabled={disabled}
                    inputMode="numeric"
                    className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-right text-sm text-stone-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70 dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-100"
                  />
                </div>

                <div className="flex items-end justify-end gap-2">
                  {option.isPendingCreate ? (
                    <button
                      type="button"
                      onClick={() => focusOptionDescription(option.id)}
                      disabled={disabled}
                      className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20 disabled:opacity-70"
                    >
                      수정
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => updateOptionRow(option.id, (row) => ({ ...row, isActive: false }))}
                    disabled={disabled}
                    className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-600 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
                  >
                    숨기기
                  </button>
                </div>

                <div className="md:col-span-4">
                  <label className="mb-1 block text-xs font-semibold text-stone-500">설명 (선택)</label>
                  <input
                    id={`price-option-description-${option.id}`}
                    value={option.description}
                    onChange={(event) => {
                      updateOptionRow(option.id, (row) => ({ ...row, description: event.target.value }));
                      markDescriptionDirty(option.id);
                    }}
                    placeholder="예: 글리터 추가금 없어요~"
                    disabled={disabled}
                    className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70 dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-200"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-5 border-t border-stone-100 pt-4 dark:border-stone-800/70">
        <button
          type="button"
          onClick={() => setShowInactive((prev) => !prev)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-stone-600 transition-colors hover:text-primary dark:text-stone-300"
        >
          <span className="material-icons-round text-base" aria-hidden="true">
            {showInactive ? "expand_less" : "expand_more"}
          </span>
          숨긴 항목 보기 ({inactiveOptions.length})
        </button>

        {showInactive ? (
          <div className="mt-3 space-y-2">
            {inactiveOptions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-stone-300 px-3 py-4 text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
                숨긴 항목이 없습니다.
              </div>
            ) : (
              inactiveOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between rounded-lg border border-stone-200 bg-stone-50 px-3 py-3 dark:border-stone-700 dark:bg-stone-800/30"
                >
                  <div>
                    <p className="text-sm font-semibold text-stone-700 dark:text-stone-200">{option.name}</p>
                    <p className="text-xs text-stone-500">
                      {OPTION_TYPE_LABEL[option.type]} · {option.amountInput.length > 0 ? option.amountInput : "0"}{" "}
                      {getUnitLabel(option.type, option.name)}
                    </p>
                    {option.description.trim().length > 0 ? (
                      <p className="mt-0.5 text-xs text-stone-500">{option.description}</p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => updateOptionRow(option.id, (row) => ({ ...row, isActive: true }))}
                    disabled={disabled}
                    className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-white"
                  >
                    다시 추가
                  </button>
                </div>
              ))
            )}
          </div>
        ) : null}
      </div>

      <div className="mt-4 text-xs text-stone-500 dark:text-stone-400">
        {hasPendingChanges
          ? "가격 정책에 저장되지 않은 변경사항이 있습니다. 상단의 변경사항 저장 버튼을 눌러 적용하세요."
          : "가격 정책 변경사항이 없습니다."}
      </div>
    </section>
  );
});
