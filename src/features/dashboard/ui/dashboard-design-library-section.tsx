/* eslint-disable @next/next/no-img-element */
import type {DashboardDesignItem} from "@/features/dashboard/model/dashboard";

interface DashboardDesignLibrarySectionProps {
  designItems: DashboardDesignItem[];
}

export function DashboardDesignLibrarySection({
  designItems
}: DashboardDesignLibrarySectionProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-primary/5 bg-white p-6 shadow-sm dark:bg-background-dark">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-bold">디자인 라이브러리</h3>
            <p className="text-xs text-slate-400">시즌별 카탈로그 관리</p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-primary/20 px-4 py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white"
          >
            <span className="material-icons text-sm" aria-hidden="true">
              add_photo_alternate
            </span>
            레퍼런스 등록
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {designItems.map((item) => (
            <div key={item.name} className="group relative aspect-square overflow-hidden rounded-lg">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-3">
                <p className="text-[10px] font-bold text-white">{item.name}</p>
                <p className="text-[10px] text-white/80">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
