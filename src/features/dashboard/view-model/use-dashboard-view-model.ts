"use client";

import {useState} from "react";

import {
  DASHBOARD_DESIGN_ITEMS,
  DASHBOARD_SCHEDULE_ITEMS,
  type DashboardDesignItem
} from "@/features/dashboard/model/dashboard";

type DashboardDesignItemPatch = Partial<Pick<DashboardDesignItem, "name" | "price" | "image">>;

export interface DashboardViewModel {
  designItems: DashboardDesignItem[];
  scheduleItems: typeof DASHBOARD_SCHEDULE_ITEMS;
  updateDesignItem: (id: string, patch: DashboardDesignItemPatch) => void;
}

export function useDashboardViewModel(): DashboardViewModel {
  const [designItems, setDesignItems] = useState<DashboardDesignItem[]>(() =>
    DASHBOARD_DESIGN_ITEMS.map((item) => ({...item}))
  );

  const updateDesignItem = (id: string, patch: DashboardDesignItemPatch) => {
    setDesignItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, ...patch }
          : item
      )
    );
  };

  return {
    designItems,
    scheduleItems: DASHBOARD_SCHEDULE_ITEMS,
    updateDesignItem
  };
}
