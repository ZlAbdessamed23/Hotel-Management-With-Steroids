"use client"

import { StockCategory, StockItem, StockTransaction, ThirdCardItemType } from '@/app/types/types'
import React, { useEffect, useState } from 'react'
import StockHeroSection from './StockHeroSection'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Tab, Tabs, useDisclosure } from '@nextui-org/react'
import GenericDataGrid from '@/app/main/components/other/GenericDataGrid'
import AddStockItemModal from '@/app/main/components/modals/forms/AddStockItemModal'
import { OperationMode, StockTransactionType } from '@/app/types/constants'
import { FaSearch } from 'react-icons/fa'
import { FaPlus } from 'react-icons/fa6'
import StockCategoryCard from './StockCategoryCard'
import AddStockCategoryModal from '@/app/main/components/modals/forms/AddStockCategoryModal'
import StockCategoryImage from '/public/StockCategoryImage.svg';
import StockTransactionImage from '/public/StockTransactionImage.svg';
import DisplayModalStyle3 from '@/app/main/components/modals/display/DisplayModalStyle3'
import DisplayModalStyle2 from '@/app/main/components/modals/display/DisplayModalStyle2'
import StockTransactionCard from './StockTransactionCard'
import { IoMdArrowDropdown } from "react-icons/io";
import { Selection } from "@react-types/shared";
import AddTransactionModal from '@/app/main/components/modals/forms/AddTransactionModal'
import { TbLayoutDashboard } from 'react-icons/tb'
import { StockContextProvider } from '@/app/main/components/StockContextProvider'
import { deleteStock } from '@/app/utils/funcs'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'



export default function StockPageStructure({ CategoriesFetchFunc, TransactionsFetchFunc, ItemsFetchFunc, stockId }: {
  CategoriesFetchFunc: () => Promise<StockCategory[]>, TransactionsFetchFunc: () => Promise<StockTransaction[]>, ItemsFetchFunc: () => Promise<StockItem[]>, stockId: string
}) {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [selectedTransactionType, setSelectedTransactionType] = useState<Selection>(new Set(["tout"]));
  const [categories, setCategories] = useState<StockCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<StockCategory[]>([]);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<StockTransaction[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);
  const [errorTransactions, setErrorTransactions] = useState<string | null>(null);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [transactionSearchTerm, setTransactionSearchTerm] = useState('');
  const [categoryDisplayeditem, setCategoryDisplayedItem] = useState<StockCategory>();
  const [transactionDisplayeditem, setTransactionDisplayedItem] = useState<StockTransaction>();
  const [items, setItems] = useState<StockItem[]>([]);
  const [errorItems, setErrorItems] = useState<string | null>(null);

  const AddEditModal = useDisclosure();
  const CategoriesDisplayModal = useDisclosure();
  const TransactionsDisplayModal = useDisclosure();
  const AddTransactionProps = useDisclosure();
  const router = useRouter();
  const Transactions = Object.values(StockTransactionType);

  const handleSelectionChange = (keys: Selection) => {
    if (keys === "all") {
      setSelectedTransactionType(new Set(["tout"]));
    } else if (keys instanceof Set) {
      if (keys.size === 0) {
        setSelectedTransactionType(new Set(["tout"]));
      } else {
        setSelectedTransactionType(keys);
      }
    };
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const items = await CategoriesFetchFunc();
        setCategories(items);
        setFilteredCategories(items);
      } catch (err) {
        setErrorCategories('Failed to fetch categories');
        console.error(err);
      } finally {
        setIsLoadingCategories(false);
      };
    };

    fetchCategories();
  }, [CategoriesFetchFunc]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const items = await TransactionsFetchFunc();
        setTransactions(items);
        setFilteredTransactions(items);
      } catch (err) {
        setErrorTransactions('Failed to fetch transactions');
      } finally {
        setIsLoadingTransactions(false);
      };
    };

    fetchTransactions();
  }, [TransactionsFetchFunc]);


  useEffect(() => {
    async function fetchItems() {
      try {
        const items = await ItemsFetchFunc();
        setItems(items);
      } catch (err) {
        setErrorItems('Failed to fetch transactions');
      };
    };

    fetchItems();
  }, [ItemsFetchFunc]);

  const handleCategorySearch = (value: string) => {
    setCategorySearchTerm(value);
    if (value.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  };

  const handleTransactionSearch = (value: string) => {
    setTransactionSearchTerm(value);
    if (value.trim() === '') {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(transaction =>
        transaction.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTransactions(filtered);
    }
  };


  const itemsColumns = [
    { name: "Nom", uid: "name" },
    { name: "Quantité", uid: "quantity" },
    { name: "unité", uid: "unit" },
    { name: "sku", uid: "sku" },
    { name: "min quantité", uid: "minimumQuantity" },
    { name: "tu as besoin ?", uid: "isNeeded" },
    { name: "SuppName", uid: "supplierName" },
    { name: "Address", uid: "supplierAddress" },
    { name: "Email", uid: "supplierEmail" },
    { name: "PhoneNbr", uid: "supplierPhone" },
    { name: "ACTIONS", uid: "actions" },
  ];

  async function test(): Promise<Array<ThirdCardItemType>> {
    const stockItems = items || [];

    // Calculate total quantity across all items
    const totalQuantity = stockItems.reduce((total, item) => total + item.quantity, 0);

    // Find item with biggest quantity
    const biggestQuantityItem = stockItems.length > 0
      ? stockItems.reduce((maxItem, currentItem) => {
        return currentItem.quantity > maxItem.quantity ? currentItem : maxItem;
      }, stockItems[0])
      : "";

    const biggestQuantityPercentage = biggestQuantityItem
      ? (biggestQuantityItem.quantity / totalQuantity) * 100
      : 0;

    // Count items per category using categoryId
    const categoryCountMap: { [categoryId: string]: number } = {};
    stockItems.forEach((item) => {
      const categoryId = item.categoryId || '';
      categoryCountMap[categoryId] = (categoryCountMap[categoryId] || 0) + 1;
    });

    // Find most mentioned category
    const categoryEntries = Object.entries(categoryCountMap);
    const mostMentionedCategoryId = categoryEntries.length > 0
      ? categoryEntries.reduce((a, b) =>
        categoryCountMap[a[0]] > categoryCountMap[b[0]] ? a : b
      )[0]
      : "";

    // Get category name using the ID
    const mostMentionedCategory = categories?.find(cat => cat.id === mostMentionedCategoryId)?.name || "";

    const mostMentionedCategoryCount = categoryCountMap[mostMentionedCategoryId] || 0;
    const mostMentionedCategoryPercentage = stockItems.length > 0
      ? (mostMentionedCategoryCount / stockItems.length) * 100
      : 0;

    // Get counts
    const categoriesNbr = categories?.length || 0;
    const productsNbr = stockItems?.length || 0;
    const areNeededProductsNbr = stockItems?.filter((item) => item.isNeeded === true).length || 0;

    // Find lowest quantity among needed items
    const neededItems = stockItems.filter((item) => item.isNeeded);
    const isNeededLowestItem = neededItems.length > 0
      ? neededItems.reduce((minItem, currentItem) => {
        return currentItem.quantity < minItem.quantity ? currentItem : minItem;
      }, neededItems[0])?.name || ""
      : "";

    const totalNeededQuantity = neededItems.reduce((total, item) => total + item.quantity, 0);
    const isNeededLowestItemPercentage = isNeededLowestItem && totalNeededQuantity > 0
      ? (isNeededLowestItem.length / totalNeededQuantity) * 100
      : 0;

    return [
      {
        icon: TbLayoutDashboard,
        title: "Catégories",
        subject: "catégories au stock",
        subTitle: `plus élevé: ${mostMentionedCategory}`,
        currentValue: categoriesNbr || 0,
        pourcentage: mostMentionedCategoryPercentage,
      },
      {
        icon: TbLayoutDashboard,
        title: "Tous Les Produits",
        subject: "produits au stock",
        subTitle: `plus élevé: ${(biggestQuantityItem as StockItem).name || ''}`,
        currentValue: productsNbr || 0,
        pourcentage: biggestQuantityPercentage,
      },
      {
        icon: TbLayoutDashboard,
        title: "Produits nécessaires",
        subject: "produits nécéssaire",
        subTitle: `plus bas: ${isNeededLowestItem}`,
        currentValue: areNeededProductsNbr || 0,
        pourcentage: isNeededLowestItemPercentage,
      },
    ];
  };

  async function handleDeleteEvent() {
    try{
      const res = await deleteStock(stockId as string);
      if(res){
        setTimeout(() => {
          router.push("/main/employee/managestock/customstock");
        },1000);
      }
      return res;
    }
    catch(err : any){
      throw new Error(err);
    };
  };

  async function handleDelete() {
    const result = handleDeleteEvent();
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };



  return (
    <div className='flex flex-col gap-6 w-full overflow-x-hidden'>
      <StockHeroSection StatisticsFetchFunc={test} />
      <div className='flex items-center justify-center gap-4 w-full'>
        <Button color='danger' onClick={handleDelete}>Supprimer le stock</Button>
        <Button color='success'>Mise à jour du stock</Button>
      </div>
      <StockContextProvider setRefreshTrigger={setRefreshTrigger} stockId={stockId}>
        <div className='w-[25rem] overflow-auto md:w-full'>
          <Tabs aria-label="Options" className='w-full' classNames={{
            base: "w-full",
            tabList: "w-full flex flex-row items-center justify-between mb-6",
            tab: "w-[10rem]",
          }}>
            <Tab key="Categories" title="Categories" className='flex flex-col gap-12'>
              <section className='flex items-center gap-4 lg:gap-0 lg:justify-between'>
                <div className='w-1/2 lg:w-4/5'>
                  <Input
                    startContent={<FaSearch className='text-black' />}
                    classNames={{
                      inputWrapper: "border border-gray-500"
                    }}
                    isClearable
                    className="sm:max-w-[44%] w-full"
                    placeholder="La Recherche par Nom ..."
                    value={categorySearchTerm}
                    onValueChange={handleCategorySearch}
                  />
                </div>
                <div className='flex items-center gap-8'>
                  <Button className='bg-secondary text-white' endContent={<FaPlus className='size-5' />} onClick={AddEditModal.onOpen}>Ajouter une Cat&eacute;gorie</Button>
                  <AddStockCategoryModal isOpen={AddEditModal.isOpen} onOpen={AddEditModal.onOpen} onOpenChange={AddEditModal.onOpenChange} mode={OperationMode.add} />
                  {
                    categoryDisplayeditem && <DisplayModalStyle3 data1={categoryDisplayeditem} title1='Voire la Categorie' props={CategoriesDisplayModal} SecondModal={AddStockCategoryModal} dataType='stockItem' />
                  }

                </div>
              </section>
              <section className='grid grid-cols-3 gap-4'>
                {isLoadingCategories ? (
                  <p>Loading...</p>
                ) : errorCategories ? (
                  <p>{errorCategories}</p>
                ) : (
                  filteredCategories?.map((category, index) => (
                    <StockCategoryCard key={category.id} DisplayIcon={StockCategoryImage} onOpen={CategoriesDisplayModal.onOpen} setDisplayedItem={setCategoryDisplayedItem} infos={category} />
                  ))
                )}
              </section>
            </Tab>
            <Tab key="Products" title="Produits">
              <div className='flex items-center justify-between px-2'>
                <Button className='bg-secondary text-white' endContent={<FaPlus className='size-5' />} onClick={AddTransactionProps.onOpen}>
                  Ajouter une transaction
                </Button>
              </div>
              <div className='max-w-[70rem]'>
                <AddTransactionModal items={items?.map((item) => { return { id: item.id as string, name: item.name } }) || []} props={AddTransactionProps} />
                <GenericDataGrid<StockItem> Add_Edit_Modal={AddStockItemModal} items={items || []} columns={itemsColumns} comingDataType={'stockItem'} />
              </div>
            </Tab>
            <Tab key="Transactions" title="Transactions" className='flex flex-col gap-12'>
              <section className='flex items-center gap-4 lg:gap-0 lg:justify-between'>
                <div className='w-1/2 lg:w-4/5'>
                  <Input
                    startContent={<FaSearch className='text-black' />}
                    classNames={{
                      inputWrapper: "border border-gray-500"
                    }}
                    isClearable
                    className="sm:max-w-[44%] w-full "
                    placeholder="La Recherche par Nom ..."
                    value={transactionSearchTerm}
                    onValueChange={handleTransactionSearch}
                  />
                </div>
                <div className='flex items-center gap-8'>
                  <Dropdown >
                    <DropdownTrigger >
                      <Button className='bg-secondary text-white' endContent={<IoMdArrowDropdown className='size-5' />}>
                        {Array.from(selectedTransactionType)[0] as string}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      selectionMode="single"
                      selectedKeys={selectedTransactionType}
                      onSelectionChange={handleSelectionChange}>
                      {
                        Transactions?.map((transaction) => (
                          <DropdownItem key={transaction}>{transaction}</DropdownItem>
                        ))
                      }
                    </DropdownMenu>
                  </Dropdown>
                  {
                    transactionDisplayeditem && <DisplayModalStyle2 data1={transactionDisplayeditem} props={TransactionsDisplayModal} title1='Voire la transaction' />
                  }
                </div>
              </section>
              <section className='grid grid-cols-3 gap-4'>
                {isLoadingTransactions ? (
                  <p>Loading...</p>
                ) : errorTransactions ? (
                  <p>{errorTransactions}</p>
                ) : (
                  filteredTransactions?.map((transaction, index) => (
                    <StockTransactionCard key={transaction.id} index={index} DisplayIcon={StockTransactionImage} onOpen={TransactionsDisplayModal.onOpen} setDisplayedItem={setTransactionDisplayedItem} infos={transaction} />
                  ))
                )}
              </section>
            </Tab>
          </Tabs>
        </div>
      </StockContextProvider>

    </div>
  )
}
