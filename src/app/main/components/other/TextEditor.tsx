"use client"

import { ReportWithSteroids } from '@/app/types/types';
import { getLiteEmployees, getLiteEmployees2, updateReport } from '@/app/utils/funcs';
import { Button, Select, SelectItem } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditorCore from "suneditor/src/lib/core";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

type ReportEmployee = {
  id: string;
  firstName: string;
};

const TextEditor: React.FC<{ report: ReportWithSteroids }> = ({ report }) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [reportText, setReportText] = useState<string>(report.content);
  const [receivers, setReceivers] = useState<ReportEmployee[]>([]);
  const [selectedReceivers, setSelectedReceivers] = useState<Array<string>>([]);

  const editor = useRef<SunEditorCore>();
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  function handleInputChange(e: string) {
    setReportText(e);
  };

  function setEmployeesAsReceivers(e : React.ChangeEvent<HTMLSelectElement>) {
    const employees = e.target.value.split(",").filter(value => value.trim() !== "");
    setSelectedReceivers(employees); 
  };

  function submit() {
    const ReportObj : ReportWithSteroids & {employeeAccess : {employeeId : string}[]} = {
      id : report.id,
      title : report.title,
      description : report.description,
      content : reportText,
      employeeAccess: selectedReceivers.map((receiver) => {
        return {
          employeeId: receiver
        }
      }),
      receivers : [],
    };
    updateReport(ReportObj);
  };

  useEffect(() => {
    async function getReceivers() {
      const employees: ReportEmployee[] = (await getLiteEmployees2()).Employees;
      setReceivers(employees);
      if (report.documentAccess && report.documentAccess.length > 0) {
        const preSelectedReceivers = employees
          .filter(employee => report.documentAccess?.some(access => access.employeeId === employee.id))
          .map(employee => employee.id);
        setSelectedReceivers(preSelectedReceivers);
      };
    };
    setMounted(true);
    getReceivers();
  }, []);


  if (!mounted) {
    return (
      <div>Loading...</div>
    )
  };

  return (
    <div>
      <section className='flex justify-end gap-4 items-center'>
        <Button variant='shadow' color='danger'>Delete</Button>
        <Button variant='shadow' color='primary' onClick={() => submit()}>Send</Button>
        <Select selectedKeys={selectedReceivers} selectionMode='multiple' color='secondary' label="Envoyée à" className="max-w-60" onChange={(e) => setEmployeesAsReceivers(e)}>
          {receivers?.map((receiver) => (
            <SelectItem key={receiver.id} value={receiver.id}>
              {receiver.firstName}
            </SelectItem>
          ))}
        </Select>
      </section>
      <section className='sunEditorContainer'>
        <SunEditor
          defaultValue={reportText}
          getSunEditorInstance={getSunEditorInstance}
          onChange={(e) => handleInputChange(e)}
          lang="fr"
          setOptions={{
            buttonList: [
              ['font', 'fontSize', 'formatBlock'],
              ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
              ['fontColor', 'hiliteColor'],
              ['indent', 'outdent', 'align', 'horizontalRule'],
              ['table', 'print'],
            ],
          }}
        />
      </section>
    </div>
  );
};

export default TextEditor;
