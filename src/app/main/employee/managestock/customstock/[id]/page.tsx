"use client"

import React from 'react'
import { getStockCategories, getStockItems, getStockTransactions } from '@/app/utils/funcs'
import StockPageStructure from '../../components/StockPageStructure';

export default function ManageMaterialStock({params} : {params : {id : string}}) {

    async function getCategories() {
        const data = await getStockCategories(params.id);
        return data.Categories;
    };

    async function getItems() {
        const data = await getStockItems(params.id);
        return data.Items;
    };

    async function getTransactions() {
        const data = await getStockTransactions(params.id);
        return data.Transactions;
    };

    return (
        <div className='flex flex-col gap-12'>
            <StockPageStructure CategoriesFetchFunc={getCategories} TransactionsFetchFunc={getTransactions} ItemsFetchFunc={getItems}  stockId={params.id}/>
        </div>
    )
}