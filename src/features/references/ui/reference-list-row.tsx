/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import type { DesignReference } from "@/features/references/model/references";

export interface ReferenceListRowProps {
  item: DesignReference;
  visible: boolean;
  onToggleVisible: (id: string, nextValue: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatKrw(price: number) {
  return `${new Intl.NumberFormat("ko-KR").format(price)}원`;
}

export function ReferenceListRow({
  item,
  visible,
  onToggleVisible,
  onEdit,
  onDelete
}: ReferenceListRowProps) {
  return (
    <article
      className={cn(
        "group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 dark:border-gray-800 dark:bg-surface-dark sm:p-5",
        visible ? "hover:shadow-lg" : "opacity-75 hover:opacity-100 hover:shadow-lg"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative h-24 w-full flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-20 sm:w-28">
          <img
            src={item.imageUrl}
            alt={item.name}
            className={cn(
              "h-full w-full object-cover transition-all duration-500",
              visible ? "group-hover:scale-105" : "grayscale group-hover:grayscale-0"
            )}
          />
          {item.badge ? (
            <div
              className={cn(
                "absolute right-2 top-2 rounded-md px-2 py-1 text-[10px] font-bold text-white",
                item.badge === "NEW" ? "bg-primary shadow-sm" : "bg-black/40 backdrop-blur-md"
              )}
            >
              {item.badge}
            </div>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "truncate text-base font-bold dark:text-white",
              visible ? "text-gray-900" : "text-gray-500 dark:text-gray-400"
            )}
          >
            {item.name}
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
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
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="flex items-baseline gap-2 sm:flex-col sm:items-end sm:gap-0.5">
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

          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={visible}
              aria-label={`${item.name} ${visible ? "비노출" : "노출"} 전환`}
              onClick={() => onToggleVisible(item.id, !visible)}
              className="inline-flex items-center gap-2"
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
                className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-primary/5 hover:text-primary"
              >
                <span className="material-icons text-lg" aria-hidden="true">
                  edit
                </span>
              </button>
              <button
                type="button"
                aria-label={`${item.name} 삭제`}
                onClick={() => onDelete(item.id)}
                className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <span className="material-icons text-lg" aria-hidden="true">
                  delete
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
