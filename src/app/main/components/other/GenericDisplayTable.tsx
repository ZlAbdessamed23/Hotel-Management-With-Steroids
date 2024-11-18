"use client"

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from '@nextui-org/react';
import React from 'react'

interface TableProps<T> {
    columns: { name: string; uid: string }[];
    data: T[];
};

export default function GenericDisplayTable<T>({columns , data} : TableProps<T>) {
  return (
    <Table aria-label="Generic table with dynamic content"  classNames={{
        wrapper: "max-h-[382px] w-full overflow-x-auto data-grid-wrapper text-black dark:text-white dark:bg-slate-800",
        th: "bg-primary-500 text-black h-12",
      }}>
        <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
        </TableHeader>
        <TableBody items={data}>
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
  )
}

function formatCellValue(value: any): React.ReactNode {
    if (value instanceof Date) {
        return value.toLocaleDateString();
    }
    if (Array.isArray(value)) {
        return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
    }
    return value;
}