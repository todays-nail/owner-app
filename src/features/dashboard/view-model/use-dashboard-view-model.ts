"use client";

import {
  DASHBOARD_DESIGN_ITEMS,
  DASHBOARD_SCHEDULE_ITEMS
} from "@/features/dashboard/model/dashboard";

export interface DashboardViewModel {
  designItems: typeof DASHBOARD_DESIGN_ITEMS;
  scheduleItems: typeof DASHBOARD_SCHEDULE_ITEMS;
}

export function useDashboardViewModel(): DashboardViewModel {
  return {
    designItems: DASHBOARD_DESIGN_ITEMS,
    scheduleItems: DASHBOARD_SCHEDULE_ITEMS
  };
}
