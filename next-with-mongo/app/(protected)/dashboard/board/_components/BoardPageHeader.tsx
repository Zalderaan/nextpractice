'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Filter, TableOfContents, } from "lucide-react"
import { AddApplicationDialog } from "./AddApplicationDialog"
import Link from 'next/link'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox" // ADDED Checkbox import
import { PRIORITIES, WORK_TYPES, WorkType } from "../types/application.types"
import { Label } from "@/components/ui/label"
import { Toggle } from "@/components/ui/toggle"
import { useState } from "react"

export function BoardPageHeader() {
    const [isInactiveHidden, setIsInactiveHidden] = useState<boolean>(false);
    const [selectedWorkTypes, setSelectedWorkTypes] = useState<WorkType[]>([]);
    const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

    return (
        <header className="flex flex-row items-center justify-between px-(--header-px) shrink-0 bg-sidebar border-b h-(--header-height)">
            <div className='flex flex-row items-center space-x-4'>
                <Input placeholder="Search applications..." />
                <FilterMenu selectedPriorities={selectedPriorities} setSelectedPriorities={setSelectedPriorities} selectedWorkTypes={selectedWorkTypes} setSelectedWorkTypes={setSelectedWorkTypes} />
                <HideInactive isHidden={isInactiveHidden} setIsInactiveHidden={setIsInactiveHidden} />
            </div>

            <div className="flex flex-row space-x-2">
                <Button asChild className="flex flex-row items-center px-2" variant={'outline'}>
                    <Link href={'applications/'}>
                        <TableOfContents />
                        <span>View Applications</span>
                    </Link>
                </Button>
                <AddApplicationDialog />
            </div>
        </header>
    )
}

function HideInactive({ isHidden, setIsInactiveHidden }: { isHidden: boolean, setIsInactiveHidden: (value: boolean) => void }) {
    return (
        <Button asChild size={"sm"} variant="outline" className="text-xs cursor-pointer">
            <Toggle aria-label="toggle-hide-inactive" onClick={() => setIsInactiveHidden(!isHidden)}>
                {isHidden ? <Eye /> : <EyeOff />}
                <span>Hide inactive</span>
            </Toggle>
        </Button>
    )
}

interface FilterProps {
    selectedWorkTypes: WorkType[];
    setSelectedWorkTypes: (types: WorkType[]) => void;
    selectedPriorities: string[];
    setSelectedPriorities: (priorities: string[]) => void;
}

function FilterMenu({ selectedWorkTypes, setSelectedWorkTypes, selectedPriorities, setSelectedPriorities }: FilterProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={'outline'}><Filter /></Button>
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                sideOffset={5}
                align="start"
                className="space-y-3"
            >
                <FilterMenuItems
                    selectedWorkTypes={selectedWorkTypes}
                    setSelectedWorkTypes={setSelectedWorkTypes}
                    selectedPriorities={selectedPriorities}
                    setSelectedPriorities={setSelectedPriorities}
                />

                <div className="flex flex-row space-x-2 w-full">
                    <Button variant={"outline"} className="flex-1" onClick={() => { setSelectedWorkTypes([]); setSelectedPriorities([]); }}>Clear</Button>
                    <Button variant={"default"} className="flex-1">Apply</Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

function FilterMenuItems({ selectedWorkTypes, setSelectedWorkTypes, selectedPriorities, setSelectedPriorities }: FilterProps) {
    return (
        <div className="flex flex-col w-full space-y-4">
            <WorkTypeCheckboxes selected={selectedWorkTypes} onChange={setSelectedWorkTypes} />
            <PriorityCheckboxes selected={selectedPriorities} onChange={setSelectedPriorities} />
        </div>
    )
}

// Replace radio groups with checkbox groups
function WorkTypeCheckboxes({ selected, onChange }: { selected: WorkType[], onChange: (types: WorkType[]) => void }) {
    const handleChange = (worktype: WorkType, checked: boolean) => {
        if (checked) {
            onChange([...selected, worktype]);
        } else {
            onChange(selected.filter(t => t !== worktype));
        }
    };

    return (
        <div className="flex flex-col space-y-2">
            <span className="text-xs text-muted-foreground">Work Type</span>
            <div className="flex flex-row items-center justify-start space-x-4">
                {WORK_TYPES.map((worktype) => (
                    <div key={worktype} className="flex items-center gap-2">
                        <Checkbox
                            id={worktype}
                            checked={selected.includes(worktype)}
                            onCheckedChange={(checked) => handleChange(worktype, checked as boolean)}
                        />
                        <Label htmlFor={worktype} className="text-xs font-normal">{worktype}</Label>
                    </div>
                ))}
            </div>
        </div>
    )
}

function PriorityCheckboxes({ selected, onChange }: { selected: string[], onChange: (priorities: string[]) => void }) {
    const handleChange = (priority: string, checked: boolean) => {
        if (checked) {
            onChange([...selected, priority]);
        } else {
            onChange(selected.filter(p => p !== priority));
        }
    };

    return (
        <div className="flex flex-col space-y-2">
            <span className="text-xs text-muted-foreground">Priority</span>
            <div className="flex flex-row items-center justify-start space-x-4">
                {PRIORITIES.map((prio) => (
                    <div key={prio} className="flex items-center gap-2">
                        <Checkbox
                            id={prio}
                            checked={selected.includes(prio)}
                            onCheckedChange={(checked) => handleChange(prio, checked as boolean)}
                        />
                        <Label htmlFor={prio} className="text-xs font-normal">{prio}</Label>
                    </div>
                ))}
            </div>
        </div>
    )
}