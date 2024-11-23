"use client"

import React, { useState, useMemo } from 'react'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    getKeyValue,
    Input,
    SortDescriptor,
} from '@nextui-org/react'

interface TableProps<T> {
    columns: { name: string; uid: string }[];
    data: T[] | undefined; // Allow `data` to be undefined
};

export default function HistoryTable<T extends { id: string }>({
    columns,
    data = [], // Default to an empty array
}: TableProps<T>) {
    // State for search and sorting
    const [filterValue, setFilterValue] = useState("");
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: columns[0].uid,
        direction: "ascending"
    });

    // Filtered and sorted data
    const filteredItems = useMemo(() => {
        let result = [...data]; // Safely use the fallback empty array

        // Search functionality - using only the first column
        const firstColumnKey = columns[0].uid;
        if (filterValue) {
            result = result.filter((item) => {
                const value = getKeyValue(item, firstColumnKey);
                return value
                    ? String(value).toLowerCase().includes(filterValue.toLowerCase())
                    : false;
            });
        }

        // Sorting functionality
        return result.sort((a, b) => {
            const sortColumn = sortDescriptor.column as string;
            const sortDirection = sortDescriptor.direction;

            const valueA = getKeyValue(a, sortColumn);
            const valueB = getKeyValue(b, sortColumn);

            // Advanced sorting with type-aware comparison
            if (valueA === valueB) return 0;

            // Date comparison
            if (valueA instanceof Date && valueB instanceof Date) {
                return sortDirection === 'ascending'
                    ? valueA.getTime() - valueB.getTime()
                    : valueB.getTime() - valueA.getTime();
            }

            // Numeric comparison
            if (!isNaN(Number(valueA)) && !isNaN(Number(valueB))) {
                const numA = Number(valueA);
                const numB = Number(valueB);
                return sortDirection === 'ascending'
                    ? numA - numB
                    : numB - numA;
            }

            // Fallback to string comparison
            const comparison = String(valueA ?? '').localeCompare(String(valueB ?? ''));
            return sortDirection === 'ascending' ? comparison : -comparison;
        });
    }, [data, filterValue, sortDescriptor, columns]);

    // Cell value formatting
    const formatCellValue = (value: any): React.ReactNode => {
        if (value instanceof Date) {
            return value.toLocaleDateString();
        }
        if (Array.isArray(value)) {
            return value.join(', ');
        }
        if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value);
        }
        return value ?? '';
    }

    return (
        <div className="flex flex-col gap-4">
            <Input
                isClearable
                radius="lg"
                className='w-1/2'
                classNames={{
                    label: "text-black/50 dark:text-white/90",
                    input: [
                        "bg-transparent",
                        "text-black/90 dark:text-white/90",
                        "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                    ],
                    innerWrapper: "bg-transparent",
                    inputWrapper: [
                        "shadow-xl",
                        "bg-default-200/50",
                        "dark:bg-default/60",
                        "backdrop-blur-xl",
                        "backdrop-saturate-200",
                        "hover:bg-default-200/70",
                        "dark:hover:bg-default/70",
                        "group-data-[focused=true]:bg-default-200/50",
                        "dark:group-data-[focused=true]:bg-default/60",
                        "!cursor-text",
                    ],
                }}
                placeholder="Search first column"
                value={filterValue}
                onClear={() => setFilterValue("")}
                onValueChange={setFilterValue}
            />

            <Table
                aria-label="Generic table with dynamic content"
                classNames={{
                    wrapper: "max-h-[382px] w-full overflow-x-auto data-grid-wrapper text-black dark:text-white dark:bg-slate-800",
                    th: "bg-primary-500 text-black h-12",
                }}
                sortDescriptor={sortDescriptor}
                onSortChange={(descriptor) => {
                    const safeDescriptor: SortDescriptor = {
                        column: descriptor.column ?? columns[0].uid,
                        direction: descriptor.direction ?? 'ascending'
                    };
                    setSortDescriptor(safeDescriptor);
                }}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            allowsSorting
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    items={filteredItems}
                    emptyContent={filterValue ? "No results found" : "No data available"}
                >
                    {(item) => (
                        <TableRow key={getKeyValue(item, 'id') as string}>
                            {(columnKey) => (
                                <TableCell>
                                    {formatCellValue(getKeyValue(item, columnKey))}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
