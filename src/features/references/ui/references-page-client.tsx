"use client";

import {useEffect, useMemo, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import Link from "next/link";

import {cn} from "@/lib/utils";
import {
  INITIAL_REFERENCES,
  REFERENCE_CATEGORIES,
  type ReferenceCategory,
  REFERENCES_PAGE_SIZE,
  type ReferenceViewMode
} from "@/features/references/model/references";
import {loadReferences, type ReferenceEntity, saveReferences} from "@/features/references/model/reference-storage";
import {ReferenceCard} from "@/features/references/ui/reference-card";
import {ReferenceListRow} from "@/features/references/ui/reference-list-row";

export function ReferencesPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [references, setReferences] = useState<ReferenceEntity[]>(INITIAL_REFERENCES);
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<ReferenceCategory>>(new Set());
  const [viewMode, setViewMode] = useState<ReferenceViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    setReferences(loadReferences());
  }, []);

  useEffect(() => {
    const notice = searchParams.get("notice");
    if (!notice) return;

    const messageByNotice: Record<string, string> = {
      created: "새 레퍼런스가 등록되었습니다.",
      updated: "레퍼런스가 수정되었습니다."
    };

    const message = messageByNotice[notice];
    if (!message) return;

    setToastMessage(message);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("notice");
    router.replace(params.size > 0 ? `/references?${params.toString()}` : "/references", {
      scroll: false
    });
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
    return references.filter((item) => {
      const searchTarget = `${item.name} ${item.categories.join(" ")}`.toLowerCase();
      const matchesQuery = normalizedQuery.length === 0 || searchTarget.includes(normalizedQuery);
      const matchesCategory =
        selectedTags.size === 0 || item.categories.some((category) => selectedTags.has(category));

      return matchesQuery && matchesCategory;
    });
  }, [normalizedQuery, references, selectedTags]);

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

  const updateReferences = (updater: (items: ReferenceEntity[]) => ReferenceEntity[]) => {
    setReferences((prev) => {
      const next = updater(prev);
      saveReferences(next);
      return next;
    });
  };

  const handleToggleVisible = (id: string, nextValue: boolean) => {
    updateReferences((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isVisible: nextValue } : item))
    );
  };

  const handleEdit = (id: string) => {
    const params = new URLSearchParams({ mode: "edit", id }).toString();
    window.location.assign(`/references/new?${params}`);
  };

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const pendingDeleteItem = useMemo(
    () => references.find((item) => item.id === pendingDeleteId) ?? null,
    [pendingDeleteId, references]
  );

  const handleDeleteConfirm = () => {
    if (!pendingDeleteId) return;
    updateReferences((prev) => prev.filter((item) => item.id !== pendingDeleteId));
    setPendingDeleteId(null);
    setToastMessage("레퍼런스가 삭제되었습니다.");
  };

  const handleDeleteCancel = () => {
    setPendingDeleteId(null);
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
        <Link
          href="/references/new"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <span className="material-icons mr-2 text-sm" aria-hidden="true">
            add
          </span>
          레퍼런스 등록
        </Link>
      </header>

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
                  onToggleVisible={handleToggleVisible}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}

              <Link
                href="/references/new"
                className="flex min-h-[300px] h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-6 transition-all duration-300 hover:border-primary hover:bg-primary/5 dark:border-gray-700 dark:bg-surface-dark"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 shadow-sm transition-colors dark:bg-gray-800">
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
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedReferences.map((item) => (
                <ReferenceListRow
                  key={item.id}
                  item={item}
                  visible={item.isVisible}
                  onToggleVisible={handleToggleVisible}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}

              <Link
                href="/references/new"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white px-6 py-5 text-sm font-semibold text-gray-500 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-gray-700 dark:bg-surface-dark dark:text-gray-300"
              >
                <span className="material-icons text-lg" aria-hidden="true">
                  add
                </span>
                새 디자인 등록
              </Link>
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

      {pendingDeleteItem ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reference-delete-title"
          aria-describedby="reference-delete-description"
        >
          <button
            type="button"
            aria-label="삭제 확인 닫기"
            onClick={handleDeleteCancel}
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
          />
          <div className="relative w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-surface-dark">
            <h2
              id="reference-delete-title"
              className="text-lg font-bold text-gray-900 dark:text-white"
            >
              레퍼런스를 삭제할까요?
            </h2>
            <p
              id="reference-delete-description"
              className="mt-2 text-sm text-gray-500 dark:text-gray-400"
            >
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {pendingDeleteItem.name}
              </span>
              {" "}
              항목이 목록에서 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleDeleteCancel}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
