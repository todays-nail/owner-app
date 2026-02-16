/* eslint-disable @next/next/no-img-element */
"use client";

import {useMemo, useState} from "react";
import {useRouter} from "next/navigation";

import {BaseModal} from "@/components/ui/base-modal";
import type {DesignReference} from "@/features/references/model/references";
import {ReferenceDetailPanel} from "@/features/references/ui/reference-detail-panel";

interface DashboardDesignLibrarySectionProps {
  references: DesignReference[];
}

function formatKrw(price: number): string {
  return `₩${new Intl.NumberFormat("ko-KR").format(price)}`;
}

export function DashboardDesignLibrarySection({ references }: DashboardDesignLibrarySectionProps) {
  const router = useRouter();
  const [selectedReferenceId, setSelectedReferenceId] = useState<string | null>(null);

  const selectedReference = useMemo(
    () => references.find((item) => item.id === selectedReferenceId) ?? null,
    [references, selectedReferenceId]
  );

  const handleOpenCreate = () => {
    router.push("/references?modal=create");
  };

  const handleOpenDetail = (id: string) => {
    setSelectedReferenceId(id);
  };

  const handleCloseDetail = () => {
    setSelectedReferenceId(null);
  };

  const hasReferences = references.length > 0;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-primary/5 bg-white p-6 shadow-sm dark:bg-background-dark">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-bold">디자인 관리</h3>
            <p className="text-xs text-slate-400">노출중 레퍼런스 조회</p>
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

        {hasReferences ? (
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
              레퍼런스 관리에서 디자인을 등록하거나 노출 상태를 변경해 주세요.
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-primary/90"
            >
              <span className="material-icons text-sm" aria-hidden="true">
                open_in_new
              </span>
              레퍼런스 등록하러 가기
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
            canEdit={false}
          />
        ) : null}
        <p id="dashboard-design-detail-description" className="sr-only">
          대시보드 디자인 상세 정보를 확인하는 모달입니다.
        </p>
      </BaseModal>
    </div>
  );
}
