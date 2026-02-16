"use client";

import {useEffect, useMemo, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";

import {BaseModal} from "@/components/ui/base-modal";
import {cn} from "@/lib/utils";
import {
  type DesignReference,
  REFERENCE_CATEGORIES,
  type ReferenceCategory,
  REFERENCES_PAGE_SIZE,
  type ReferenceViewMode
} from "@/features/references/model/references";
import {ReferenceCard} from "@/features/references/ui/reference-card";
import {ReferenceDetailPanel} from "@/features/references/ui/reference-detail-panel";
import {ReferenceListRow} from "@/features/references/ui/reference-list-row";

const READ_ONLY_NOTICE = "편집 기능은 다음 단계에서 서버 연동 예정입니다.";

interface ReferencesPageClientProps {
  initialReferences: DesignReference[];
}

export function ReferencesPageClient({ initialReferences }: ReferencesPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<ReferenceCategory>>(new Set());
  const [viewMode, setViewMode] = useState<ReferenceViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedReferenceId, setSelectedReferenceId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    const messageByNotice: Record<string, string> = {
      created: READ_ONLY_NOTICE,
      updated: READ_ONLY_NOTICE,
      "create-modal-only": READ_ONLY_NOTICE
    };

    const params = new URLSearchParams(searchParams.toString());
    let shouldReplace = false;
    let nextMessage: string | null = null;

    const modal = params.get("modal");
    if (modal === "create") {
      nextMessage = READ_ONLY_NOTICE;
      params.delete("modal");
      shouldReplace = true;
    }

    const notice = params.get("notice");
    if (notice) {
      const mapped = messageByNotice[notice];
      if (mapped) {
        nextMessage = mapped;
      }
      params.delete("notice");
      shouldReplace = true;
    }

    if (nextMessage) {
      setToastMessage(nextMessage);
    }

    if (shouldReplace) {
      router.replace(params.size > 0 ? `/references?${params.toString()}` : "/references", {
        scroll: false
      });
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (!toastMessage) return;

    const timer = window.setTimeout(() => {
      setToastMessage(null);
    }, 2600);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toastMessage]);

  const filteredReferences = useMemo(() => {
    return initialReferences.filter((item) => {
      const searchTarget = `${item.name} ${item.categories.join(" ")}`.toLowerCase();
      const matchesQuery = normalizedQuery.length === 0 || searchTarget.includes(normalizedQuery);
      const matchesCategory =
        selectedTags.size === 0 || item.categories.some((category) => selectedTags.has(category));

      return matchesQuery && matchesCategory;
    });
  }, [initialReferences, normalizedQuery, selectedTags]);

  const totalPages = Math.max(1, Math.ceil(filteredReferences.length / REFERENCES_PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedReferences = useMemo(() => {
    const start = (currentPage - 1) * REFERENCES_PAGE_SIZE;
    return filteredReferences.slice(start, start + REFERENCES_PAGE_SIZE);
  }, [currentPage, filteredReferences]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages]
  );

  const selectedReference = useMemo(
    () => filteredReferences.find((item) => item.id === selectedReferenceId) ?? null,
    [filteredReferences, selectedReferenceId]
  );

  useEffect(() => {
    if (!isDetailModalOpen) {
      return;
    }

    if (selectedReference !== null) {
      return;
    }

    setIsDetailModalOpen(false);
    setSelectedReferenceId(null);
    setToastMessage("선택한 레퍼런스를 찾을 수 없습니다.");
  }, [isDetailModalOpen, selectedReference]);

  const handleCategoryToggle = (category: ReferenceCategory) => {
    setCurrentPage(1);
    setSelectedTags((prev) => {
      const next = new Set(prev);

      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }

      return next;
    });
  };

  const handleOpenDetail = (id: string) => {
    setSelectedReferenceId(id);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReferenceId(null);
  };

  const handleReadOnlyAction = () => {
    setToastMessage(READ_ONLY_NOTICE);
  };

  const hasResults = filteredReferences.length > 0;

  const handleGridView = () => {
    setViewMode("grid");
    setCurrentPage(1);
  };

  const handleListView = () => {
    setViewMode("list");
    setCurrentPage(1);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">디자인 관리</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            네일 아트 디자인 포트폴리오를 관리하고 고객에게 보여줄 레퍼런스를 설정하세요.
          </p>
        </div>
        <button
          type="button"
          disabled
          aria-disabled
          title={READ_ONLY_NOTICE}
          className="inline-flex cursor-not-allowed items-center justify-center rounded-xl bg-primary/70 px-4 py-2.5 text-sm font-medium text-white opacity-70 shadow-sm"
        >
          <span className="material-icons mr-2 text-sm" aria-hidden="true">
            add
          </span>
          레퍼런스 등록
        </button>
      </header>

      <section className="rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
        {READ_ONLY_NOTICE}
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-surface-dark">
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="relative w-full flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="material-icons text-lg text-gray-400" aria-hidden="true">
                  search
                </span>
              </div>
              <input
                type="text"
                value={query}
                onChange={(event) => handleQueryChange(event.target.value)}
                placeholder="디자인명 또는 태그 검색 (예: 봄, 벚꽃)"
                className="block h-11 w-full rounded-xl border border-gray-100 bg-gray-50/60 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-surface-dark dark:text-white"
              />
            </div>

            <div className="flex flex-shrink-0 items-center space-x-2 rounded-lg bg-gray-50 p-1 dark:bg-gray-800">
              <button
                type="button"
                onClick={handleGridView}
                aria-label="그리드 보기"
                aria-pressed={viewMode === "grid"}
                className={cn(
                  "rounded-md p-2 transition-colors",
                  viewMode === "grid"
                    ? "bg-white text-primary shadow-sm dark:bg-surface-dark"
                    : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                )}
              >
                <span className="material-icons" aria-hidden="true">
                  grid_view
                </span>
              </button>
              <button
                type="button"
                onClick={handleListView}
                aria-label="리스트 보기"
                aria-pressed={viewMode === "list"}
                className={cn(
                  "rounded-md p-2 transition-colors",
                  viewMode === "list"
                    ? "bg-white text-primary shadow-sm dark:bg-surface-dark"
                    : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                )}
              >
                <span className="material-icons" aria-hidden="true">
                  list
                </span>
              </button>
            </div>
          </div>

          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 pt-1">
            {REFERENCE_CATEGORIES.map((category) => {
              const selected = selectedTags.has(category);

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryToggle(category)}
                  className={cn(
                    "whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    selected
                      ? "border-primary bg-primary text-white hover:bg-primary-hover"
                      : "border-gray-100 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        {hasResults ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedReferences.map((item) => (
                <ReferenceCard
                  key={item.id}
                  item={item}
                  visible={item.isVisible}
                  readOnly
                  onOpenDetail={handleOpenDetail}
                  onToggleVisible={handleReadOnlyAction}
                  onEdit={handleReadOnlyAction}
                  onDelete={handleReadOnlyAction}
                />
              ))}

              <button
                type="button"
                disabled
                aria-disabled
                title={READ_ONLY_NOTICE}
                className="flex h-full min-h-[300px] cursor-not-allowed flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-6 opacity-70 dark:border-gray-700 dark:bg-surface-dark"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 shadow-sm dark:bg-gray-800">
                  <span className="material-icons text-3xl text-gray-300" aria-hidden="true">
                    add
                  </span>
                </div>
                <span className="mb-2 text-base font-bold text-gray-900 dark:text-white">새 디자인 등록</span>
                <span className="text-center text-xs leading-relaxed text-gray-400">
                  새로운 네일 디자인을
                  <br />
                  포트폴리오에 추가하세요
                </span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedReferences.map((item) => (
                <ReferenceListRow
                  key={item.id}
                  item={item}
                  visible={item.isVisible}
                  readOnly
                  onOpenDetail={handleOpenDetail}
                  onToggleVisible={handleReadOnlyAction}
                  onEdit={handleReadOnlyAction}
                  onDelete={handleReadOnlyAction}
                />
              ))}

              <button
                type="button"
                disabled
                aria-disabled
                title={READ_ONLY_NOTICE}
                className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white px-6 py-5 text-sm font-semibold text-gray-500 opacity-70 dark:border-gray-700 dark:bg-surface-dark dark:text-gray-300"
              >
                <span className="material-icons text-lg" aria-hidden="true">
                  add
                </span>
                새 디자인 등록
              </button>
            </div>
          )
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center dark:border-gray-700 dark:bg-surface-dark">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              조건에 맞는 디자인이 없습니다. 검색어 또는 카테고리를 조정해 주세요.
            </p>
          </div>
        )}

        {hasResults ? (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-1 rounded-2xl border border-gray-100 bg-white p-1 shadow-sm dark:border-gray-800 dark:bg-surface-dark">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                aria-label="이전 페이지"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-50 disabled:opacity-30 dark:hover:bg-gray-800"
              >
                <span className="material-icons" aria-hidden="true">
                  chevron_left
                </span>
              </button>

              {pageNumbers.map((pageNumber) => {
                const active = pageNumber === currentPage;

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl text-sm transition-colors",
                      active
                        ? "bg-primary font-bold text-white shadow-lg shadow-primary/20"
                        : "font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                aria-label="다음 페이지"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-50 disabled:opacity-30 dark:hover:bg-gray-800"
              >
                <span className="material-icons" aria-hidden="true">
                  chevron_right
                </span>
              </button>
            </nav>
          </div>
        ) : null}
      </section>

      <BaseModal
        open={isDetailModalOpen && selectedReference !== null}
        onClose={closeDetailModal}
        titleId="reference-detail-title"
        descriptionId="reference-detail-description"
      >
        {selectedReference ? (
          <>
            <ReferenceDetailPanel
              item={selectedReference}
              titleId="reference-detail-title"
              onClose={closeDetailModal}
              onRequestEdit={handleReadOnlyAction}
              canEdit={false}
            />
            <p id="reference-detail-description" className="sr-only">
              레퍼런스 상세 정보를 읽기 전용으로 확인하는 모달입니다.
            </p>
          </>
        ) : null}
      </BaseModal>

      {toastMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 top-4 z-50 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-xl dark:bg-gray-100 dark:text-gray-900 sm:right-6 sm:top-6"
        >
          <span className="material-icons text-base" aria-hidden="true">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      ) : null}
    </div>
  );
}
