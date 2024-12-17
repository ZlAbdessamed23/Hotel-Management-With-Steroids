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
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  useDisclosure
} from "@nextui-org/react";
import { ClientState, OperationMode } from "@/app/types/constants";
import { FaEllipsisVertical, FaPlus } from "react-icons/fa6";
import { MdOutlineKeyboardArrowDown, MdPrint } from "react-icons/md";
import { Client, DataType, EventOrganiser, ModalModeProps } from "@/app/types/types";
import { useRouter } from "next/navigation";
import { deleteClient } from "@/app/utils/funcs";
import { useRefreshMenuContext } from "../RefreshTriggerContext";
import toast from "react-hot-toast";
import { SiMicrosoftexcel } from "react-icons/si";
import { useReactToPrint } from "react-to-print";
import ExcelImportExport from "./ExcelImportExport";

const columns = [
  { name: "FULL NAME", uid: "fullName" },
  { name: "Email", uid: "email" },
  { name: "DATE OF BIRTH", uid: "dateOfBirth" },
  { name: "PHONE NUMBER", uid: "phoneNumber" },
  { name: "IDENTITY CARD NUMBER", uid: "identityCardNumber" },
  { name: "ADDRESS", uid: "address" },
  { name: "NATIONALITY", uid: "nationality" },
  { name: "GENDER", uid: "gender" },
  { name: "STATE", uid: "state" },
  { name: "ACTIONS", uid: "actions" },
];

const actionsColumn = { name: "ACTIONS", uid: "actions" };

const clientSpecificColumns = [
  { name: "MEMBERS NUMBER", uid: "membersNumber" },
  { name: "KIDS NUMBER", uid: "kidsNumber" },
  { name: "RESERVATION SOURCE", uid: "reservationSource" },
];

const eventSpecificColumns = [
  { name: "EVENT NAME", uid: "eventName" },
];

const organiserSpecificColumns = [
  { name: "ROLE", uid: "role" },
];

const statusColorMap: Record<ClientState, ChipProps["color"]> = {
  [ClientState.pending]: "warning",
  [ClientState.absent]: "danger",
  [ClientState.coming]: "success",
};

export default function ClientsDataGrid<T extends DataType>({ data, type, Add_Edit_Modal }:
  { data: T[], type: 'client' | 'eventInvited' | 'eventWorker', Add_Edit_Modal: React.FC<ModalModeProps<T>> }) {
  const router = useRouter();
  const setRefreshTrigger = useRefreshMenuContext().setFetchTrigger;
  const AddEditModal = useDisclosure();
  const [displayedItem, setDisplayedItem] = useState<T>();
  const [mode, setMode] = React.useState<OperationMode>(OperationMode.add);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(columns.map(col => col.uid)));
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "fullName",
    direction: "ascending",
  });

  function handleEditModalOpen(item: T): void {
    setDisplayedItem(item);
    setMode(OperationMode.update);
    AddEditModal.onOpen();
  };

  async function handleDeleteClient(item: T) {
    const response = await deleteClient(item.id as string);
    setRefreshTrigger((prev) => prev + 1);
    return response;
  };

  async function handleDelete(item: T) {
    if (type === "client") {
      const result = handleDeleteClient(item);
      await toast.promise(result, {
        loading: 'Loading...',
        success: (data) => `${data}`,
        error: (err) => `${err.toString()}`,
      }
      );
    };

  };

  function handleRedirectToDisplayPage(item: T) {
    console.log(item);
    if (type === "client") {
      if (item.reservations && item.reservations.length > 0) {
        router.push(`/main/employee/reception/manageclients/${item.id}?type=${type}&resId=${item.reservations[0].id}`);
      }
      else {
        router.push(`/main/employee/reception/manageclients/${item.id}?type=${type}`);
      };
    }
    else {
      router.push(`/main/employee/reception/manageclients/${item.id}?type=${type}&eventId=${item.eventId}`);
    };
  };

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const allColumns = React.useMemo(() => {
    if (type === 'client') {
      return [...columns, ...clientSpecificColumns];
    } else if (type === 'eventInvited') {
      return [...columns, ...eventSpecificColumns];
    } else if (type === 'eventWorker') {
      return [...columns, ...eventSpecificColumns, ...organiserSpecificColumns];
    }
    return [...columns, actionsColumn];
  }, [type]);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return allColumns;

    const selectedColumns = allColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));

    const actionsColumnIndex = selectedColumns.findIndex(col => col.uid === 'actions');
    if (actionsColumnIndex !== -1) {
      const actionsCol = selectedColumns.splice(actionsColumnIndex, 1)[0];
      selectedColumns.push(actionsCol);
    }

    return selectedColumns;
  }, [visibleColumns, allColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredData = [...data];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        item.fullName.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredData;
  }, [data, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: T, b: T) => {
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

      if (first instanceof Date && second instanceof Date) {
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
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((item: T, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof T];

    switch (columnKey) {
      case "gender":
        return (item as any).gender || '';
      // case "state":
      //   return (
      //     <Chip className="capitalize" color={statusColorMap[item.state]} size="md" variant="flat">
      //       {item.}
      //     </Chip>
      //   );
      case "role":
        return (item as EventOrganiser).role || '';
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
                <DropdownItem onClick={() => handleRedirectToDisplayPage(item)}>Voir</DropdownItem>
                <DropdownItem key={"edit"} onPress={() => handleEditModalOpen(item)}>Editer</DropdownItem>
                <DropdownItem color="danger" className="text-danger" onClick={() => handleDelete(item)}>Supprimer</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      case "dateOfBirth":
        return cellValue instanceof Date ? cellValue.toLocaleDateString() : String(cellValue);
      default:
        return String(cellValue);
    }
  }, []);

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
            placeholder="La Recherche par Nom ..."
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <ExcelImportExport
              onDataImported={handleDataImport}
              exportData={data}
              exportFileName="ClientsData.xlsx"
            />
            <Button color="danger" variant="shadow" isIconOnly onClick={() => reactToPrintFn()}><MdPrint className="size-7 text-white" /></Button>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button variant="flat" className="bg-white border border-black dark:bg-slate-800 dark:border-white" endContent={<MdOutlineKeyboardArrowDown className="size-5" />}>
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
                {allColumns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button variant="shadow" color="secondary" endContent={<FaPlus className="size-4" />} onClick={AddEditModal.onOpen}>Ajouter un nouveau</Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-foreground-600 text-small">Total {data.length} éléments</span>
          <label className="flex items-center text-foreground-600 text-small">
            Rangées par page:
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
    data.length,
    allColumns,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-foreground-600">
          {selectedKeys === "all"
            ? "Tous les élements séléctionnés"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
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
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" className="bg-primary" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages, onPreviousPage, onNextPage]);

  useEffect(() => {
    if (!AddEditModal.isOpen) {
      setDisplayedItem(undefined);
      setMode(OperationMode.add);
    };
  }, [AddEditModal.isOpen]);


  return (
    <React.Fragment>
      <Table ref={contentRef}
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px] w-full overflow-x-scroll",
          th: "bg-primary-500 text-black h-12",
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
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.uid !== "actions"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No data found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.identityCardNumber}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Add_Edit_Modal isOpen={AddEditModal.isOpen} onOpen={AddEditModal.onOpen} onOpenChange={AddEditModal.onOpenChange} mode={mode} initialData={displayedItem} />
    </React.Fragment>
  );
}