"use client"

import React, { useEffect, useState } from 'react'
import StockHeroSection from './components/StockHeroSection'
import { Budget, StockBarChartsDataType, StockDashboardData, StockType, StockDonutChartsDataType, StockItem, SuppliersDataType, ThirdCardItemType } from '@/app/types/types'
import { TbLayoutDashboard } from 'react-icons/tb'
import GenericDisplayTable from '../../components/other/GenericDisplayTable'
import { Tabs, Tab } from '@nextui-org/react'
import LineChart from './components/StockLineChart'
import StockDonutChart from './components/StockDonutChart'
import StockBarChart from './components/StockBarChart'
import BudgetCmp from './components/Budget'
import Suppliers from './components/Suppliers'
import { getStockData } from '@/app/utils/funcs'
import { StockTransactionType } from '@/app/types/constants'

export default function ManageCentralStock() {
  const [stockData, setStockData] = useState<StockDashboardData>();
  console.log(stockData?.items);
  const itemsColumns = [
    { name: "Nom", uid: "name" },
    { name: "Quantité", uid: "quantity" },
    { name: "unité", uid: "unity" },
    { name: "sku", uid: "sku" },
    { name: "min quantité", uid: "minQuantity" },
    { name: "SuppName", uid: "supplierName" },
    { name: "Address", uid: "supplierAddress" },
    { name: "Email", uid: "supplierEmail" },
    { name: "PhoneNbr", uid: "supplierPhoneNumber" },
  ];

  const purchaseTransactionCount = stockData?.transactions.filter((transaction) => transaction.type === StockTransactionType.purchase).length || 0;
  const donutChartData: StockDonutChartsDataType = {
    name: 'Stock Data',
    value1: (stockData?.transactions.length || 0) - purchaseTransactionCount,
    value2: purchaseTransactionCount || 0,
  };

  const budgetMap: { [key: string]: { amount: number; id: string } } = {};

  stockData?.budgets.forEach((budg) => {
    budgetMap[budg.stockType] = { amount: budg.amount, id: budg.id };
  });

  const budget: Budget = {
    spa: {
      amount: budgetMap["spa"]?.amount || 0,
      id: budgetMap["spa"]?.id || "",
    },
    restau: {
      amount: budgetMap["restaurant"]?.amount || 0,
      id: budgetMap["restaurant"]?.id || "",
    },
    material: {
      amount: budgetMap["material"]?.amount || 0,
      id: budgetMap["material"]?.id || "",
    },
  };

  async function getStockStat() {
    const data = await getStockData();
    setStockData(data.data);
  };

  const sport_spaItems = stockData?.items.filter((item) => item.stockType === "spa");
  const materialItems = stockData?.items.filter((item) => item.stockType === "material");
  const restauItems = stockData?.items.filter((item) => item.stockType === "restaurant");

  function transformToStockItem(items: {
    quantity: number;
    stockType: StockType;
    name: string;
    isNeeded: boolean;
    supplierAddress: string;
    supplierName: string;
    supplierPhone: string;
    supplierEmail: string;
    category: {
      name: string;
    };
  }[] | undefined): StockItem[] {
    const newStockItems: StockItem[] = items?.map((item) => {
      return {
        category: item.category.name,
        description: "",
        minimumQuantity: 0,
        name: item.name,
        quantity: item.quantity,
        stockType: item.stockType as StockType,
        id: "",
        sku: "",
        unit: "",
        unitPrice: 0,
        supplierName: item.supplierName,
        supplierPhone: item.supplierPhone,
        supplierEmail: item.supplierEmail,
        supplierAddress: item.supplierAddress,
      };
    }) ?? [];

    return newStockItems;
  };

  async function test(): Promise<Array<ThirdCardItemType>> {
    return [
      {
        icon: TbLayoutDashboard,
        title: "Catégories",
        subject: "catégories dans le stock",
        subTitle: `plus élevé: ${mostMentionedCategory}`,
        currentValue: categoriesNbr || 0,
        pourcentage: mostMentionedCategoryPercentage,
      },
      {
        icon: TbLayoutDashboard,
        title: "Tous Les Produits",
        subject: "produits dans le stock",
        subTitle: `plus élevé: ${biggestQuantityItem}`,
        currentValue: productsNbr || 0,
        pourcentage: biggestQuantityPercentage,
      },
      {
        icon: TbLayoutDashboard,
        title: "Produits nécessaires",
        subject: "produits nécéssaire",
        subTitle: `plus élevé: ${isNeededLowestItem}`,
        currentValue: areNeededProductsNbr || 0,
        pourcentage: isNeededLowestItemPercentage,
      },
    ];
  };

  const stockItems = stockData?.items || [];

  const totalQuantity = stockItems.reduce((total, item) => total + item.quantity, 0);

  const biggestQuantityItem = stockItems.length > 0
    ? stockItems.reduce((maxItem, currentItem) => {
      return currentItem.quantity > maxItem.quantity ? currentItem : maxItem;
    }, stockItems[0])
    : "";

  const biggestQuantityPercentage = biggestQuantityItem
    ? (biggestQuantityItem.quantity / totalQuantity) * 100
    : 0;

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

  const categoriesNbr = stockData?.categoryCount || 0;
  const productsNbr = stockItems.length;
  const areNeededProductsNbr = stockItems.filter((item) => item.isNeeded === true).length;

  const neededItems = stockItems.filter((item) => item.isNeeded);
  const isNeededLowestItem = neededItems.length > 0
    ? neededItems.reduce((minItem, currentItem) => {
      return currentItem.quantity < minItem.quantity ? currentItem : minItem;
    }, neededItems[0])
    : "";

  const totalNeededQuantity = neededItems.reduce((total, item) => total + item.quantity, 0);
  const isNeededLowestItemPercentage = isNeededLowestItem && totalNeededQuantity > 0
    ? (isNeededLowestItem.quantity / totalNeededQuantity) * 100
    : 0;

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

  const transformTransactionData = (stockData?: StockDashboardData) => {
    const result: (string | number)[][] = [
      ['Year', 'Sport&Spa', 'Matériel', 'Cafeteria']
    ];

    const months = {
      '01': 'Jan',
      '02': 'Fév',
      '03': 'Mar',
      '04': 'Avr',
      '05': 'Mai',
      '06': 'Jun',
      '07': 'Jul',
      '08': 'Aou',
      '09': 'Sep',
      '10': 'Oct',
      '11': 'Nov',
      '12': 'Dec'
    };

    if (!stockData) {
      Object.values(months).forEach(monthLabel => {
        result.push([monthLabel, 0, 0, 0]);
      });
      return result;
    }

    const groupedTransactions = stockData.transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.createdAt);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');

      if (!acc[month]) {
        acc[month] = {
          spa: 0,
          material: 0,
          restaurant: 0
        };
      }

      acc[month][transaction.stockType] += 1;
      return acc;
    }, {} as Record<string, Record<StockType, number>>);

    Object.entries(months).forEach(([monthNum, monthLabel]) => {
      const monthData = groupedTransactions[monthNum] || {
        spa: 0,
        material: 0,
        restaurant: 0
      };

      result.push([
        monthLabel,
        monthData.spa,
        monthData.material,
        monthData.restaurant
      ]);
    });

    return result;
  };

  const lineChartData = transformTransactionData(stockData);

  const transformToBarChartData = (stockData?: StockDashboardData): StockBarChartsDataType[] => {
    if (!stockData) {
      return [
        { name: 'Material', value1: 0, value2: 0 },
        { name: 'SPA', value1: 0, value2: 0 },
        { name: 'Restaurant', value1: 0, value2: 0 }
      ];
    }

    const result: Record<StockType, StockBarChartsDataType> = {
      material: { name: 'Material', value1: 0, value2: 0 },
      spa: { name: 'SPA', value1: 0, value2: 0 },
      restaurant: { name: 'Restaurant', value1: 0, value2: 0 }
    };

    stockData.budgets.forEach(budget => {
      result[budget.stockType].value1 = budget.amount;
    });

    stockData.transactions.forEach(transaction => {
      result[transaction.stockType].value2 += transaction.transactionAmount;
    });

    return Object.values(result);
  };

  const barChartData = transformToBarChartData(stockData);

  useEffect(() => {
    getStockStat();
  }, []);

  return (
    <div className='flex flex-col gap-8 w-[99%] overflow-x-hidden'>
      <StockHeroSection StatisticsFetchFunc={test} />
      <div className='w-full grid grid-rows-2 lg:grid-rows-none lg:grid-cols-[65%,35%] gap-4'>
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
          <section className='w-[25rem] lg:w-full grid grid-rows-2 lg:grid-rows-none lg:grid-cols-2 gap-6 h-[30rem]  lg:h-60'>
            <span className='w-full bg-white rounded-xl shadow-sm p-2 font-inter dark:bg-slate-800'>
              <StockBarChart data={barChartData} />
            </span>
            <span className='w-full bg-white rounded-xl shadow-sm p-2 font-inter dark:bg-slate-800'>
              <StockDonutChart data={donutChartData} />
            </span>
          </section>
          <section className='w-[25rem] lg:w-full'>
            <Tabs aria-label="Options" className='w-full' classNames={{
              base: "w-full",
              tabList: "w-full flex flex-row items-center justify-between mb-2 dark:bg-slate-800",
              tab: "w-[10rem]",
            }}>
              <Tab key="Sport&Spa" title="Sport&Spa" className='flex flex-col gap-12'>
                <div className='max-w-[70rem]'>
                  <GenericDisplayTable columns={itemsColumns} data={transformToStockItem(sport_spaItems)} />
                </div>
              </Tab>
              <Tab key="Products" title="Produits">
                <div className='max-w-[70rem]'>
                  <GenericDisplayTable columns={itemsColumns} data={transformToStockItem(materialItems)} />
                </div>
              </Tab>
              <Tab key="Restau-Caféteria" title="Restau-Caféteria" className='flex flex-col gap-12'>
                <div className='max-w-[70rem]'>
                  <GenericDisplayTable columns={itemsColumns} data={transformToStockItem(restauItems)} />
                </div>
              </Tab>
            </Tabs>
          </section>
        </div>
        <div>
          <section className='w-40 mb-12'>
            <BudgetCmp budget={budget} />
          </section>
          <section className='w-40'>
            <Suppliers data={uniqueSuppliers} />
          </section>
        </div>
      </div>
    </div>
  )
}
