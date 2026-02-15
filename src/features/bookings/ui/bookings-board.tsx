"use client";

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useState } from "react";

import {
  BOOKING_COLUMNS,
  BookingCard,
  BookingColumn,
  BookingStage,
  INITIAL_BOOKING_CARDS
} from "@/features/bookings/model/bookings";
import { BookingKanbanCard } from "@/features/bookings/ui/booking-kanban-card";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/utils";

export interface BookingsBoardProps {
  initialCards?: BookingCard[];
}

type BoardState = Record<BookingStage, BookingCard[]>;

function toBoardState(cards: BookingCard[]): BoardState {
  return {
    deposit_pending: cards.filter((card) => card.stage === "deposit_pending"),
    in_service: cards.filter((card) => card.stage === "in_service"),
    payment_pending: cards.filter((card) => card.stage === "payment_pending"),
    completed: cards.filter((card) => card.stage === "completed")
  };
}

function findCardLocation(board: BoardState, id: string) {
  for (const stage of Object.keys(board) as BookingStage[]) {
    const index = board[stage].findIndex((card) => card.id === id);
    if (index !== -1) {
      return { stage, index };
    }
  }
  return null;
}

function parseDropTarget(board: BoardState, overId: string) {
  if (overId.startsWith("column:")) {
    const stage = overId.replace("column:", "") as BookingStage;
    return { stage, index: board[stage].length };
  }

  const location = findCardLocation(board, overId);
  if (!location) {
    return null;
  }

  return location;
}

export function BookingsBoard({ initialCards = INITIAL_BOOKING_CARDS }: BookingsBoardProps) {
  const [board, setBoard] = useState<BoardState>(() => toBoardState(initialCards));
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // Keep board data deterministic in dev/HMR and when initial snapshot changes.
  useEffect(() => {
    setBoard(toBoardState(initialCards));
    setActiveCardId(null);
  }, [initialCards]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const activeCard = useMemo(() => {
    if (!activeCardId) {
      return null;
    }

    const location = findCardLocation(board, activeCardId);
    return location ? board[location.stage][location.index] : null;
  }, [activeCardId, board]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveCardId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCardId(null);

    if (!over) {
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    setBoard((current) => {
      const source = findCardLocation(current, activeId);
      if (!source) {
        return current;
      }

      const target = parseDropTarget(current, overId);
      if (!target) {
        return current;
      }

      if (source.stage === target.stage) {
        const nextCards = [...current[source.stage]];
        const targetIndex = overId.startsWith("column:")
          ? nextCards.length - 1
          : target.index;

        if (targetIndex === source.index || targetIndex < 0) {
          return current;
        }

        return {
          ...current,
          [source.stage]: arrayMove(nextCards, source.index, targetIndex)
        };
      }

      const sourceCards = [...current[source.stage]];
      const targetCards = [...current[target.stage]];
      const [moved] = sourceCards.splice(source.index, 1);

      const movedCard: BookingCard = {
        ...moved,
        stage: target.stage
      };

      const insertAt = overId.startsWith("column:") ? targetCards.length : target.index;
      targetCards.splice(insertAt, 0, movedCard);

      return {
        ...current,
        [source.stage]: sourceCards,
        [target.stage]: targetCards
      };
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full min-w-[1220px] gap-5">
        {BOOKING_COLUMNS.map((column) => (
          <BookingColumnView
            key={column.id}
            column={column}
            cards={board[column.id]}
            isActiveDrop={activeCard ? activeCard.stage !== column.id : false}
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
  column: BookingColumn;
  cards: BookingCard[];
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

function SortableBookingCardView({ card }: { card: BookingCard }) {
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
