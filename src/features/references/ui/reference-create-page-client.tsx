"use client";

import {useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";

import {loadReferences, type ReferenceEntity, saveReferences} from "@/features/references/model/reference-storage";
import {ReferenceEditorForm, type ReferenceEditorFormValues} from "@/features/references/ui/reference-editor-form";

function createReferenceId() {
  return `reference-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ReferenceCreatePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  useEffect(() => {
    if (mode !== "edit") {
      return;
    }

    router.replace("/references?notice=edit-modal-only");
  }, [mode, router]);

  const handleClose = () => {
    router.push("/references");
  };

  const handleCreateSubmit = (values: ReferenceEditorFormValues) => {
    const nowItems = loadReferences();
    const draft: ReferenceEntity = {
      id: createReferenceId(),
      ...values
    };

    saveReferences([...nowItems, draft]);
    router.push("/references?notice=created");
  };

  if (mode === "edit") {
    return null;
  }

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
        <ReferenceEditorForm
          mode="create"
          title="레퍼런스 등록"
          subtitle="새로운 네일 디자인을 라이브러리에 추가합니다."
          submitLabel="등록하기"
          onCancel={handleClose}
          onSubmit={handleCreateSubmit}
        />
      </div>
    </div>
  );
}
