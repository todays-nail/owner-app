"use client";

import {DASHBOARD_SCHEDULE_ITEMS} from "@/features/dashboard/model/dashboard";

export interface DashboardViewModel {
  scheduleItems: typeof DASHBOARD_SCHEDULE_ITEMS;
}

export function useDashboardViewModel(): DashboardViewModel {
  return {
    scheduleItems: DASHBOARD_SCHEDULE_ITEMS
  };
}
