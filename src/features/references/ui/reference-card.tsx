/* eslint-disable @next/next/no-img-element */
import {cn} from "@/lib/utils";
import type {DesignReference} from "@/features/references/model/references";

export interface ReferenceCardProps {
  item: DesignReference;
  visible: boolean;
  readOnly?: boolean;
  onOpenDetail: (id: string) => void;
  onToggleVisible: (id: string, nextValue: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatKrw(price: number) {
  return `${new Intl.NumberFormat("ko-KR").format(price)}원`;
}

export function ReferenceCard({
  item,
  visible,
  readOnly = false,
  onOpenDetail,
  onToggleVisible,
  onEdit,
  onDelete
}: ReferenceCardProps) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 dark:border-gray-800 dark:bg-surface-dark",
        visible
          ? "hover:-translate-y-1 hover:shadow-xl"
          : "opacity-75 hover:opacity-100 hover:shadow-xl"
      )}
    >
      <button
        type="button"
        onClick={() => onOpenDetail(item.id)}
        aria-label={`${item.name} 상세보기`}
        className="w-full text-left focus-visible:outline-none"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={item.imageUrl}
            alt={item.name}
            className={cn(
              "h-full w-full object-cover transition-all duration-700",
              visible ? "group-hover:scale-110" : "grayscale group-hover:grayscale-0"
            )}
          />
          {item.badge ? (
            <div
              className={cn(
                "absolute right-3 top-3 rounded-lg px-2 py-1 text-[10px] font-bold text-white",
                item.badge === "NEW" ? "bg-primary shadow-sm" : "bg-black/40 backdrop-blur-md"
              )}
            >
              {item.badge}
            </div>
          ) : null}
        </div>

        <div className="p-4 pb-3">
          <h3
            className={cn(
              "mb-2 truncate text-base font-bold dark:text-white",
              visible ? "text-gray-900" : "text-gray-500 dark:text-gray-400"
            )}
          >
            {item.name}
          </h3>

          <div className="mb-3 flex flex-wrap gap-1.5">
            {item.categories.map((category) => (
              <span
                key={category}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                  visible
                    ? "bg-chip-bg text-chip-text"
                    : "bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-400"
                )}
              >
                {category}
              </span>
            ))}
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-xs text-gray-400">기본가</span>
            <span
              className={cn(
                "text-lg font-bold",
                visible ? "text-primary" : "text-gray-400"
              )}
            >
              {formatKrw(item.price)}
            </span>
          </div>
        </div>
      </button>

      <div className="px-4 pb-4">
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
          <button
            type="button"
            role="switch"
            aria-checked={visible}
            aria-label={`${item.name} ${visible ? "비노출" : "노출"} 전환`}
            onClick={() => {
              if (readOnly) return;
              onToggleVisible(item.id, !visible);
            }}
            disabled={readOnly}
            aria-disabled={readOnly}
            className={cn("inline-flex items-center gap-2", readOnly ? "cursor-not-allowed opacity-50" : "")}
          >
            <span
              className={cn(
                "relative h-5 w-9 overflow-hidden rounded-full transition-colors",
                visible ? "bg-primary" : "bg-gray-200 dark:bg-gray-600"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-[left]",
                  visible ? "left-[18px]" : "left-0.5"
                )}
              />
            </span>
            <span
              className={cn(
                "text-xs font-medium",
                visible ? "text-gray-600 dark:text-gray-300" : "text-gray-400"
              )}
            >
              {visible ? "노출" : "비노출"}
            </span>
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label={`${item.name} 수정`}
              onClick={() => onEdit(item.id)}
              disabled={readOnly}
              aria-disabled={readOnly}
              className={cn(
                "rounded-xl p-2 text-gray-400 transition-colors hover:bg-primary/5 hover:text-primary",
                readOnly ? "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-gray-400" : ""
              )}
            >
              <span className="material-icons text-lg" aria-hidden="true">
                edit
              </span>
            </button>
            <button
              type="button"
              aria-label={`${item.name} 삭제`}
              onClick={() => onDelete(item.id)}
              disabled={readOnly}
              aria-disabled={readOnly}
              className={cn(
                "rounded-xl p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500",
                readOnly ? "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-gray-400" : ""
              )}
            >
              <span className="material-icons text-lg" aria-hidden="true">
                delete
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
