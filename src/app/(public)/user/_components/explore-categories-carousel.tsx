"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const chipButtonBase =
  "shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:translate-y-px";
const chipButtonActive = `${chipButtonBase} bg-primary text-white shadow-sm shadow-primary/20`;
const chipButtonInactive = `${chipButtonBase} bg-background-light text-[#171211] hover:bg-white`;

type ExploreCategoriesCarouselProps = {
  categories: string[];
  activeIndex?: number;
};

export default function ExploreCategoriesCarousel({
  categories,
  activeIndex = 0
}: ExploreCategoriesCarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    setCanScrollLeft(container.scrollLeft > 1);
    setCanScrollRight(maxScrollLeft > 1 && container.scrollLeft < maxScrollLeft - 1);
  }, []);

  const scrollToPrev = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    container.scrollBy({ left: -240, behavior: "smooth" });
  }, []);

  const scrollToNext = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    container.scrollBy({ left: 240, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    updateScrollState();
    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  return (
    <div className="relative mb-8">
      <div
        ref={containerRef}
        className="flex gap-3 overflow-x-auto pb-2 pl-11 pr-11 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category, index) => (
          <button
            key={category}
            className={index === activeIndex ? chipButtonActive : chipButtonInactive}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>

      {canScrollRight ? (
        <button
          aria-label="다음 카테고리 보기"
          className="absolute right-0 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-[#e9e3e0] bg-white text-[#6f625d] shadow-sm transition-all duration-200 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:translate-y-[calc(-50%+1px)]"
          onClick={scrollToNext}
          type="button"
        >
          <span className="material-symbols-outlined text-sm leading-none">chevron_right</span>
        </button>
      ) : null}

      {canScrollLeft ? (
        <button
          aria-label="이전 카테고리 보기"
          className="absolute left-0 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-[#e9e3e0] bg-white text-[#6f625d] shadow-sm transition-all duration-200 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:translate-y-[calc(-50%+1px)]"
          onClick={scrollToPrev}
          type="button"
        >
          <span className="material-symbols-outlined text-sm leading-none">chevron_left</span>
        </button>
      ) : null}
    </div>
  );
}
