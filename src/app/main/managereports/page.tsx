import { ReportCollection } from '@/app/types/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ReportImage from "/public/ReportImage.svg";
import AddReportBtn from './components/AddReportBtn';
import { getReports } from '@/app/utils/funcs';
import { headers } from 'next/headers';

export default async function ManageReports() {

    const headersList = headers();
    const token = headersList.get('cookie') || '';
    const reports: ReportCollection[] = (await getReports(token)).Documents || [];

    return (
        <div>
            <AddReportBtn />
            {
                reports.length > 0 ?
                <section className='flex justify-center md:justify-normal md:items-center flex-wrap gap-2'>
                    {
                        reports.map((report) => (
                            <Link key={report.id} href={`/main/managereports/${report.id}`}>
                                <div className='w-40 h-40 flex flex-col items-center justify-center p-2'>
                                    <Image src={ReportImage} alt='' height={100} width={100} className='mb-2' />
                                    <p className='text-lg font-medium w-full text-ellipsis overflow-hidden text-center'>{report.title}</p>
                                </div>
                            </Link>
                        ))
                    }
                </section> : <div> Pas de Rapports</div>
            }
        </div>
    )
}
