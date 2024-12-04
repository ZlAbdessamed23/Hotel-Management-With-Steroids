
import React from 'react'
import ReGlowingLineChart, { DataPoint } from '../components/ReGlowinglLineChart'
import { IconType } from 'react-icons';
import { StaticImageData } from 'next/image';
import Image from 'next/image';
import { FaUserGroup, FaBed } from "react-icons/fa6";
import { FcLineChart } from "react-icons/fc";
import { FcComboChart } from "react-icons/fc";
import ReAreaChart from '../components/ReAreaChart';
import ReLineChart from '../components/ReLineChart';
import { FaChartSimple } from "react-icons/fa6";
import { CircularBarDataType, Stat, StockLineChartDataType } from '@/app/types/types';
import { Progress } from '@nextui-org/react';
import MultiPagesCircularProgress from '../components/MultiPagesCircularProgress';
import { getStatistics } from '@/app/utils/funcs';
import { headers } from 'next/headers';


type StatCardType = {
    title: string;
    icon: IconType | StaticImageData;
    value: number;
};

type MonthlyStats = {
    totalClientPrice: number;
    totalTransactionAmount: number;
};

type WeekDay = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

type MonthNames =
    'January' | 'February' | 'March' | 'April' | 'May' | 'June' |
    'July' | 'August' | 'September' | 'October' | 'November' | 'December';

type FirstHalfMonths = 'January' | 'February' | 'March' | 'April' | 'May' | 'June';
type SecondHalfMonths = 'July' | 'August' | 'September' | 'October' | 'November' | 'December';
type HalfYearMonths = FirstHalfMonths | SecondHalfMonths;

const StatCardItem: React.FC<StatCardType> = (props) => {

    return <div className='grid grid-cols-[30%,70%] px-2 py-4 pb-8 w-80 h-28 text-black bg-white dark:bg-slate-800 rounded-xl shadow-sm font-sans'>
        <section className='flex justify-center items-center'>
            {
                typeof props.icon === "function" ? <props.icon className='size-12 p-1 rounded-md text-black bg-primary-100' />
                    : <Image src={props.icon} alt='' height={48} width={48} className='p-1 rounded-md text-black bg-primary-100' />
            }
        </section>
        <section>
            <p className='text-2xl font-bold dark:text-white'>{props.value}</p>
            <p className='text-xl font-normal text-gray-500 text-opacity-80 dark:text-opacity-100'>{props.title}</p>
        </section>

    </div>
};

export default async function Statistics() {

    const headersList = headers();
    const token = headersList.get('cookie') || '';

    const statData = await getStatistics(token);
    const totalClients = statData.Statistics?.reduce((acc, current) => acc + current.totalClients, 0);
    const totalEmployees = statData.Statistics?.reduce((acc, current) => acc + current.totalEmployees, 0);
    const totalRooms = statData.Statistics?.reduce((acc, current) => acc + current.totalRooms, 0);
    const totalSportHalls = statData.Statistics?.reduce((acc, current) => acc + current.totalSportsFacilities, 0);
    const totalEvents = statData.Statistics?.reduce((acc, current) => acc + current.totalEvents, 0);
    const totalMenus = statData.Statistics?.reduce((acc, current) => acc + current.totalCafeteriaMenu, 0);
    const totalMaleClients = statData.Statistics?.reduce((acc, current) => acc + current.maleClients, 0);
    const totalLocalClients = statData.Statistics?.reduce((acc, current) => acc + current.LocalClient, 0);
    const totalClientsAge = statData.Statistics?.flatMap((data) => data.ClientAge);
    const totalAdultClients = totalClientsAge?.filter((age) => age > 18);


    const progressBarsData = [
        {
            name: "notes",
            value: statData.Statistics?.reduce((acc, current) => acc + current.totalNote, 0)
        },
        {
            name: "taches",
            value: statData.Statistics?.reduce((acc, current) => acc + current.totalTask, 0)
        },
        {
            name: "rapports",
            value: statData.Statistics?.reduce((acc, current) => acc + current.totalReport, 0)
        }
    ];

    function getWeeklyClientStats(data: Stat[]): Record<WeekDay, number> {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);

        const weeklyStats: Record<WeekDay, number> = {
            sunday: 0,
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 0,
            friday: 0,
            saturday: 0
        };

        const dayNames: WeekDay[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        data?.forEach(item => {
            const itemDate = new Date(item.date);
            const diffTime = itemDate.getTime() - startOfWeek.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays >= 0 && diffDays < 7) {
                const dayName = dayNames[diffDays];
                weeklyStats[dayName] += item.totalClients;
            };
        });
        return weeklyStats;
    };

    function getMonthlyClientStats(data: Stat[]): Record<MonthNames, MonthlyStats> {
        const monthlyStats: Record<MonthNames, MonthlyStats> = {
            January: { totalClientPrice: 0, totalTransactionAmount: 0 },
            February: { totalClientPrice: 0, totalTransactionAmount: 0 },
            March: { totalClientPrice: 0, totalTransactionAmount: 0 },
            April: { totalClientPrice: 0, totalTransactionAmount: 0 },
            May: { totalClientPrice: 0, totalTransactionAmount: 0 },
            June: { totalClientPrice: 0, totalTransactionAmount: 0 },
            July: { totalClientPrice: 0, totalTransactionAmount: 0 },
            August: { totalClientPrice: 0, totalTransactionAmount: 0 },
            September: { totalClientPrice: 0, totalTransactionAmount: 0 },
            October: { totalClientPrice: 0, totalTransactionAmount: 0 },
            November: { totalClientPrice: 0, totalTransactionAmount: 0 },
            December: { totalClientPrice: 0, totalTransactionAmount: 0 }
        };

        const monthNames: MonthNames[] = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        data?.forEach(item => {
            const itemDate = new Date(item.date);
            const itemYear = itemDate.getFullYear();
            const itemMonth = itemDate.getMonth();

            if (
                (itemYear === currentYear && itemMonth <= currentMonth) ||
                (itemYear === currentYear - 1 && itemMonth > currentMonth)
            ) {
                const monthName = monthNames[itemMonth];
                monthlyStats[monthName].totalClientPrice += item.ClientPrice;
                monthlyStats[monthName].totalTransactionAmount += item.totalTransactionAmount;
            }
        });

        return monthlyStats;
    };

    const monthlyStat = getMonthlyClientStats(statData.Statistics);

    function getHalfYearlyStockStats(data: Stat[]): Record<HalfYearMonths, number> {
        const today = new Date();
        const currentMonth = today.getMonth();
        const isFirstHalf = currentMonth < 6;
    
        const relevantMonths: HalfYearMonths[] = isFirstHalf
            ? ['January', 'February', 'March', 'April', 'May', 'June']
            : ['July', 'August', 'September', 'October', 'November', 'December'];
    
        const stockStats: Record<HalfYearMonths, number> = {} as Record<HalfYearMonths, number>;
        relevantMonths.forEach(month => {
            stockStats[month] = 0;
        });
    
        const currentYear = today.getFullYear();
    
        data?.forEach(item => {
            const itemDate = new Date(item.date);
            const itemYear = itemDate.getFullYear();
            const itemMonth = itemDate.getMonth();
    
            if (itemYear === currentYear && 
                ((isFirstHalf && itemMonth < 6) || (!isFirstHalf && itemMonth >= 6))) {
                const monthName = relevantMonths[isFirstHalf ? itemMonth : itemMonth - 6];
                stockStats[monthName] += item.totalStockItems;
            }
        });
    
        return stockStats;
    };

    const halfYearData = getHalfYearlyStockStats(statData.Statistics);

    const glowingData: DataPoint[] = [
        { name: 'Jan', value1: monthlyStat.January.totalClientPrice || 0, value2: monthlyStat.January.totalTransactionAmount || 0, value3: (monthlyStat.January.totalClientPrice - monthlyStat.January.totalTransactionAmount) || 0 },
        { name: 'Feb', value1: monthlyStat.February.totalClientPrice || 0, value2: monthlyStat.February.totalTransactionAmount || 0, value3: (monthlyStat.February.totalClientPrice - monthlyStat.January.totalTransactionAmount) || 0 },
        { name: 'Mar', value1: monthlyStat.March.totalClientPrice || 0, value2: monthlyStat.March.totalTransactionAmount || 0, value3: (monthlyStat.March.totalClientPrice - monthlyStat.January.totalTransactionAmount) || 0 },
        { name: 'Apr', value1: monthlyStat.April.totalClientPrice || 0, value2: monthlyStat.April.totalTransactionAmount || 0, value3: (monthlyStat.April.totalClientPrice - monthlyStat.January.totalTransactionAmount) || 0 },
        { name: 'May', value1: monthlyStat.May.totalClientPrice || 0, value2: monthlyStat.May.totalTransactionAmount || 0, value3: (monthlyStat.May.totalClientPrice - monthlyStat.January.totalTransactionAmount) || 0 },
        { name: 'Jun', value1: monthlyStat.June.totalClientPrice || 0, value2: monthlyStat.June.totalTransactionAmount || 0, value3: (monthlyStat.June.totalClientPrice - monthlyStat.January.totalTransactionAmount) || 0 },
        { name: 'Jul', value1: monthlyStat.July.totalClientPrice || 0, value2: monthlyStat.July.totalTransactionAmount || 0, value3: (monthlyStat.July.totalClientPrice - monthlyStat.January.totalTransactionAmount) || 0 },
        { name: 'Aou', value1: monthlyStat.August.totalClientPrice || 0, value2: monthlyStat.August.totalTransactionAmount || 0, value3: (monthlyStat.August.totalClientPrice - monthlyStat.January.totalTransactionAmount) || 0 },
        { name: 'Sep', value1: monthlyStat.September.totalClientPrice || 0, value2: monthlyStat.September.totalTransactionAmount || 0, value3: (monthlyStat.September.totalClientPrice - monthlyStat.January.totalTransactionAmount) || 0 },
        { name: 'Oct', value1: monthlyStat.October.totalClientPrice || 0, value2: monthlyStat.October.totalTransactionAmount || 0, value3: (monthlyStat.October.totalClientPrice - monthlyStat.January.totalTransactionAmount) || 0 },
        { name: 'Nov', value1: monthlyStat.November.totalClientPrice || 0, value2: monthlyStat.November.totalTransactionAmount || 0, value3: (monthlyStat.November.totalClientPrice - monthlyStat.January.totalTransactionAmount) || 0 },
        { name: 'Dec', value1: monthlyStat.December.totalClientPrice || 0, value2: monthlyStat.December.totalTransactionAmount || 0, value3: (monthlyStat.December.totalClientPrice - monthlyStat.January.totalTransactionAmount) || 0 },
    ];


    const weeklyStat = getWeeklyClientStats(statData.Statistics);
    const OBJ = Object.entries(weeklyStat);
    const areaChartData = OBJ.map((data) => {
        return {
            name: data[0],
            value: data[1],
        }
    });

    const firstHalfMonths: FirstHalfMonths[] = ['January', 'February', 'March', 'April', 'May', 'June'];
    const secondHalfMonths: SecondHalfMonths[] = ['July', 'August', 'September', 'October', 'November', 'December'];
    const currMonth = statData.Statistics ? new Date(statData.Statistics[statData.Statistics.length - 1]?.date).toLocaleString('en-US', { month: 'long' }) : new Date().toLocaleString('en-US', { month: 'long' });


    const data: StockLineChartDataType[] = firstHalfMonths.includes(currMonth as FirstHalfMonths) ? [
        { name: 'Jan', value: halfYearData.January },
        { name: 'Feb', value: halfYearData.February },
        { name: 'Mar', value: halfYearData.March },
        { name: 'Apr', value: halfYearData.April },
        { name: 'May', value: halfYearData.May },
        { name: 'Jun', value: halfYearData.June },
    ] : secondHalfMonths.includes(currMonth as SecondHalfMonths) ? [
        { name: 'Jul', value: halfYearData.July },
        { name: 'Aug', value: halfYearData.August },
        { name: 'Sep', value: halfYearData.September },
        { name: 'Oct', value: halfYearData.October },
        { name: 'Nov', value: halfYearData.November },
        { name: 'Dec', value: halfYearData.December },
    ] : [] ;

    const cards: StatCardType[] = [
        {
            icon: FaUserGroup,
            title: "Nombre Totale des Clients",
            value: totalClients,
        },
        {
            icon: FaUserGroup,
            title: "Nombre Totale des Employées",
            value: totalEmployees,
        },
        {
            icon: FaBed,
            title: "Nombre Totale des Chambres",
            value: totalRooms,
        },
    ];

    const cards2: StatCardType[] = [
        {
            icon: FcLineChart,
            title: "Nombre Totale des évennements",
            value: totalEvents || 0,
        },
        {
            icon: FaChartSimple,
            title: "Nombre Totale des salles des sports",
            value: totalSportHalls || 0,
        },
        {
            icon: FcComboChart,
            title: "Nombre Totale des menus",
            value: totalMenus || 0,
        },
    ];

   

    const maxInArr = progressBarsData.reduce((max, item) => {
        return item.value > max ? item.value : max;
    }, progressBarsData[0].value);

    const circularData: CircularBarDataType[] = [
        {
            name: "sexe",
            dataKey1: "homme",
            dataKey2: "femme",
            value1: totalMaleClients || 0,
            value2: (totalClients - totalMaleClients) || 0,
        },
        {
            name: "age",
            dataKey1: "adulte",
            dataKey2: "enfant",
            value1: totalAdultClients?.length || 0,
            value2: (totalClients - totalAdultClients?.length) || 0,
        },
        {
            name: "origin",
            dataKey1: "interne",
            dataKey2: "externe",
            value1: totalLocalClients || 0,
            value2: (totalClients - totalLocalClients) || 0,
        },
    ];

    return (
        <div className='flex flex-col gap-12 w-full overflow-x-hidden'>
            <section className='h-96 w-full'>
                <ReGlowingLineChart data={glowingData} />
            </section>
            <section className='grid pl-7 grid-rows-3 xl:pl-0 xl:grid-rows-none xl:grid-cols-3 w-11/12 mx-auto gap-4 '>
                {
                    cards.map((card) => <StatCardItem key={card.title} icon={card.icon} title={card.title} value={card.value} />)
                }
            </section>
            <section className='grid grid-rows-2 lg:grid-rows-none lg:grid-cols-[60%,40%] gap-4'>
                <div className='p-4 rounded-xl bg-white w-full dark:bg-slate-800 h-96 pt-12'>
                    <ReAreaChart title='Clients' data={areaChartData} />
                </div>
                <div>

                </div>
            </section>
            <section className='grid pl-7 grid-rows-3 lg:pl-0 lg:grid-rows-none lg:grid-cols-3 w-11/12 mx-auto gap-4 '>
                {
                    cards2.map((card) => <StatCardItem key={card.title} icon={card.icon} title={card.title} value={card.value} />)
                }
            </section>
            <section className='w-full grid-rows-3 gap-10 lg:grid-rows-none lg:grid grid-cols-3'>
                <div className='bg-white rounded-xl p-4 shadow-sm dark:bg-slate-800 mb-10'>
                    <h2 className='text-3xl font-semibold mb-4' >Horizontal Bar Chart</h2>
                    <span>
                        {
                            progressBarsData.map((item) => (
                                <div key={item.name} className='mb-4'>
                                    <p className='text-2xl font-normal text-gray-400 text-opacity-85'>{item.value} {item.name}</p>
                                    <Progress classNames={{
                                        base: "bg-transparent",
                                        track: "bg-transparent"
                                    }} size="lg" color='primary' aria-label="Loading..." value={(item.value * 100 / maxInArr)} />
                                </div>
                            ))
                        }
                    </span>

                </div>
                <div className='bg-white rounded-xl p-4 shadow-sm dark:bg-slate-800 mb-10'>
                    <h2 className='text-3xl font-semibold mb-4' >Stock Statistics</h2>
                    <span>
                        <p className='text-xl font-normal text-gray-500 text-opacity-85 mb-4'>le Max Contenu du Stock</p>
                        <div className='flex items-center gap-2 mb-8'>
                            <Progress classNames={{
                                base: "w-2/3",
                                track: "rounded-md",
                                indicator: "rounded-md"
                            }} size="lg" color='secondary' aria-label="Loading..." value={50} />
                            <p className='font-bold text-secondary text-lg'>Max/30%</p>
                        </div>
                    </span>
                    <ReLineChart data={data} />
                </div>
                <div className='bg-white rounded-xl p-4 shadow-sm dark:bg-slate-800 mb-10'>
                    <h2 className='text-3xl font-semibold mb-4' >Categories</h2>
                    <p className='text-xl font-normal text-gray-500 text-opacity-85 mb-6'>Découvrez le profil et la qualité des clients fréquentant votre hôtel.</p>
                    <MultiPagesCircularProgress data={circularData} />
                </div>
            </section>
        </div>
    )
};
