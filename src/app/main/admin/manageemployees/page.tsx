import React from 'react'
import EmployeeImage from "/public/EmployeeImage.svg";
import EmployeeImage2 from "/public/EmployeeImage2.svg";
import CardStyle5 from '../../components/cards/CardStyle5';
import { FifthCardItemType, RegisteredEmployee } from '@/app/types/types';
import { Departements, EmployeeState, UserGender} from '@/app/types/constants';
import { ChipProps } from '@nextui-org/react';
import GenericDataGrid from '../../components/other/GenericDataGrid';
import AddEmployeeModal from '../../components/modals/forms/AddEmployeeModal';
import { getAllEmployees } from '@/app/utils/funcs';
import { headers } from 'next/headers';


export default async function ManageEmployees() {

  const headersList = headers();
  const token = headersList.get('cookie') || '';
  const employees : Array<RegisteredEmployee> = (await getAllEmployees(token)).Employees || [];
  const maleNumber = employees?.filter((employee) => employee.gender === UserGender.male).length;
  const receptionDepartementEmployeesNbr = employees?.filter((employee) => employee.departement.includes(Departements.recep)).length;


    const item : FifthCardItemType = {
      speciality : "male",
      icon : EmployeeImage ,
      title : "Nombre d'Employées",
      subject : "Employée",
      currentValue : employees.length || 0,
      pourcentage : maleNumber * 100 / employees.length || 0,
      id: "wsajwjasj"
    };

    const item2 : FifthCardItemType = {
      speciality : "reception dép",
      icon : EmployeeImage2 ,
      title : "Type d'Employées",
      subject : "Employée",
      currentValue : employees.length || 0,
      pourcentage : receptionDepartementEmployeesNbr * 100 / employees.length || 0,
      id : "sawsaswl",
    };

    const employeeColumns = [
      {name: "Email", uid: "email"},
      {name: "Nom", uid: "firstName"},
      {name: "Prénom", uid: "lastName"},
      {name: "DATE OF BIRTH", uid: "dateOfBirth"},
      {name: "PHONE NUMBER", uid: "phoneNumber"},
      {name: "ADDRESS", uid: "address"},
      {name: "NATIONALITY", uid: "nationality"},
      {name: "GENDER", uid: "gender"},
      {name: "Departement", uid: "departement"},
      {name: "Role", uid:"role"},
      {name: "STATE", uid: "state"},
      {name: "ACTIONS", uid: "actions"},
    ];
   
    const employeeStatusColorMap: Record<EmployeeState, ChipProps["color"]> = {
      [EmployeeState.vacation]: "warning",
      [EmployeeState.absent]: "danger",
      [EmployeeState.working]: "success",
    };
  return (
    <div className='w-full overflow-x-hidden'>
      <section className='flex flex-col gap-4  xl:gap-0 xl:flex-row xl:items-center xl:justify-between mb-12 px-2'>
        <CardStyle5 infos={item} />
        <CardStyle5 infos={item2} />
      </section>
      <section className=' w-[25rem] overflow-scroll md:w-[43rem] lg:w-[41rem] xl:overflow-hidden xl:w-[70rem]'>
        <GenericDataGrid columns={employeeColumns} items={employees} statusColorMap={employeeStatusColorMap} Add_Edit_Modal={AddEmployeeModal} comingDataType='employee' />
      </section>
    </div>
  )
}
