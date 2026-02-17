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
import {createReferenceForCurrentUser} from "@/features/references/services/create-reference-browser-service";
import {deleteReferenceForCurrentUser} from "@/features/references/services/delete-reference-browser-service";
import {
  setReferenceVisibilityForCurrentUser
} from "@/features/references/services/set-reference-visibility-browser-service";
import {updateReferenceForCurrentUser} from "@/features/references/services/update-reference-browser-service";
import {ReferenceCard} from "@/features/references/ui/reference-card";
import {ReferenceDetailPanel} from "@/features/references/ui/reference-detail-panel";
import {ReferenceEditorForm, type ReferenceEditorFormValues} from "@/features/references/ui/reference-editor-form";
import {ReferenceListRow} from "@/features/references/ui/reference-list-row";

const FEATURE_NOTICE = "수정/삭제/노출 토글 연동 완료";

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

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createPending, setCreatePending] = useState(false);

  const [editingReferenceId, setEditingReferenceId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPending, setEditPending] = useState(false);

  const [deletingReferenceId, setDeletingReferenceId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  const [togglePendingIds, setTogglePendingIds] = useState<Set<string>>(new Set());

  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    const messageByNotice: Record<string, string> = {
      created: "새 레퍼런스가 등록되었습니다.",
      updated: "레퍼런스가 수정되었습니다.",
      "create-modal-only": "레퍼런스 등록 모달을 열었습니다."
    };

    const params = new URLSearchParams(searchParams.toString());
    let shouldReplace = false;

    const modal = params.get("modal");
    if (modal === "create") {
      setIsCreateModalOpen(true);
      params.delete("modal");
      shouldReplace = true;
    }

    const notice = params.get("notice");
    if (notice) {
      const mapped = messageByNotice[notice];
      if (mapped) {
        setToastMessage(mapped);
      }
      params.delete("notice");
      shouldReplace = true;
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
    () => initialReferences.find((item) => item.id === selectedReferenceId) ?? null,
    [initialReferences, selectedReferenceId]
  );

  const editingReference = useMemo(
    () => initialReferences.find((item) => item.id === editingReferenceId) ?? null,
    [initialReferences, editingReferenceId]
  );

  const deletingReference = useMemo(
    () => initialReferences.find((item) => item.id === deletingReferenceId) ?? null,
    [initialReferences, deletingReferenceId]
  );

  useEffect(() => {
    if (!isDetailModalOpen) return;
    if (selectedReference !== null) return;

    setIsDetailModalOpen(false);
    setSelectedReferenceId(null);
    setToastMessage("선택한 레퍼런스를 찾을 수 없습니다.");
  }, [isDetailModalOpen, selectedReference]);

  useEffect(() => {
    if (!isEditModalOpen) return;
    if (editingReference !== null) return;

    setIsEditModalOpen(false);
    setEditingReferenceId(null);
  }, [editingReference, isEditModalOpen]);

  useEffect(() => {
    if (!isDeleteModalOpen) return;
    if (deletingReference !== null) return;

    setIsDeleteModalOpen(false);
    setDeletingReferenceId(null);
  }, [deletingReference, isDeleteModalOpen]);

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

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    if (createPending) return;
    setIsCreateModalOpen(false);
  };

  const handleCreateSubmit = async (values: ReferenceEditorFormValues) => {
    if (createPending) return;
    setCreatePending(true);

    try {
      await createReferenceForCurrentUser(values);
      setIsCreateModalOpen(false);
      setToastMessage("새 레퍼런스가 등록되었습니다.");
      router.refresh();
    } catch (error) {
      console.error("[references:create] submit failed", {
        error,
        inputSummary: {
          name: values.name,
          price: values.price,
          durationMinutes: values.durationMinutes,
          imageCount: values.imageUrls.length,
          categoryCount: values.categories.length,
          isVisible: values.isVisible
        }
      });

      const message = error instanceof Error ? error.message : "레퍼런스 등록에 실패했습니다.";
      setToastMessage(message);
    } finally {
      setCreatePending(false);
    }
  };

  const handleOpenEdit = (id: string) => {
    setIsDetailModalOpen(false);
    setEditingReferenceId(id);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    if (editPending) return;
    setIsEditModalOpen(false);
    setEditingReferenceId(null);
  };

  const handleEditSubmit = async (values: ReferenceEditorFormValues) => {
    if (!editingReferenceId || editPending) return;
    setEditPending(true);

    try {
      await updateReferenceForCurrentUser(editingReferenceId, values);
      setIsEditModalOpen(false);
      setEditingReferenceId(null);
      setToastMessage("레퍼런스가 수정되었습니다.");
      router.refresh();
    } catch (error) {
      console.error("[references:update] submit failed", {
        referenceId: editingReferenceId,
        error,
        inputSummary: {
          name: values.name,
          price: values.price,
          durationMinutes: values.durationMinutes,
          imageCount: values.imageUrls.length,
          categoryCount: values.categories.length,
          isVisible: values.isVisible
        }
      });

      const message = error instanceof Error ? error.message : "레퍼런스 수정에 실패했습니다.";
      setToastMessage(message);
    } finally {
      setEditPending(false);
    }
  };

  const handleOpenDeleteModal = (id: string) => {
    setIsDetailModalOpen(false);
    setDeletingReferenceId(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (deletePending) return;
    setIsDeleteModalOpen(false);
    setDeletingReferenceId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingReferenceId || deletePending) return;
    setDeletePending(true);

    try {
      await deleteReferenceForCurrentUser(deletingReferenceId);

      if (selectedReferenceId === deletingReferenceId) {
        closeDetailModal();
      }

      setIsDeleteModalOpen(false);
      setDeletingReferenceId(null);
      setToastMessage("레퍼런스가 삭제되었습니다.");
      router.refresh();
    } catch (error) {
      console.error("[references:delete] submit failed", {
        referenceId: deletingReferenceId,
        error
      });

      const message = error instanceof Error ? error.message : "레퍼런스 삭제에 실패했습니다.";
      setToastMessage(message);
    } finally {
      setDeletePending(false);
    }
  };

  const handleToggleVisible = async (id: string, nextValue: boolean) => {
    if (togglePendingIds.has(id)) return;

    setTogglePendingIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    try {
      await setReferenceVisibilityForCurrentUser(id, nextValue);
      setToastMessage(nextValue ? "레퍼런스가 노출 상태로 변경되었습니다." : "레퍼런스가 비노출 처리되었습니다.");
      router.refresh();
    } catch (error) {
      console.error("[references:visibility] submit failed", { referenceId: id, nextValue, error });
      const message = error instanceof Error ? error.message : "노출 상태 변경에 실패했습니다.";
      setToastMessage(message);
    } finally {
      setTogglePendingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
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

  const handleEditFromDetail = () => {
    if (!selectedReference) return;
    handleOpenEdit(selectedReference.id);
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
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <span className="material-icons mr-2 text-sm" aria-hidden="true">
            add
          </span>
          레퍼런스 등록
        </button>
      </header>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
        {FEATURE_NOTICE}
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
              {paginatedReferences.map((item) => {
                const isPending = togglePendingIds.has(item.id);
                const actionsDisabled = createPending || editPending || deletePending;

                return (
                  <ReferenceCard
                    key={item.id}
                    item={item}
                    visible={item.isVisible}
                    onOpenDetail={handleOpenDetail}
                    onToggleVisible={handleToggleVisible}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDeleteModal}
                    toggleDisabled={actionsDisabled || isPending}
                    editDisabled={actionsDisabled}
                    deleteDisabled={actionsDisabled}
                  />
                );
              })}

              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-6 transition-all duration-300 hover:border-primary hover:bg-primary/5 dark:border-gray-700 dark:bg-surface-dark"
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
              {paginatedReferences.map((item) => {
                const isPending = togglePendingIds.has(item.id);
                const actionsDisabled = createPending || editPending || deletePending;

                return (
                  <ReferenceListRow
                    key={item.id}
                    item={item}
                    visible={item.isVisible}
                    onOpenDetail={handleOpenDetail}
                    onToggleVisible={handleToggleVisible}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDeleteModal}
                    toggleDisabled={actionsDisabled || isPending}
                    editDisabled={actionsDisabled}
                    deleteDisabled={actionsDisabled}
                  />
                );
              })}

              <button
                type="button"
                onClick={handleOpenCreateModal}
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

      <BaseModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        titleId="reference-create-title"
        descriptionId="reference-create-description"
      >
        <ReferenceEditorForm
          mode="create"
          titleId="reference-create-title"
          title="디자인 등록"
          subtitle="새로운 네일 디자인을 라이브러리에 추가합니다."
          submitLabel={createPending ? "등록 중..." : "등록하기"}
          onCancel={handleCloseCreateModal}
          onSubmit={handleCreateSubmit}
        />
        <p id="reference-create-description" className="sr-only">
          새로운 디자인을 등록하는 모달입니다.
        </p>
      </BaseModal>

      <BaseModal
        open={isEditModalOpen && editingReference !== null}
        onClose={handleCloseEditModal}
        titleId="reference-edit-title"
        descriptionId="reference-edit-description"
      >
        {editingReference ? (
          <>
            <ReferenceEditorForm
              mode="edit"
              initialValue={editingReference}
              titleId="reference-edit-title"
              title="디자인 수정"
              subtitle="등록된 디자인 정보를 수정합니다."
              submitLabel={editPending ? "저장 중..." : "저장하기"}
              onCancel={handleCloseEditModal}
              onSubmit={handleEditSubmit}
            />
            <p id="reference-edit-description" className="sr-only">
              디자인 정보를 수정하는 모달입니다.
            </p>
          </>
        ) : null}
      </BaseModal>

      <BaseModal
        open={isDeleteModalOpen && deletingReference !== null}
        onClose={handleCloseDeleteModal}
        titleId="reference-delete-title"
        descriptionId="reference-delete-description"
        contentClassName="max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-surface-dark"
      >
        {deletingReference ? (
          <section className="space-y-4">
            <header>
              <h2 id="reference-delete-title" className="text-lg font-bold text-gray-900 dark:text-white">
                디자인을 삭제할까요?
              </h2>
              <p id="reference-delete-description" className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {deletingReference.name}
                </span>
                를 삭제하면 복구할 수 없습니다.
              </p>
            </header>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                disabled={deletePending}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deletePending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletePending ? "삭제 중..." : "삭제하기"}
              </button>
            </div>
          </section>
        ) : null}
      </BaseModal>

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
              onRequestEdit={handleEditFromDetail}
              canEdit
            />
            <p id="reference-detail-description" className="sr-only">
              디자인 상세 정보를 확인하고 수정할 수 있는 모달입니다.
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
