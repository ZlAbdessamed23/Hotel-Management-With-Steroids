import React from 'react';
import * as XLSX from 'xlsx';
import { Button, Input } from "@nextui-org/react";
import { SiMicrosoftexcel } from "react-icons/si";
import { FaUpload } from "react-icons/fa";
import { motion } from 'framer-motion';


interface ExcelImportExportProps<T extends Record<string, any>> {
    onDataImported: (data: T[]) => void;
    exportData: T[];
    exportFileName?: string;
}

const ExcelImportExport = <T extends Record<string, any>,>({ onDataImported, exportData, exportFileName = 'data.xlsx' }: ExcelImportExportProps<T>) => {

    const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target?.result;
            if (typeof data === "string") {
                const workbook = XLSX.read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData: T[] = XLSX.utils.sheet_to_json(sheet);
                onDataImported(jsonData);
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleExportExcel = () => {
        // Process exportData to convert array fields to strings
        const processedData = exportData.map(item => {
            const newItem: Record<string, any> = { ...item };
            for (const key in newItem) {
                if (Array.isArray(newItem[key])) {
                    newItem[key] = newItem[key].join(', '); // Convert arrays to comma-separated strings
                }
            }
            return newItem;
        });

        const worksheet = XLSX.utils.json_to_sheet(processedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        XLSX.writeFile(workbook, exportFileName);
    };

    return (
        <div className="flex gap-3">
            {/* <Button as="label" htmlFor='excel-file-upload' className='bg-white dark:bg-slate-800' startContent={<FaUpload className='size-4 text-black dark:text-white' />}>Importer</Button>
            <Input
                id="excel-file-upload"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleImportExcel}
                className="hidden" // Hide the default input
            /> */}
            <Button
                color="success"
                variant="shadow"
                onClick={handleExportExcel}
                isIconOnly
                startContent={<SiMicrosoftexcel className='size-7 text-white' />}
            >
            </Button>
        </div>
    );
};

export default ExcelImportExport;
