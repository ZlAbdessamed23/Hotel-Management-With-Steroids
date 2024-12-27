"use client"

import React, { useEffect, useState } from 'react'
import StockHeroSection from './components/StockHeroSection'
import { StockBarChartsDataType, StockDashboardData, StockDonutChartsDataType, SuppliersDataType, ThirdCardItemType } from '@/app/types/types'
import { TbLayoutDashboard } from 'react-icons/tb'
import LineChart from './components/StockLineChart'
import StockDonutChart from './components/StockDonutChart'
import StockBarChart from './components/StockBarChart'
import BudgetCmp from './components/Budget'
import Suppliers from './components/Suppliers'
import { getStockData } from '@/app/utils/funcs'
import { StockTransactionType } from '@/app/types/constants'
import { RefreshMenuProvider } from '../../components/RefreshTriggerContext'

export default function ManageCentralStock() {
  const [stockData, setStockData] = useState<StockDashboardData>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const mappedBudgets = stockData ? stockData.budgets.map(budget => {
    const matchingStock = stockData.stocks.find(stock => stock.id === budget.stockId);
    return {
      id: budget.id,
      stockId: budget.stockId,
      amount: budget.amount,
      stockName: matchingStock?.name || 'Unknown Stock'
    };
  }) : [];

  const purchaseTransactionCount = stockData?.transactions.filter((transaction) =>
    transaction.type === StockTransactionType.purchase
  ).length || 0;

  const donutChartData: StockDonutChartsDataType = {
    name: 'Stock Data',
    value1: (stockData?.transactions.length || 0) - purchaseTransactionCount,
    value2: purchaseTransactionCount || 0,
  };

  async function getStockStat() {
    const data = await getStockData();
    setStockData(data.data);
  };

  async function test(): Promise<Array<ThirdCardItemType>> {
    const stockItems = stockData?.items || [];
    const totalQuantity = stockItems.reduce((total, item) => total + item.quantity, 0);

    // Find item with biggest quantity across all stocks
    const biggestQuantityItem = stockItems.length > 0
      ? stockItems.reduce((maxItem, currentItem) =>
        currentItem.quantity > maxItem.quantity ? currentItem : maxItem
        , stockItems[0])
      : null;

    const biggestQuantityPercentage = biggestQuantityItem
      ? (biggestQuantityItem.quantity / totalQuantity) * 100
      : 0;

    // Category analysis across all stocks
    const categoryCountMap: { [categoryName: string]: number } = {};
    stockItems.forEach((item) => {
      const categoryName = item.category.name;
      categoryCountMap[categoryName] = (categoryCountMap[categoryName] || 0) + 1;
    });

    const categoryEntries = Object.entries(categoryCountMap);
    const mostMentionedCategory = categoryEntries.length > 0
      ? categoryEntries.reduce((a, b) =>
        categoryCountMap[a[0]] > categoryCountMap[b[0]] ? a : b
      )[0]
      : "";

    const mostMentionedCategoryCount = categoryCountMap[mostMentionedCategory] || 0;
    const mostMentionedCategoryPercentage = stockItems.length > 0
      ? (mostMentionedCategoryCount / stockItems.length) * 100
      : 0;

    // Needed items analysis across all stocks
    const neededItems = stockItems.filter((item) => item.isNeeded);
    const isNeededLowestItem = neededItems.length > 0
      ? neededItems.reduce((minItem, currentItem) =>
        currentItem.quantity < minItem.quantity ? currentItem : minItem
        , neededItems[0])
      : null;

    const totalNeededQuantity = neededItems.reduce((total, item) => total + item.quantity, 0);
    const isNeededLowestItemPercentage = isNeededLowestItem && totalNeededQuantity > 0
      ? (isNeededLowestItem.quantity / totalNeededQuantity) * 100
      : 0;

    return [
      {
        icon: TbLayoutDashboard,
        title: "Catégories",
        subject: "catégories au stock",
        subTitle: `plus élevé: ${mostMentionedCategory}`,
        currentValue: stockData?.categoryCount || 0,
        pourcentage: mostMentionedCategoryPercentage,
      },
      {
        icon: TbLayoutDashboard,
        title: "Tous Les Produits",
        subject: "produits dans le stock",
        subTitle: `plus élevé: ${biggestQuantityItem?.name || ''}`,
        currentValue: stockItems.length || 0,
        pourcentage: biggestQuantityPercentage,
      },
      {
        icon: TbLayoutDashboard,
        title: "Produits nécessaires",
        subject: "produits nécéssaire",
        subTitle: `plus élevé: ${isNeededLowestItem?.name || ''}`,
        currentValue: neededItems.length || 0,
        pourcentage: isNeededLowestItemPercentage,
      },
    ];
  };

  const transformTransactionData = (stockData?: StockDashboardData) => {
    const months = {
      '01': 'Jan', '02': 'Fév', '03': 'Mar', '04': 'Avr',
      '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Aou',
      '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
    };

    // When no data is present, return data structure with single "Transactions" column
    if (!stockData || !stockData.transactions.length) {
      return [
        ['Month', 'Transactions'], // Header row
        ['Jan', 0],
        ['Fév', 0],
        ['Mar', 0],
        ['Avr', 0],
        ['Mai', 0],
        ['Jun', 0],
        ['Jul', 0],
        ['Aou', 0],
        ['Sep', 0],
        ['Oct', 0],
        ['Nov', 0],
        ['Dec', 0],
      ];
    };

    const stockIdToName = stockData.stocks.reduce((acc, stock) => {
      acc[stock.id] = stock.name;
      return acc;
    }, {} as Record<string, string>);

    const uniqueStockNames = Array.from(
      new Set(
        stockData.transactions.map((t) => stockIdToName[t.stockId] || t.stockId)
      )
    );

    const result: (string | number)[][] = [['Month', ...uniqueStockNames]];

    const groupedTransactions = stockData.transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.createdAt);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const stockName = stockIdToName[transaction.stockId] || transaction.stockId;

      if (!acc[month]) {
        acc[month] = {};
      }
      if (!acc[month][stockName]) {
        acc[month][stockName] = 0;
      }
      acc[month][stockName] += 1;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    Object.entries(months).forEach(([monthNum, monthLabel]) => {
      const row: (string | number)[] = [monthLabel];
      uniqueStockNames.forEach((stockName) => {
        row.push(groupedTransactions[monthNum]?.[stockName] || 0);
      });
      result.push(row);
    });

    return result;
  };

  const transformToBarChartData = (stockData?: StockDashboardData): StockBarChartsDataType[] => {
    if (!stockData) return [];

    const stockIdToName = stockData.stocks.reduce((acc, stock) => {
      acc[stock.id] = stock.name;
      return acc;
    }, {} as Record<string, string>);

    return stockData.budgets.map(budget => {
      const totalTransactions = stockData.transactions
        .filter(t => t.stockId === budget.stockId)
        .reduce((sum, t) => sum + t.transactionAmount, 0);

      return {
        name: stockIdToName[budget.stockId] || budget.stockId,
        value1: budget.amount,
        value2: totalTransactions
      };
    });
  };


  const uniqueSuppliers: SuppliersDataType[] = Array.from(
    new Map(
      stockData?.items.map((item) => [
        item.supplierName,
        {
          supplierName: item.supplierName,
          supplierPhone: item.supplierPhone,
          supplierEmail: item.supplierEmail,
          supplierAddress: item.supplierAddress,
        }
      ])
    ).values()
  );

  const lineChartData = transformTransactionData(stockData);
  const barChartData = transformToBarChartData(stockData);

  useEffect(() => {
    getStockStat();
  }, [refreshTrigger]);

  return (
    <div className='flex flex-col gap-8 w-[99%] overflow-x-hidden'>
      <StockHeroSection StatisticsFetchFunc={test} />
      <div className='w-full grid grid-rows-2 lg:grid-rows-none lg:grid-cols-[45%,55%] xl:grid-cols-[58%,42%] zl:grid-cols-[62%,38%] gap-4'>
        <div className='flex flex-col gap-8'>
          <section className='h-[29rem] w-[25rem] lg:w-full overflow-x-auto bg-white rounded-xl shadow-sm p-2 font-inter dark:bg-slate-800'>
            <h2 className='text-2xl font-semibold text-center'>Transactions</h2>
            <LineChart
              data={lineChartData}
              title="Transactions"
              hAxisTitle="Mois"
              vAxisTitle="Quantity"
            />
          </section>
          <section className='w-[25rem] lg:w-full grid grid-rows-2 xl:grid-rows-none xl:grid-cols-2 gap-6 h-[30rem] xl:h-60'>
            <span className='w-full bg-white rounded-xl shadow-sm p-2 font-inter dark:bg-slate-800'>
              <StockBarChart data={barChartData} />
            </span>
            <span className='w-full bg-white rounded-xl shadow-sm p-2 font-inter dark:bg-slate-800'>
              <StockDonutChart data={donutChartData} />
            </span>
          </section>
          <section>

          </section>
        </div>
        <div>
          <section className='w-40 mb-12'>
            <RefreshMenuProvider setFetchTrigger={setRefreshTrigger}>
              <BudgetCmp budgets={mappedBudgets} />
            </RefreshMenuProvider>
          </section>
          <section className='w-40'>
            <Suppliers data={uniqueSuppliers} />
          </section>
        </div>
      </div>
    </div>
  )
}