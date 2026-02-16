"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  INITIAL_REFERENCES,
  REFERENCES_PAGE_SIZE,
  REFERENCE_CATEGORIES,
  type DesignReference,
  type ReferenceCategory,
  type ReferenceViewMode
} from "@/features/references/model/references";
import { ReferenceCard } from "@/features/references/ui/reference-card";
import { ReferenceListRow } from "@/features/references/ui/reference-list-row";

function buildInitialVisibilityMap(items: DesignReference[]) {
  return items.reduce<Record<string, boolean>>((acc, item) => {
    acc[item.id] = item.isVisible;
    return acc;
  }, {});
}

export function ReferencesPageClient() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<ReferenceCategory>>(new Set());
  const [viewMode, setViewMode] = useState<ReferenceViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibilityById, setVisibilityById] = useState<Record<string, boolean>>(
    buildInitialVisibilityMap(INITIAL_REFERENCES)
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filteredReferences = useMemo(() => {
    return INITIAL_REFERENCES.filter((item) => {
      const searchTarget = `${item.name} ${item.categories.join(" ")}`.toLowerCase();
      const matchesQuery = normalizedQuery.length === 0 || searchTarget.includes(normalizedQuery);
      const matchesCategory =
        selectedTags.size === 0 || item.categories.some((category) => selectedTags.has(category));

      return matchesQuery && matchesCategory;
    });
  }, [normalizedQuery, selectedTags]);

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

  const handleToggleVisible = (id: string, nextValue: boolean) => {
    setVisibilityById((prev) => ({
      ...prev,
      [id]: nextValue
    }));
  };

  const handleRegister = () => {
    router.push("/references/new");
  };
  const handleEdit = (id: string) => void id;
  const handleDelete = (id: string) => void id;
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">디자인 라이브러리</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            네일 아트 디자인 포트폴리오를 관리하고 고객에게 보여줄 레퍼런스를 설정하세요.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRegister}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <span className="material-icons mr-2 text-sm" aria-hidden="true">
            add
          </span>
          레퍼런스 등록
        </button>
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
                  visible={visibilityById[item.id] ?? item.isVisible}
                  onToggleVisible={handleToggleVisible}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}

              <button
                type="button"
                onClick={handleRegister}
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
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedReferences.map((item) => (
                <ReferenceListRow
                  key={item.id}
                  item={item}
                  visible={visibilityById[item.id] ?? item.isVisible}
                  onToggleVisible={handleToggleVisible}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}

              <button
                type="button"
                onClick={handleRegister}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white px-6 py-5 text-sm font-semibold text-gray-500 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-gray-700 dark:bg-surface-dark dark:text-gray-300"
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
    </div>
  );
}
