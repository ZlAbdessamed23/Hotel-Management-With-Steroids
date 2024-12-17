"use client"

import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { FaEllipsisVertical, FaPlus } from "react-icons/fa6";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { ModalModeProps, StockCategory, StockItem } from "@/app/types/types";
import { OperationMode } from "@/app/types/constants";
import DisplayModalStyle2 from "../modals/display/DisplayModalStyle2";
import { deleteEmployee, deleteGymClient, deleteStockItem } from "@/app/utils/funcs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { TranslateObjKeysFromEngToFr } from "@/app/utils/translation";
import { useGymMenuContext } from "../GymContextProvider";
import { MdPrint } from "react-icons/md";
import { SiMicrosoftexcel } from "react-icons/si";
import { useReactToPrint } from "react-to-print";
import ExcelImportExport from "./ExcelImportExport";
import { useStockMenuContext } from "../StockContextProvider";
export type DataGridItem = {
  [key: string]: any;
};

type ComingDataType = "employee" | "stockItem" | "gymClient" | "lostObj";

interface DataGridProps<T extends DataGridItem> {
  items: T[];
  columns: { name: string; uid: string }[];
  statusColorMap?: Record<string, ChipProps["color"]>;
  Add_Edit_Modal: React.FC<ModalModeProps<T>>,
  comingDataType: ComingDataType,
};

function isDate(value: any): value is Date {
  return value instanceof Date;
};

export default function GenericDataGrid<T extends DataGridItem>({
  items,
  columns,
  statusColorMap,
  Add_Edit_Modal,
  comingDataType
}: DataGridProps<T>) {
  const router = useRouter();
  const [displayedItem, setDisplayedItem] = useState<T | (T & StockItem)>();
  const [mode, setMode] = React.useState<OperationMode>(OperationMode.add);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(columns.map(col => String(col.uid))));
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: String(columns[0].uid),
    direction: "ascending",
  });

  const DisplayModal = useDisclosure();
  const AddEditModal = useDisclosure();

  const gymId = useGymMenuContext().gymId;
  const stockId = useStockMenuContext().stockId;

  function handleViewModalOpen(item: T): void {
    setDisplayedItem(item);
    DisplayModal.onOpen();
  };

  function handleAddModalOpen(): void {
    setDisplayedItem(undefined);
    AddEditModal.onOpen();
  };

  function handleEditModalOpen(item: T): void {
    setDisplayedItem(item);
    setMode(OperationMode.update);
    AddEditModal.onOpen();
  };

  async function handleDeleteEmployee(item: T) {
    const response = await deleteEmployee(item.id);
    router.refresh();
    return response;
  };

  async function handleDeleteStockItem(item: T) {
    const response = await deleteStockItem(stockId , item.id);
    router.refresh();
    return response;
  };

  async function handleDeleteGymClient(item: T) {
    const response = await deleteGymClient(item.id, gymId);
    router.refresh();
    return response;
  };

  async function handleDeleteItem(item: T) {
    if (comingDataType === "employee") {
      const result = handleDeleteEmployee(item);
      await toast.promise(result, {
        loading: 'Loading...',
        success: (data) => `${data}`,
        error: (err) => `${err.toString()}`,
      }
      );
    } else if (comingDataType === "stockItem") {
      const result = handleDeleteStockItem(item);
      await toast.promise(result, {
        loading: 'Loading...',
        success: (data) => `${data}`,
        error: (err) => `${err.toString()}`,
      }
      );
    } else {
      const result = handleDeleteGymClient(item);
      await toast.promise(result, {
        loading: 'Loading...',
        success: (data) => `${data}`,
        error: (err) => `${err.toString()}`,
      }
      );
    };
  };

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(String(column.uid)));
  }, [visibleColumns, columns]);

  const filteredItems = React.useMemo(() => {
    let filteredData = [...items];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        String(item[columns[0].uid]).toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredData;
  }, [items, filterValue, columns, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const paginatedItems = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...paginatedItems].sort((a: T, b: T) => {
      const first = a[sortDescriptor.column as keyof T];
      const second = b[sortDescriptor.column as keyof T];

      if (first === undefined || second === undefined) {
        return 0;
      }

      if (typeof first === 'string' && typeof second === 'string') {
        return sortDescriptor.direction === "descending"
          ? second.localeCompare(first)
          : first.localeCompare(second);
      }

      if (isDate(first) && isDate(second)) {
        return sortDescriptor.direction === "descending"
          ? second.getTime() - first.getTime()
          : first.getTime() - second.getTime();
      }

      if (typeof first === 'number' && typeof second === 'number') {
        return sortDescriptor.direction === "descending"
          ? second - first
          : first - second;
      }

      return 0;
    });
  }, [sortDescriptor, paginatedItems]);

  const renderCell = React.useCallback((item: T, columnKey: keyof T) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "gender":
        return String(cellValue) || '';
      case "state":
        if (statusColorMap && typeof cellValue === 'string') {
          return (
            <Chip className="capitalize" color={statusColorMap[cellValue]} size="md" variant="flat">
              {cellValue}
            </Chip>
          );
        }
        return String(cellValue);
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <FaEllipsisVertical className="size-5" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key={"view"} onClick={() => handleViewModalOpen(item)}>Voir</DropdownItem>
                <DropdownItem key={"edit"} onPress={() => handleEditModalOpen(item)}>Editer</DropdownItem>
                <DropdownItem key={"delete"} color="danger" className="text-danger" onClick={() => handleDeleteItem(item)}>Supprimer</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      case "dateOfBirth":
        if (isDate(cellValue)) {
          return cellValue.toISOString().split('T')[0];
        };
        return new Date(String(cellValue)).toISOString().split('T')[0];
      default:
        return String(cellValue);
    }
  }, [statusColorMap]);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("")
    setPage(1)
  }, []);


  useEffect(() => {
    if (!AddEditModal.isOpen) {
      setDisplayedItem(undefined);
      setMode(OperationMode.add);
    };
  }, [AddEditModal.isOpen]);

  const handleDataImport = (importedData: T[]) => {
    console.log(importedData);
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4 p-2">
        <div className="flex flex-col md:flex-row md:justify-between gap-3 items-end">
          <Input
            classNames={{
              inputWrapper: "border border-black dark:bg-slate-800"
            }}
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <ExcelImportExport
              onDataImported={handleDataImport}
              exportData={items}
              exportFileName="ClientsData.xlsx"
            />
            <Button color="danger" variant="shadow" isIconOnly onClick={() => reactToPrintFn()}><MdPrint className="size-7 text-white" /></Button>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button variant="flat" className="bg-white border border-black dark:bg-slate-800 " endContent={<MdOutlineKeyboardArrowDown className="size-5" />}>
                  Colonnes
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={String(column.uid)} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button variant="shadow" color="secondary" endContent={<FaPlus className="size-4" />} onClick={() => handleAddModalOpen()}>Ajouter un nouveau</Button>
            {
              displayedItem && <DisplayModalStyle2 data1={displayedItem} title1="Display" props={DisplayModal} />
            }
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-foreground-600 text-small">Total {items.length} items</span>
          <label className="flex items-center text-foreground-600 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-foreground-600 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    items.length,
    columns,
    onClear
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-foreground-600">
          {selectedKeys === "all"
            ? "Tous les éléments séléctionnés"
            : `${selectedKeys.size} de ${filteredItems.length} séléctionné`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" className="bg-secondary text-white" onPress={onPreviousPage}>
            Précédent
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" className="bg-primary" onPress={onNextPage}>
            Suivant
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages, onPreviousPage, onNextPage]);

  return (
    <React.Fragment>
      <Table ref={contentRef}
        aria-label="Tableau avec Recherche , Classement , multiPages..."
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px] w-full overflow-x-auto data-grid-wrapper dark:bg-slate-800",
          th: "bg-primary-500 text-black h-12 dark:text-white dark:bg-primary-100",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={String(column.uid)}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.uid !== "actions"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No items found"} items={sortedItems} className="font-sans">
          {(item) => (
            <TableRow key={String(item[columns[0].uid])}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey as keyof T)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal scrollBehavior="inside" isOpen={DisplayModal.isOpen} onOpenChange={DisplayModal.onOpenChange} className='font-segoe' hideCloseButton>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Voire
              </ModalHeader>
              <ModalBody className='flex flex-col gap-4'>
                {
                  displayedItem && Object.entries(displayedItem).map(([key, value]) => (
                    <section key={key} className='flex flex-row items-center gap-4'>
                      <span className='text-secondary  font-semibold'>{TranslateObjKeysFromEngToFr(key)}:</span>
                      <span className='text-black w-60 truncate dark:text-white'>{String(value)}</span>
                    </section>
                  ))
                }
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Fermer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Add_Edit_Modal isOpen={AddEditModal.isOpen} onOpen={AddEditModal.onOpen} onOpenChange={AddEditModal.onOpenChange} mode={mode} initialData={displayedItem} />
    </React.Fragment>
  );
}