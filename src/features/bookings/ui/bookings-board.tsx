"use client";

import {
  DndContext,
  closestCorners,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type React from "react";

import { Chip } from "@/components/ui/chip";
import {
  type BookingCardViewData,
  type BookingColumnViewData
} from "@/features/bookings/presenter/booking-view-mapper";
import type { BookingStage } from "@/features/bookings/model/types";
import { BookingKanbanCard } from "@/features/bookings/ui/booking-kanban-card";
import { cn } from "@/lib/utils";

export interface BookingsBoardViewProps {
  columns: BookingColumnViewData[];
  board: Record<BookingStage, BookingCardViewData[]>;
  activeCardStage: BookingStage | null;
  sensors: React.ComponentProps<typeof DndContext>["sensors"];
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

export function BookingsBoard({
  columns,
  board,
  activeCardStage,
  sensors,
  onDragStart,
  onDragEnd
}: BookingsBoardViewProps) {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex h-full min-w-[1220px] gap-5">
        {columns.map((column) => (
          <BookingColumnView
            key={column.id}
            column={column}
            cards={board[column.id]}
            isActiveDrop={activeCardStage ? activeCardStage !== column.id : false}
          />
        ))}
      </div>
    </DndContext>
  );
}

function BookingColumnView({
  column,
  cards,
  isActiveDrop
}: {
  column: BookingColumnViewData;
  cards: BookingCardViewData[];
  isActiveDrop: boolean;
}) {
  const droppableId = `column:${column.id}`;
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId
  });

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
        ref={setNodeRef}
        id={droppableId}
        className={cn(
          "kanban-scrollbar flex-1 space-y-3 overflow-y-auto rounded-2xl p-3",
          column.containerClassName,
          (isOver || isActiveDrop) && "ring-2 ring-primary/25 ring-inset"
        )}
      >
        <SortableContext
          items={cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <SortableBookingCardView key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>
    </section>
  );
}

function SortableBookingCardView({ card }: { card: BookingCardViewData }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver
  } = useSortable({
    id: card.id,
    disabled: card.stage === "in_service"
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  const isDragDisabled = card.stage === "in_service";

  return (
    <BookingKanbanCard
      ref={setNodeRef}
      card={card}
      style={style}
      isDragging={isDragging}
      isOver={isOver}
      isDragDisabled={isDragDisabled}
      dragHandle={
        <button
          type="button"
          aria-label={`${card.customerName} 카드 이동`}
          className={cn(
            "rounded p-1 text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
            isDragDisabled
              ? "cursor-default opacity-60"
              : "hover:text-slate-500"
          )}
          {...attributes}
          {...listeners}
        >
          <span className="material-icons text-base" aria-hidden="true">
            more_horiz
          </span>
        </button>
      }
    />
  );
}
