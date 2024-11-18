"use client"

import React from 'react'
import StockPageStructure from '../components/StockPageStructure'
import { getStockCategories, getStockItems, getStockTransactions } from '@/app/utils/funcs'

export default function ManageSportSpaStock() {
    async function getCategories() {
        const data = await getStockCategories("spa");
        return data.Categories;
    };

    async function getItems() {
        const data = await getStockItems("spa");
        return data.Items;
    };

    async function getTransactions() {
        const data = await getStockTransactions("spa");
        return data.Transactions;
    };

    return (
        <div className='flex flex-col gap-12'>
            <StockPageStructure  CategoriesFetchFunc={getCategories} TransactionsFetchFunc={getTransactions} ItemsFetchFunc={getItems} />
        </div>
    )
}

