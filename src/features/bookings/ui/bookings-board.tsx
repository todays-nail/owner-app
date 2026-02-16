"use client";

import {Chip} from "@/components/ui/chip";
import {type BookingCardViewData, type BookingColumnViewData} from "@/features/bookings/presenter/booking-view-mapper";
import type {BookingStage} from "@/features/bookings/model/types";
import {BookingKanbanCard} from "@/features/bookings/ui/booking-kanban-card";
import {cn} from "@/lib/utils";

export interface BookingsBoardViewProps {
  columns: BookingColumnViewData[];
  board: Record<BookingStage, BookingCardViewData[]>;
}

export function BookingsBoard({ columns, board }: BookingsBoardViewProps) {
  return (
    <div className="flex h-full min-w-[1220px] gap-5">
      {columns.map((column) => (
        <BookingColumnView
          key={column.id}
          column={column}
          cards={board[column.id]}
        />
      ))}
    </div>
  );
}

function BookingColumnView({
  column,
  cards
}: {
  column: BookingColumnViewData;
  cards: BookingCardViewData[];
}) {
  return (
    <section className="flex h-full min-w-[290px] flex-1 flex-col">
      <div className="mb-4 flex items-center justify-between px-1">
        <h3 className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-slate-200">
          <span className={cn("h-2 w-2 rounded-full", column.dotClassName)} />
          {column.title}
        </h3>
        <Chip variant={column.countChipVariant} size="xs">
          {cards.length}
        </Chip>
      </div>

      <div
        className={cn(
          "kanban-scrollbar flex-1 space-y-3 overflow-y-auto rounded-2xl p-3",
          column.containerClassName
        )}
      >
        {cards.map((card) => (
          <BookingKanbanCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
