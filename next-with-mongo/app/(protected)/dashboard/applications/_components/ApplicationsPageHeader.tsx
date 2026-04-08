'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Filter } from "lucide-react";
import { AddApplicationDialog } from "../../board/_components/AddApplicationDialog";
import { Application } from "../../board/_components/ApplicationCard";
import { toast } from "sonner";
import ExcelJS from "exceljs";

interface ApplicationsPageHeaderProps {
    applications: Application[];
}

export function ApplicationsPageHeader({ applications }: ApplicationsPageHeaderProps) {
    const handleExport = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Applications", {
                views: [{ state: "frozen", ySplit: 1 }],
            });

            worksheet.columns = [
                { header: "Company", key: "company", width: 24 },
                { header: "Role", key: "role", width: 26 },
                { header: "Status", key: "status", width: 14 },
                { header: "Priority", key: "priority", width: 14 },
                { header: "Work Type", key: "workType", width: 14 },
                { header: "Location", key: "location", width: 20 },
                { header: "Salary", key: "salary", width: 22 },
                { header: "Applied Date", key: "appliedDate", width: 16 },
                { header: "Notes", key: "notes", width: 48 },
            ];

            applications.forEach((a) => {
                worksheet.addRow({
                    company: a.company ?? "",
                    role: a.role ?? "",
                    status: a.status ? a.status.toUpperCase() : "",
                    priority: a.priority ? a.priority.toUpperCase() : "",
                    workType: a.workType ?? "",
                    location: a.location ?? "",
                    salary: formatSalary(a.salaryMin, a.salaryMax),
                    appliedDate: formatDate(a.appliedAt),
                    notes: a.notes ?? "",
                });
            });

            const headerRow = worksheet.getRow(1);
            headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
            headerRow.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF1F2937" },
            };
            headerRow.alignment = { vertical: "middle", horizontal: "center" };
            headerRow.height = 22;

            worksheet.eachRow((row, rowNumber) => {
                row.alignment = { vertical: "top", horizontal: "left", wrapText: true };

                if (rowNumber > 1 && rowNumber % 2 === 0) {
                    row.eachCell((cell) => {
                        cell.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: "FFF9FAFB" },
                        };
                    });
                }

                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: "thin", color: { argb: "FFE5E7EB" } },
                        left: { style: "thin", color: { argb: "FFE5E7EB" } },
                        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
                        right: { style: "thin", color: { argb: "FFE5E7EB" } },
                    };
                });
            });

            const salaryCol = worksheet.getColumn("salary");
            salaryCol.alignment = { horizontal: "right", vertical: "top" };

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "applications.xlsx";
            link.click();
            URL.revokeObjectURL(url);

            toast.success("Applications exported");
        } catch (error) {
            console.error("Error downloading XLSX:", error);
            toast.error("Failed to download XLSX. Check console logs.");
        }
    };

    const formatDate = (value?: Date | string | null) => {
        if (!value) return "";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return "";
        return d.toLocaleDateString("en-PH", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    };

    const formatSalary = (min?: number, max?: number) => {
        const fmt = (n: number) =>
            new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
                maximumFractionDigits: 0,
            }).format(n);

        if (min && max) return fmt(min) + " - " + fmt(max);
        if (min) return fmt(min);
        if (max) return fmt(max);
        return "";
    };

    return (
        <header className="flex flex-row items-center justify-between px-(--header-px) shrink-0 bg-sidebar border-b h-(--header-height)">
            <div className="flex flex-row items-center space-x-4">
                <Input placeholder="Search applications..." />
                <Button variant={"outline"}><Filter /></Button>
            </div>

            <div className="flex flex-row space-x-2">
                <Button
                    className="flex flex-row items-center px-2"
                    variant={"outline"}
                    onClick={handleExport}
                    disabled={applications.length < 1}
                >
                    <Download />
                    <span>Export</span>
                </Button>
                <AddApplicationDialog />
            </div>
        </header>
    );
}