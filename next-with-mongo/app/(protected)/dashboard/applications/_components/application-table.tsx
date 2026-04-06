"use client"

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Application } from "../../board/_components/ApplicationCard"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { cn } from "@/lib/utils"

// columns
export const applicationTableColumns: ColumnDef<Application>[] = [
    {
        accessorKey: "company",
        header: "Company",
        cell: ({ row }) => {
            const companyName = row.getValue("company") as string;

            // Return it wrapped in a bold tag (or use a Tailwind class like className="font-bold")
            return <strong>{companyName}</strong>;
        }
    },
    {
        accessorKey: "role",
        header: "Role"
    },
    {
        accessorKey: "location",
        header: "Location"
    },
    {
        accessorKey: "appliedAt",
        header: "Date Applied",
        cell: ({ row }) => {
            const date = row.getValue("appliedAt");
            if (!date) return "N/A";
            return new Date(date as string).toLocaleDateString();
        }
    },
    {
        accessorKey: "workType",
        header: "Work Type",
        cell: ({ row }) => {
            const workType = row.getValue("workType") as string;
            return (
                <Badge variant={"outline"}>
                    {workType}
                </Badge>
            )
        }
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
            const priority = row.getValue("priority") as string;
            return (
                <Badge variant={"default"} className={
                    priority === "high" ? "bg-red-300"
                        : priority === "medium" ? "bg-yellow-200"
                            : "bg-blue-200"
                }>
                    {priority}
                </Badge>
            )
        }
    },
    {
        accessorKey: "salaryRange",
        header: "Salary",
        accessorFn: (row) => {
            const min = row.salaryMin;
            const max = row.salaryMax

            const format = (num: number) => `$${num.toLocaleString('en-PH')}`;

            if (min && max) {
                return `${format(min)} - ${format(max)}`;
            } else if (min) {
                return format(min);
            } else if (max) {
                return format(max);
            }

            return "--";
        }
    },
]


// table stuff
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onSelectRow?: (row: TData) => void;  // Add this
}

export function ApplicationsTable<TData, TValue>({
    columns,
    data,
    onSelectRow
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="flex-1 min-h-0 overflow-auto rounded-md border">
            <Table className={cn(!data.length && "h-full")}>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className="bg-blue-200">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                onClick={() => onSelectRow?.(row.original)}  // Add this
                                className="cursor-pointer hover:bg-muted/50"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}