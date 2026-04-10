"use client"

import { useMemo, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Rectangle } from 'recharts';
import { useDashboardStore } from "../_stores/dashboard.store"
import { Application } from "../board/types/application.types"

interface ApplicationsOverTimeProps {
    applications: Application[]
}
function toValidDate(value: string | Date | null | undefined): Date | null {
    if (!value) return null
    const d = value instanceof Date ? value : new Date(value)
    return Number.isNaN(d.getTime()) ? null : d
}

function groupByMonth(apps: Application[], monthsBack: number) {
    const now = new Date()
    const startDate = monthsBack === 0
        ? apps.reduce<Date>((min, a) => {
            const d = toValidDate(a.appliedAt)
            if (!d) return min
            return d < min ? d : min
        }, now)
        : new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1)

    const buckets: Record<string, number> = {}
    const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    while (cursor <= now) {
        const key = cursor.toLocaleString("default", { month: "short", year: "2-digit" })
        buckets[key] = 0
        cursor.setMonth(cursor.getMonth() + 1)
    }

    apps.forEach((app) => {
        const d = toValidDate(app.appliedAt)
        if (!d || d < startDate) return
        const key = d.toLocaleString("default", { month: "short", year: "2-digit" })
        if (key in buckets) buckets[key]++
    })

    return Object.entries(buckets).map(([month, count]) => ({ month, count }))
}

const PERIOD_LABEL: Record<number, string> = {
    3: "3m", 6: "6m", 12: "12m", 0: "All",
}

export function ApplicationsOverTime({ applications }: ApplicationsOverTimeProps) {
    const globalPeriod = useDashboardStore((s) => s.globalPeriod)
    const data = useMemo(() => groupByMonth(applications, globalPeriod), [applications, globalPeriod])

    const total = data.reduce((sum, d) => sum + d.count, 0)
    const peak = Math.max(...data.map((d) => d.count))

    const renderBarShape = (props: any) => {
        const { x, y, width, height, payload } = props
        const isPeak = payload.count === peak && peak > 0

        return (
            <Rectangle
                x={x}
                y={y}
                width={width}
                height={height}
                radius={[3, 3, 0, 0]}
                fill={isPeak ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground) / 0.25)"}
            />
        )
    }

    return (
        <Card className="w-full h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle>Applications over time</CardTitle>
                    <p className="text-2xl font-medium mt-1">{total}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
                        <path d="M6 3v3l2 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                    {PERIOD_LABEL[globalPeriod]}
                </div>
            </CardHeader>

            <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data} barCategoryGap="30%">
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            interval={globalPeriod === 0 || globalPeriod > 12 ? "preserveStartEnd" : 0}
                        />
                        <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            width={24}
                        />
                        <Tooltip
                            cursor={{ fill: "hsl(var(--muted))" }}
                            content={({ active, payload, label }) => {
                                if (!active || !payload?.length) return null
                                return (
                                    <div className="bg-background border border-border rounded-md px-3 py-2 text-xs shadow-sm">
                                        <p className="text-muted-foreground mb-0.5">{label}</p>
                                        <p className="font-medium">{payload[0].value} application{payload[0].value !== 1 ? "s" : ""}</p>
                                    </div>
                                )
                            }}
                        />
                        <Bar dataKey="count" shape={renderBarShape} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}