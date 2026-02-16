/* eslint-disable @next/next/no-img-element */
import type {DesignReference} from "@/features/references/model/references";

interface ReferenceDetailPanelProps {
  item: DesignReference;
  titleId?: string;
  onClose: () => void;
  onRequestEdit?: () => void;
  canEdit?: boolean;
}

function formatKrw(price: number) {
  return `${new Intl.NumberFormat("ko-KR").format(price)}원`;
}

function formatDuration(durationMinutes: number | null) {
  return durationMinutes === null ? "미설정" : `${durationMinutes}분`;
}

export function ReferenceDetailPanel({
  item,
  titleId,
  onClose,
  onRequestEdit,
  canEdit = true
}: ReferenceDetailPanelProps) {
  return (
    <section className="relative mx-auto flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-gray-700 dark:bg-surface-dark">
      <header className="z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5 dark:border-gray-800 dark:bg-surface-dark">
        <div>
          <h2 id={titleId} className="text-xl font-bold text-gray-900 dark:text-white">
            레퍼런스 상세
          </h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            등록된 디자인 정보를 확인할 수 있습니다.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          aria-label="상세 모달 닫기"
        >
          <span className="material-icons" aria-hidden="true">
            close
          </span>
        </button>
      </header>

      <div className="custom-scrollbar overflow-y-auto p-6 md:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="lg:col-span-5">
            <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">대표 이미지</p>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
              <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
            </div>

            {item.imageUrls.length > 1 ? (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {item.imageUrls.slice(1).map((url) => (
                  <div
                    key={url}
                    className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <img src={url} alt="추가 이미지" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          <section className="space-y-6 lg:col-span-7">
            <div>
              <p className="mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">디자인 이름</p>
              <p className="rounded-lg border border-gray-200 bg-gray-50/70 px-4 py-2.5 text-gray-900 dark:border-gray-700 dark:bg-surface-dark dark:text-white">
                {item.name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">스타일 태그</p>
              {item.categories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {item.categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-surface-dark dark:text-gray-300"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-gray-200 bg-gray-50/70 px-4 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-surface-dark dark:text-gray-400">
                  등록된 태그가 없습니다.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">기본 가격 (KRW)</p>
                <p className="rounded-lg border border-gray-200 bg-gray-50/70 px-4 py-2.5 text-gray-900 dark:border-gray-700 dark:bg-surface-dark dark:text-white">
                  {formatKrw(item.price)}
                </p>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">시술 시간 (분)</p>
                <p className="rounded-lg border border-gray-200 bg-gray-50/70 px-4 py-2.5 text-gray-900 dark:border-gray-700 dark:bg-surface-dark dark:text-white">
                  {formatDuration(item.durationMinutes)}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">디자인 설명</p>
              <p className="min-h-24 whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50/70 px-4 py-3 text-gray-900 dark:border-gray-700 dark:bg-surface-dark dark:text-white">
                {item.description || "설명이 없습니다."}
              </p>
            </div>
          </section>
        </div>
      </div>

      <footer className="z-10 flex items-center justify-end gap-2 border-t border-gray-100 bg-white px-6 py-5 dark:border-gray-800 dark:bg-surface-dark">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          닫기
        </button>
        <button
          type="button"
          onClick={() => {
            if (!canEdit || !onRequestEdit) return;
            onRequestEdit();
          }}
          disabled={!canEdit}
          aria-disabled={!canEdit}
          className="rounded-lg bg-primary px-8 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/60 disabled:opacity-70"
        >
          {canEdit ? "수정하기" : "편집 준비중"}
        </button>
      </footer>
    </section>
  );
}
