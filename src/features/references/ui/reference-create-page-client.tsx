/* eslint-disable @next/next/no-img-element */
"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  findReferenceById,
  loadReferences,
  saveReferences,
  type ReferenceEntity
} from "@/features/references/model/reference-storage";
import {
  REFERENCE_CATEGORIES,
  type ReferenceCategory
} from "@/features/references/model/references";
import { cn } from "@/lib/utils";

const DESCRIPTION_MAX_LENGTH = 200;
const MAX_TAG_SELECTION = 3;

function createReferenceId() {
  return `reference-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("이미지 파일을 읽을 수 없습니다."));
    };

    reader.onerror = () => {
      reject(new Error("이미지 파일을 읽을 수 없습니다."));
    };

    reader.readAsDataURL(file);
  });
}

export function ReferenceCreatePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode");
  const editingId = searchParams.get("id");
  const isEditMode = mode === "edit" && editingId !== null;

  const [designName, setDesignName] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<ReferenceCategory>>(new Set());
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [badge, setBadge] = useState<ReferenceEntity["badge"]>(null);
  const [submitted, setSubmitted] = useState(false);

  const hasRepresentativeImage = imageUrls.length > 0;
  const hasDesignName = designName.trim().length > 0;
  const hasTags = selectedTags.size > 0;
  const hasPrice = price.trim().length > 0;
  const hasDescription = description.trim().length > 0;

  const canSubmit = hasRepresentativeImage && hasDesignName && hasTags && hasPrice && hasDescription;
  const shouldShowTagError = submitted && selectedTags.size === 0;

  useEffect(() => {
    if (!isEditMode || !editingId) {
      return;
    }

    const existing = findReferenceById(editingId);

    if (!existing) {
      window.alert("수정할 레퍼런스를 찾을 수 없습니다.");
      router.replace("/references");
      return;
    }

    setDesignName(existing.name);
    setSelectedTags(new Set(existing.categories));
    setPrice(String(existing.price));
    setDuration(existing.durationMinutes !== null ? String(existing.durationMinutes) : "");
    setDescription(existing.description);
    setImageUrls(existing.imageUrls.length > 0 ? existing.imageUrls : [existing.imageUrl]);
    setIsVisible(existing.isVisible);
    setBadge(existing.badge);
    setSubmitted(false);
  }, [editingId, isEditMode, router]);

  const thumbnailUrls = useMemo(() => imageUrls.slice(1), [imageUrls]);
  const representativeImage = imageUrls[0];

  const handleFilesSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    try {
      const newUrls = await Promise.all(files.map((file) => readFileAsDataUrl(file)));
      setImageUrls((prev) => [...prev, ...newUrls]);
    } catch {
      window.alert("이미지 업로드 중 오류가 발생했습니다.");
    }

    event.target.value = "";
  };

  const handleRemoveImage = (targetUrl: string) => {
    setImageUrls((prev) => prev.filter((url) => url !== targetUrl));
  };

  const handleToggleTag = (tag: ReferenceCategory) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        if (next.size >= MAX_TAG_SELECTION) {
          return prev;
        }
        next.add(tag);
      }
      return next;
    });
  };

  const handlePriceChange = (value: string) => {
    setPrice(value.replace(/\D/g, ""));
  };

  const handleReset = () => {
    setDesignName("");
    setSelectedTags(new Set());
    setPrice("");
    setDuration("");
    setDescription("");
    setImageUrls([]);
    setIsVisible(true);
    setBadge(null);
    setSubmitted(false);
  };

  const handleClose = () => {
    router.push("/references");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    if (!canSubmit) {
      return;
    }

    const nowItems = loadReferences();
    const draft: ReferenceEntity = {
      id: editingId ?? createReferenceId(),
      name: designName.trim(),
      price: Number(price),
      imageUrl: imageUrls[0],
      imageUrls,
      categories: Array.from(selectedTags),
      isVisible,
      badge,
      durationMinutes: duration.trim().length > 0 ? Number(duration) : null,
      description: description.trim()
    };

    if (isEditMode && editingId) {
      const exists = nowItems.some((item) => item.id === editingId);
      if (!exists) {
        window.alert("수정할 레퍼런스를 찾을 수 없습니다.");
        router.replace("/references");
        return;
      }

      const nextItems = nowItems.map((item) => (item.id === editingId ? { ...item, ...draft } : item));
      saveReferences(nextItems);
    } else {
      saveReferences([...nowItems, draft]);
    }

    router.push(`/references?notice=${isEditMode ? "updated" : "created"}`);
  };

  const title = isEditMode ? "레퍼런스 수정" : "레퍼런스 등록";
  const subtitle = isEditMode
    ? "기존 네일 디자인 정보를 수정합니다."
    : "새로운 네일 디자인을 라이브러리에 추가합니다.";
  const submitLabel = isEditMode ? "수정하기" : "등록하기";

  return (
    <div className="relative min-h-screen p-4 sm:p-6">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 p-8 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`skeleton-card-${index + 1}`}
              className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-surface-dark"
            >
              <div className="aspect-square bg-gray-100 dark:bg-gray-800" />
              <div className="p-4">
                <div className="mb-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <form
          onSubmit={handleSubmit}
          className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-gray-700 dark:bg-surface-dark"
        >
          <div className="z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5 dark:border-gray-800 dark:bg-surface-dark">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              <span className="material-icons" aria-hidden="true">
                close
              </span>
            </button>
          </div>

          <div className="custom-scrollbar overflow-y-auto p-6 md:p-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <section className="lg:col-span-5">
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  대표 이미지 <span className="text-primary">*</span>
                </label>

                <label className="group relative flex aspect-[4/5] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-all hover:border-primary/50 hover:bg-primary/5 dark:border-gray-600 dark:bg-[#2a1d1c]">
                  {representativeImage ? (
                    <img
                      src={representativeImage}
                      alt="대표 이미지 미리보기"
                      className="absolute inset-0 h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary shadow-sm transition-transform group-hover:scale-110 dark:bg-surface-dark">
                        <span className="material-icons text-3xl" aria-hidden="true">
                          add_photo_alternate
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        이미지를 드래그하거나 클릭하세요
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        JPG, PNG 파일 (최대 10MB)
                        <br />
                        권장 사이즈: 1000x1250px
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    multiple
                    onChange={handleFilesSelected}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </label>

                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  <label className="flex h-16 w-16 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg border border-primary bg-primary/10 text-primary">
                    <span className="material-icons text-sm" aria-hidden="true">
                      add
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      multiple
                      onChange={handleFilesSelected}
                      className="hidden"
                    />
                  </label>

                  {thumbnailUrls.map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => handleRemoveImage(url)}
                      className="group relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
                    >
                      <img src={url} alt="추가 이미지 썸네일" className="h-full w-full object-cover" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="material-icons text-sm text-white" aria-hidden="true">
                          delete
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-6 lg:col-span-7">
                <div>
                  <label
                    htmlFor="designName"
                    className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    디자인 이름 <span className="text-primary">*</span>
                  </label>
                  <input
                    id="designName"
                    type="text"
                    value={designName}
                    onChange={(event) => setDesignName(event.target.value)}
                    placeholder="예: 벚꽃 그라데이션, 자석젤 아트"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-surface-dark dark:text-white dark:placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    <span>
                      스타일 태그 <span className="text-primary">*</span>
                    </span>
                    <span className="text-xs font-medium text-red-500">최대 3개까지 가능</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {REFERENCE_CATEGORIES.map((category) => {
                      const selected = selectedTags.has(category);

                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => handleToggleTag(category)}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                            selected
                              ? "border-transparent bg-primary text-white shadow-sm shadow-primary/30 hover:bg-primary/90"
                              : "border-gray-200 bg-white text-gray-600 hover:border-primary/50 hover:text-primary dark:border-gray-700 dark:bg-surface-dark dark:text-gray-300"
                          )}
                        >
                          {category}
                        </button>
                      );
                    })}
                  </div>
                  {shouldShowTagError ? (
                    <p className="mt-2 text-xs text-red-500">최소 1개의 스타일 태그를 선택해주세요.</p>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="price"
                      className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                    >
                      기본 가격 (KRW) <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="price"
                        type="text"
                        value={price}
                        onChange={(event) => handlePriceChange(event.target.value)}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="0"
                        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-4 pr-8 text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-surface-dark dark:text-white"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                        <span className="text-sm font-medium">원</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="duration"
                      className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                    >
                      시술 시간 (분)
                    </label>
                    <div className="relative">
                      <input
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={(event) => setDuration(event.target.value.replace(/\D/g, ""))}
                        placeholder="60"
                        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-surface-dark dark:text-white"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                        <span className="text-sm font-medium">min</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="designDescription"
                    className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    디자인 설명 <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="designDescription"
                      value={description}
                      maxLength={DESCRIPTION_MAX_LENGTH}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="예: 봄 시즌용 파스텔톤 그라데이션에 작은 진주 포인트를 준 디자인입니다."
                      className="h-32 w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-surface-dark dark:text-white dark:placeholder:text-gray-600"
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      <span>{description.length}</span>/{DESCRIPTION_MAX_LENGTH}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="z-10 flex items-center justify-between border-t border-gray-100 bg-white px-6 py-5 dark:border-gray-800 dark:bg-surface-dark">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              초기화
            </button>

            <div className="flex items-center gap-3">
              {shouldShowTagError ? (
                <span className="mr-2 text-xs font-medium text-red-500">
                  최소 1개의 스타일 태그를 선택해주세요.
                </span>
              ) : null}
              {submitted && !canSubmit ? (
                <span className="mr-2 text-xs font-medium text-red-500">
                  필수 항목을 모두 입력해주세요.
                </span>
              ) : null}
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className={cn(
                  "rounded-lg px-8 py-2.5 text-sm font-bold text-white transition-all",
                  canSubmit
                    ? "bg-primary shadow-sm shadow-primary/30 hover:bg-primary/90"
                    : "cursor-not-allowed bg-gray-300"
                )}
              >
                {submitLabel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
