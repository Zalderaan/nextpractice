"use client"
import { useDashboardStore, PERIODS } from "../_stores/dashboard.store"

export function DashboardPeriodSelector() {
    const { globalPeriod, setGlobalPeriod } = useDashboardStore()
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Period</span>
            <div className="flex gap-0.5 bg-background border border-border rounded-full p-0.5">
                {PERIODS.map(({ label, months }) => (
                    <button
                        key={label}
                        onClick={() => setGlobalPeriod(months)}
                        className={`px-3 py-1 rounded-full text-xs transition-colors ${globalPeriod === months
                            ? "border border-border text-foreground font-medium"
                            : "text-muted-foreground hover:bg-muted"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    )
}