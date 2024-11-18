"use client"

import { EmployeeState } from '@/app/types/constants';
import { ModalProps, RegisteredEmployee } from '@/app/types/types'
import { ChipProps, useDisclosure } from '@nextui-org/react';
import React from 'react'
import GenericDataGrid from '../../components/other/GenericDataGrid';
import AddEmployeeModal from '../../components/modals/forms/AddEmployeeModal';

export default function EmployeesDataGrid({columns , data} : {columns : {name : string , uid : string}[] , data : RegisteredEmployee[]}) {
    const {isOpen , onOpen , onOpenChange} = useDisclosure();
    const props : ModalProps = {isOpen , onOpen , onOpenChange};
    const employeeStatusColorMap: Record<EmployeeState, ChipProps["color"]> = {
        [EmployeeState.vacation]: "warning",
        [EmployeeState.absent]: "danger",
        [EmployeeState.working]: "success",
    };
    return (
        <div>
            <GenericDataGrid columns={columns} items={data}  statusColorMap={employeeStatusColorMap}  Add_Edit_Modal={AddEmployeeModal} comingDataType='employee' />
        </div>
      );
}
