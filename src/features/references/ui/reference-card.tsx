/* eslint-disable @next/next/no-img-element */
import {cn} from "@/lib/utils";
import type {DesignReference} from "@/features/references/model/references";

export interface ReferenceCardProps {
  item: DesignReference;
  visible: boolean;
  readOnly?: boolean;
  toggleDisabled?: boolean;
  editDisabled?: boolean;
  deleteDisabled?: boolean;
  onOpenDetail: (id: string) => void;
  onToggleVisible: (id: string, nextValue: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatKrw(price: number) {
  return `${new Intl.NumberFormat("ko-KR").format(price)}원`;
}

function formatCount(count: number) {
  return new Intl.NumberFormat("ko-KR").format(count);
}

function clampDiscountRate(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function deriveDiscountRate(price: number, finalPrice: number): number {
  if (!Number.isFinite(price) || price <= 0) {
    return 0;
  }

  const ratio = (1 - finalPrice / price) * 100;
  return clampDiscountRate(Math.round(ratio));
}

export function ReferenceCard({
  item,
  visible,
  readOnly = false,
  toggleDisabled = false,
  editDisabled = false,
  deleteDisabled = false,
  onOpenDetail,
  onToggleVisible,
  onEdit,
  onDelete
}: ReferenceCardProps) {
  const isToggleDisabled = readOnly || toggleDisabled;
  const isEditDisabled = readOnly || editDisabled;
  const isDeleteDisabled = readOnly || deleteDisabled;
  const likeCount = item.likeCount ?? 0;
  const likeCountText = formatCount(likeCount);
  const basePrice = Number.isFinite(item.price) ? Math.max(0, Math.floor(item.price)) : 0;
  const finalPrice = Number.isFinite(item.finalPrice)
    ? Math.max(0, Math.min(basePrice, Math.floor(item.finalPrice)))
    : basePrice;
  const discountRate = deriveDiscountRate(basePrice, finalPrice);

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
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
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
                "absolute right-2 top-2 rounded-lg px-1.5 py-0.5 text-[10px] font-bold text-white",
                item.badge === "NEW" ? "bg-primary shadow-sm" : "bg-black/40 backdrop-blur-md"
              )}
            >
              {item.badge}
            </div>
          ) : null}
          <div
            className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm"
            aria-label={`좋아요 ${likeCountText}건`}
          >
            <span className="material-icons text-xs leading-none text-rose-400" aria-hidden="true">
              favorite
            </span>
            <span>{likeCountText}</span>
          </div>
        </div>

        <div className="p-3 pb-2">
          <h3
            className={cn(
              "mb-1.5 truncate text-sm font-semibold dark:text-white",
              visible ? "text-gray-900" : "text-gray-500 dark:text-gray-400"
            )}
          >
            {item.name}
          </h3>

          <div className="mb-2 flex flex-wrap gap-1">
            {item.categories.map((category) => (
              <span
                key={category}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  visible
                    ? "bg-chip-bg text-chip-text"
                    : "bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-400"
                )}
              >
                {category}
              </span>
            ))}
          </div>

          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="text-xs text-gray-400">노출 가격</span>
            <span
              className={cn(
                "text-base font-bold",
                visible ? "text-primary" : "text-gray-400"
              )}
            >
              {formatKrw(finalPrice)}
            </span>
            {discountRate > 0 ? (
              <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
                {discountRate}%
              </span>
            ) : null}
          </div>

          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-xs text-gray-400">가격</span>
            <span
              className={cn(
                "text-sm",
                visible ? "text-gray-400 line-through" : "text-gray-400"
              )}
            >
              {formatKrw(basePrice)}
            </span>
          </div>
        </div>
      </button>

      <div className="px-3 pb-3">
        <div className="flex items-center justify-between border-t border-gray-100 pt-2 dark:border-gray-700">
          <button
            type="button"
            role="switch"
            aria-checked={visible}
            aria-label={`${item.name} ${visible ? "비노출" : "노출"} 전환`}
            onClick={() => {
              if (isToggleDisabled) return;
              onToggleVisible(item.id, !visible);
            }}
            disabled={isToggleDisabled}
            aria-disabled={isToggleDisabled}
            className={cn(
              "inline-flex items-center gap-2",
              isToggleDisabled ? "cursor-not-allowed opacity-50" : ""
            )}
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
              disabled={isEditDisabled}
              aria-disabled={isEditDisabled}
              className={cn(
                "rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-primary/5 hover:text-primary",
                isEditDisabled
                  ? "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-gray-400"
                  : ""
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
              disabled={isDeleteDisabled}
              aria-disabled={isDeleteDisabled}
              className={cn(
                "rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500",
                isDeleteDisabled
                  ? "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-gray-400"
                  : ""
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
