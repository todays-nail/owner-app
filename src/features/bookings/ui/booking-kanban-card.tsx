/* eslint-disable @next/next/no-img-element */
"use client";

import {forwardRef} from "react";

import {Chip} from "@/components/ui/chip";
import type {BookingCardViewData} from "@/features/bookings/presenter/booking-view-mapper";
import {cn} from "@/lib/utils";

export interface BookingKanbanCardProps {
  card: BookingCardViewData;
}

export const BookingKanbanCard = forwardRef<HTMLElement, BookingKanbanCardProps>(
  function BookingKanbanCard({ card }, ref) {
    return (
      <article
        ref={ref}
        className={cn(
          "group rounded-xl border bg-white p-4 shadow-soft transition-all duration-200 dark:border-white/5 dark:bg-background-dark",
          "hover:-translate-y-0.5 hover:shadow-lg",
          card.stage === "in_service" && card.timeLabel.startsWith("NOW") && "border-l-[5px] border-l-orange-400",
          card.stage === "completed" && "opacity-90 hover:opacity-100"
        )}
      >
        <div className="mb-3">
          <Chip variant={card.timeChipVariant} size="xs">
            {card.timeLabel}
          </Chip>
        </div>

        <div className="flex items-start gap-3">
          <img
            src={card.imageUrl}
            alt="design"
            className={cn(
              "h-10 w-10 flex-shrink-0 rounded-full bg-slate-100 object-cover shadow-sm",
              card.stage === "completed" && "grayscale transition-all group-hover:grayscale-0"
            )}
          />
          <div>
            <h4 className="text-sm font-bold leading-tight text-slate-800 dark:text-slate-100">
              {card.customerName}
            </h4>
            <p className="mt-0.5 text-xs text-slate-500">{card.serviceName}</p>
            <div className="mt-3 flex items-center gap-1.5">
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold",
                  card.designerBadgeClassName
                )}
              >
                {card.designerInitial}
              </div>
              <span className="text-[11px] font-medium text-slate-500">{card.designerName}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/5">
          <div className="flex items-center gap-1.5">
            <Chip variant={card.statusChipVariant} size="xs">
              {card.statusLabel}
            </Chip>
            {card.secondaryStatusLabel ? (
              <Chip
                variant={card.secondaryStatusChipVariant ?? "status-default"}
                size="xs"
              >
                {card.secondaryStatusLabel}
              </Chip>
            ) : null}
          </div>
          {card.amountLabel ? (
            <span className={cn("text-xs font-bold", card.amountClassName)}>
              {card.amountLabel}
            </span>
          ) : null}
        </div>
      </article>
    );
  }
);
