/* eslint-disable @next/next/no-img-element */
"use client";

import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";

import {useAppToast} from "@/components/ui/app-toast-provider";
import {BaseModal} from "@/components/ui/base-modal";
import type {DesignReference} from "@/features/references/model/references";
import {createReferenceForCurrentUser} from "@/features/references/services/create-reference-browser-service";
import {updateReferenceForCurrentUser} from "@/features/references/services/update-reference-browser-service";
import {ReferenceDetailPanel} from "@/features/references/ui/reference-detail-panel";
import {ReferenceEditorForm, type ReferenceEditorFormValues} from "@/features/references/ui/reference-editor-form";

interface DashboardDesignLibrarySectionProps {
  references: DesignReference[];
}

function formatKrw(price: number): string {
  return `₩${new Intl.NumberFormat("ko-KR").format(price)}`;
}

export function DashboardDesignLibrarySection({ references }: DashboardDesignLibrarySectionProps) {
  const router = useRouter();
  const { showToast } = useAppToast();

  const [selectedReferenceId, setSelectedReferenceId] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createPending, setCreatePending] = useState(false);

  const [editingReferenceId, setEditingReferenceId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPending, setEditPending] = useState(false);

  const selectedReference = useMemo(
    () => references.find((item) => item.id === selectedReferenceId) ?? null,
    [references, selectedReferenceId]
  );

  const editingReference = useMemo(
    () => references.find((item) => item.id === editingReferenceId) ?? null,
    [editingReferenceId, references]
  );

  useEffect(() => {
    if (!toastMessage) return;

    const timeoutId = window.setTimeout(() => {
      setToastMessage(null);
    }, 2500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toastMessage]);

  useEffect(() => {
    if (!selectedReferenceId) {
      return;
    }

    const exists = references.some((item) => item.id === selectedReferenceId);
    if (!exists) {
      setSelectedReferenceId(null);
    }
  }, [references, selectedReferenceId]);

  useEffect(() => {
    if (!editingReferenceId) {
      return;
    }

    const exists = references.some((item) => item.id === editingReferenceId);
    if (!exists) {
      setEditingReferenceId(null);
      setIsEditModalOpen(false);
    }
  }, [editingReferenceId, references]);

  const handleOpenCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreate = () => {
    if (createPending) return;
    setIsCreateModalOpen(false);
  };

  const handleCreateSubmit = async (values: ReferenceEditorFormValues) => {
    if (createPending) return;
    setCreatePending(true);

    try {
      await createReferenceForCurrentUser(values);
      setIsCreateModalOpen(false);
      showToast("레퍼런스가 등록되었습니다.");
      router.refresh();
    } catch (error) {
      console.error("[dashboard:references:create] failed", {
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
      showToast({
        message,
        variant: "error"
      });
    } finally {
      setCreatePending(false);
    }
  };

  const handleOpenDetail = (id: string) => {
    setSelectedReferenceId(id);
  };

  const handleCloseDetail = () => {
    setSelectedReferenceId(null);
  };

  const handleOpenEdit = () => {
    if (!selectedReference) return;
    setSelectedReferenceId(null);
    setEditingReferenceId(selectedReference.id);
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
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
      showToast("레퍼런스가 수정되었습니다.");
      router.refresh();
    } catch (error) {
      console.error("[dashboard:references:update] failed", {
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
      showToast({
        message,
        variant: "error"
      });
    } finally {
      setEditPending(false);
    }
  };

  const hasAnyReferences = references.length > 0;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-primary/5 bg-white p-6 shadow-sm dark:bg-background-dark">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-bold">디자인 관리</h3>
            <p className="text-xs text-slate-400">노출중 레퍼런스 조회 및 관리</p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-lg border border-primary/20 px-4 py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white"
          >
            <span className="material-icons text-sm" aria-hidden="true">
              add_photo_alternate
            </span>
            디자인 등록
          </button>
        </div>

        {hasAnyReferences ? (
          <div
            className="no-scrollbar max-h-[22rem] overflow-y-auto pr-1 sm:max-h-[26rem] lg:max-h-[30rem]"
            tabIndex={0}
            aria-label="디자인 목록"
          >
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {references.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleOpenDetail(item.id)}
                  aria-label={`${item.name} 상세보기`}
                  className="group relative aspect-square overflow-hidden rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-3">
                    <p className="text-[10px] font-bold text-white">{item.name}</p>
                    <p className="text-[10px] text-white/80">{formatKrw(item.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-5 py-10 text-center dark:border-gray-700 dark:bg-surface-dark">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              현재 노출중인 레퍼런스가 없습니다.
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              이 화면에서 바로 디자인을 등록해 주세요.
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-primary/90"
            >
              <span className="material-icons text-sm" aria-hidden="true">
                add
              </span>
              디자인 등록하기
            </button>
          </div>
        )}
      </section>

      <BaseModal
        open={selectedReference !== null}
        onClose={handleCloseDetail}
        titleId="dashboard-design-detail-title"
        descriptionId="dashboard-design-detail-description"
        rootClassName="z-[80] p-4 sm:p-4"
        overlayClassName="bg-black/45 backdrop-blur-sm"
      >
        {selectedReference ? (
          <ReferenceDetailPanel
            item={selectedReference}
            titleId="dashboard-design-detail-title"
            onClose={handleCloseDetail}
            onRequestEdit={handleOpenEdit}
            canEdit
          />
        ) : null}
        <p id="dashboard-design-detail-description" className="sr-only">
          대시보드 디자인 상세 정보를 확인하고 수정하는 모달입니다.
        </p>
      </BaseModal>

      <BaseModal
        open={isCreateModalOpen}
        onClose={handleCloseCreate}
        titleId="dashboard-reference-create-title"
        descriptionId="dashboard-reference-create-description"
      >
        <ReferenceEditorForm
          mode="create"
          titleId="dashboard-reference-create-title"
          title="디자인 등록"
          subtitle="대시보드에서 바로 디자인을 등록합니다."
          submitLabel={createPending ? "등록 중..." : "등록하기"}
          onCancel={handleCloseCreate}
          onSubmit={handleCreateSubmit}
        />
        <p id="dashboard-reference-create-description" className="sr-only">
          대시보드에서 디자인을 등록하는 모달입니다.
        </p>
      </BaseModal>

      <BaseModal
        open={isEditModalOpen && editingReference !== null}
        onClose={handleCloseEdit}
        titleId="dashboard-reference-edit-title"
        descriptionId="dashboard-reference-edit-description"
      >
        {editingReference ? (
          <>
            <ReferenceEditorForm
              mode="edit"
              initialValue={editingReference}
              titleId="dashboard-reference-edit-title"
              title="디자인 수정"
              subtitle="대시보드에서 디자인 정보를 수정합니다."
              submitLabel={editPending ? "저장 중..." : "저장하기"}
              onCancel={handleCloseEdit}
              onSubmit={handleEditSubmit}
            />
            <p id="dashboard-reference-edit-description" className="sr-only">
              대시보드에서 디자인을 수정하는 모달입니다.
            </p>
          </>
        ) : null}
      </BaseModal>
    </div>
  );
}
