"use client"
import React from 'react'
import StockPageStructure from '../components/StockPageStructure';
import { getStockCategories, getStockItems, getStockTransactions } from '@/app/utils/funcs';

export default function ManageRestauCafeteriaStock() {
    async function getCategories() {
        const data = await getStockCategories("restaurant");
        console.log(data.Categories);
        return data.Categories;
    };

    async function getItems() {
        const data = await getStockItems("restaurant");
        console.log(data.Items);
        return data.Items;
    };

    async function getTransactions() {
        const data = await getStockTransactions("restaurant");
        console.log(data.Transactions);
        return data.Transactions;
    };
    
      return (
        <div className='flex flex-col gap-12'>
            <StockPageStructure CategoriesFetchFunc={getCategories} TransactionsFetchFunc={getTransactions} ItemsFetchFunc={getItems}  />
        </div>  
        )
}
