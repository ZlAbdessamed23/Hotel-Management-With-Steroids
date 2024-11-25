"use client"

import React, { useEffect, useState } from 'react'
import TextEditor from '../../components/other/TextEditor';
import { ReportWithSteroids } from '@/app/types/types';
import { getReport } from '@/app/utils/funcs';


export default function Report({ params }: {
    params: {
        id: string;
    }
}) {

    const [report, setReport] = useState<ReportWithSteroids>();
    const [mounted, setMounted] = useState<boolean>(false);
    async function getCurrentReport() {
        const data = await getReport(params.id);
        console.log(data);
        setReport(data.Document);
    };

    useEffect(() => {
        setMounted(true)
        getCurrentReport();
    }, []);

    if(!mounted) return <div>Loading...</div>

    if (!report) return <div>Le rapport n&#39;&eacute;xiste pas</div>
    return (
        <div>
            <TextEditor report={report} />
        </div>
    )
}
