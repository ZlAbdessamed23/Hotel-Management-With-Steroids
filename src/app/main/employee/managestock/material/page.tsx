"use client"

import React from 'react'
import StockPageStructure from '../components/StockPageStructure'
import { getStockCategories, getStockItems, getStockTransactions } from '@/app/utils/funcs'

export default function ManageMaterialStock() {

    async function getCategories() {
        const data = await getStockCategories("material");
        return data.Categories;
    };

    async function getItems() {
        const data = await getStockItems("material");
        return data.Items;
    };

    async function getTransactions() {
        const data = await getStockTransactions("material");
        return data.Transactions;
    };

    return (
        <div className='flex flex-col gap-12'>
            <StockPageStructure CategoriesFetchFunc={getCategories} TransactionsFetchFunc={getTransactions} ItemsFetchFunc={getItems} />
        </div>
    )
}