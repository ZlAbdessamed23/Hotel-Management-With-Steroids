import React from 'react'
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/react";
import { BillTableType } from '@/app/types/types';

interface BillTableProps {
    items: BillTableType[];
}

export default function BillTable({ items }: BillTableProps) {
    const calculateTotal = (items: BillTableType[]) => {
        return items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-DZ', {
            style: 'currency',
            currency: 'DZD'
        }).format(price);
    };

    return (
        <div className="flex flex-col gap-4">
            <Table 
                removeWrapper 
                aria-label="Bill items table"
                className="min-w-full"
            >
                <TableHeader>
                    <TableColumn className="text-lg font-semibold text-secondary">Description</TableColumn>
                    <TableColumn className="text-lg font-semibold text-secondary text-center">Quantité</TableColumn>
                    <TableColumn className="text-lg font-semibold text-secondary text-center">Prix Unitaire</TableColumn>
                    <TableColumn className="text-lg font-semibold text-secondary text-center">Total</TableColumn>
                </TableHeader>
                <TableBody>
                    {items.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="text-lg">{item.description}</TableCell>
                            <TableCell className="text-lg text-center">{item.quantity}</TableCell>
                            <TableCell className="text-lg text-center">{formatPrice(item.unitPrice)}</TableCell>
                            <TableCell className="text-lg text-center">
                                {formatPrice(item.quantity * item.unitPrice)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            <div className="flex justify-end items-center gap-4 mt-4 text-xl">
                <span className="font-semibold text-secondary">Total:</span>
                <span className="font-bold text-primary">
                    {formatPrice(calculateTotal(items))}
                </span>
            </div>
        </div>
    );
}