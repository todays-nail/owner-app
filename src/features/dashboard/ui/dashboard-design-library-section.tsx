/* eslint-disable @next/next/no-img-element */
"use client";

import {useEffect, useMemo, useState} from "react";

import {BaseModal} from "@/components/ui/base-modal";
import type {DashboardDesignItem} from "@/features/dashboard/model/dashboard";
import type {DesignReference} from "@/features/references/model/references";
import {loadReferences, type ReferenceEntity, saveReferences} from "@/features/references/model/reference-storage";
import {ReferenceDetailPanel} from "@/features/references/ui/reference-detail-panel";
import {ReferenceEditorForm, type ReferenceEditorFormValues} from "@/features/references/ui/reference-editor-form";

interface DashboardDesignLibrarySectionProps {
  designItems: DashboardDesignItem[];
  onUpdateDesignItem: (id: string, patch: Partial<Pick<DashboardDesignItem, "name" | "price" | "image">>) => void;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function parseDashboardPrice(value: string): number {
  const numeric = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function createReferenceId() {
  return `reference-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function DashboardDesignLibrarySection({
  designItems,
  onUpdateDesignItem
}: DashboardDesignLibrarySectionProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedDesign = useMemo(
    () => designItems.find((item) => item.id === selectedDesignId) ?? null,
    [designItems, selectedDesignId]
  );

  const editingDesign = useMemo(
    () => designItems.find((item) => item.id === editingDesignId) ?? null,
    [designItems, editingDesignId]
  );

  useEffect(() => {
    if (!editingDesign) {
      setEditName("");
      setEditPrice("");
      setEditImage("");
      setEditError(null);
      return;
    }

    setEditName(editingDesign.name);
    setEditPrice(editingDesign.price);
    setEditImage(editingDesign.image);
    setEditError(null);
  }, [editingDesign]);

  useEffect(() => {
    if (!selectedDesign && !editingDesign) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (editingDesign) {
        setEditingDesignId(null);
        return;
      }

      setSelectedDesignId(null);
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [editingDesign, selectedDesign]);

  const handleOpenDetail = (id: string) => {
    setSelectedDesignId(id);
  };

  const handleCloseDetail = () => {
    setSelectedDesignId(null);
  };

  const handleOpenEdit = () => {
    if (!selectedDesign) {
      return;
    }

    setEditingDesignId(selectedDesign.id);
    setSelectedDesignId(null);
  };

  const handleCloseEdit = () => {
    setEditingDesignId(null);
    setEditError(null);
  };

  const handleOpenCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateSubmit = (values: ReferenceEditorFormValues) => {
    const nowItems = loadReferences();
    const draft: ReferenceEntity = {
      id: createReferenceId(),
      ...values
    };

    saveReferences([...nowItems, draft]);
    setIsCreateModalOpen(false);
    setToastMessage("레퍼런스가 등록되었습니다. 레퍼런스 관리에서 확인하세요.");
  };

  const handleEditSave = () => {
    if (!editingDesign) {
      return;
    }

    const nextName = editName.trim();
    const nextPrice = editPrice.trim();
    const nextImage = editImage.trim();

    if (!nextName || !nextPrice || !nextImage) {
      setEditError("이름, 가격, 이미지 URL을 모두 입력해주세요.");
      return;
    }

    if (!isValidHttpUrl(nextImage)) {
      setEditError("이미지 URL은 http 또는 https 형식이어야 합니다.");
      return;
    }

    onUpdateDesignItem(editingDesign.id, {
      name: nextName,
      price: nextPrice,
      image: nextImage
    });
    handleCloseEdit();
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-primary/5 bg-white p-6 shadow-sm dark:bg-background-dark">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-bold">디자인 관리</h3>
            <p className="text-xs text-slate-400">시즌별 카탈로그 관리</p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-lg border border-primary/20 px-4 py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white"
          >
            <span className="material-icons text-sm" aria-hidden="true">
              add_photo_alternate
            </span>
            레퍼런스 등록
          </button>
        </div>
        <div
          className="no-scrollbar max-h-[22rem] overflow-y-auto pr-1 sm:max-h-[26rem] lg:max-h-[30rem]"
          tabIndex={0}
          aria-label="디자인 목록"
        >
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {designItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleOpenDetail(item.id)}
                aria-label={`${item.name} 상세보기`}
                className="group relative aspect-square overflow-hidden rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-3">
                  <p className="text-[10px] font-bold text-white">{item.name}</p>
                  <p className="text-[10px] text-white/80">{item.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedDesign ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dashboard-design-detail-title"
        >
          <button
            type="button"
            aria-label="디자인 상세 닫기"
            onClick={handleCloseDetail}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-gray-700 dark:bg-surface-dark">
            <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800">
              <img
                src={selectedDesign.image}
                alt={selectedDesign.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                aria-label="디자인 상세 닫기"
                onClick={handleCloseDetail}
                className="absolute right-3 top-3 rounded-full bg-black/35 p-1.5 text-white transition-colors hover:bg-black/50"
              >
                <span className="material-icons text-base" aria-hidden="true">
                  close
                </span>
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <h4
                  id="dashboard-design-detail-title"
                  className="text-xl font-bold text-gray-900 dark:text-white"
                >
                  {selectedDesign.name}
                </h4>
                <p className="mt-1 text-sm font-semibold text-primary">{selectedDesign.price}</p>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseDetail}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  닫기
                </button>
                <button
                  type="button"
                  onClick={handleOpenEdit}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  수정하기
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {editingDesign ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dashboard-design-edit-title"
        >
          <button
            type="button"
            aria-label="디자인 수정 닫기"
            onClick={handleCloseEdit}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-surface-dark">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h4
                  id="dashboard-design-edit-title"
                  className="text-lg font-bold text-gray-900 dark:text-white"
                >
                  디자인 간편 수정
                </h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  이름, 가격, 이미지 URL을 수정하면 카드에 즉시 반영됩니다.
                </p>
              </div>
              <button
                type="button"
                aria-label="디자인 수정 닫기"
                onClick={handleCloseEdit}
                className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <span className="material-icons" aria-hidden="true">
                  close
                </span>
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  디자인 이름
                </span>
                <input
                  type="text"
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-surface-dark dark:text-white"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  가격
                </span>
                <input
                  type="text"
                  value={editPrice}
                  onChange={(event) => setEditPrice(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-surface-dark dark:text-white"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  이미지 URL
                </span>
                <input
                  type="url"
                  value={editImage}
                  onChange={(event) => setEditImage(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-surface-dark dark:text-white"
                />
              </label>

              {editError ? (
                <p className="text-sm font-medium text-red-500">{editError}</p>
              ) : null}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleCloseEdit}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleEditSave}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
