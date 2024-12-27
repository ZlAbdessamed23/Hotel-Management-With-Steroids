"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import TaskHeroImage from "/public/TaskHeroImage.svg";
import TaskImage from "/public/TaskImage.svg";
import CardStyle2 from '../../components/cards/CardStyle2';
import { ModalModeProps, Note, SecondCardItemType, Task } from '@/app/types/types';
import { FaPlus, FaSearch } from "react-icons/fa";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, useDisclosure } from '@nextui-org/react';
import AddTaskModal from '../../components/modals/forms/AddTaskModal';
import CardStyle4 from '../../components/cards/CardStyle4';
import { OperationMode } from '@/app/types/constants';
import DisplayModalStyle3 from '../../components/modals/display/DisplayModalStyle3';
import TasksLineChart from '../../components/charts/TasksLineChart';
import { IoMdArrowDropdown } from 'react-icons/io';
import { getTasks } from '@/app/utils/funcs';
import { RefreshMenuProvider } from '../../components/RefreshTriggerContext';


type TaskType = "all" | "completed" | "nonCompleted";

export default function ManageTasks() {

    const [displayedItem, setDisplayedItem] = useState<Task | Note>({
        id: "",
        title: "",
        description: "",
        deadline: new Date().toISOString(),
        isDone: false,
        receivers: [],
    });
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const props: ModalModeProps<Task> = { isOpen, onOpen, onOpenChange, mode: OperationMode.add, initialData: displayedItem as Task };
    const displayModalProps = useDisclosure();
    const [taskType, settaskType] = useState<TaskType>("all");
    const [tasks, setTasks] = useState<Task[]>();
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

    const doneTasks = tasks?.filter((task) => task.isDone === true).length || 0;
    const item: SecondCardItemType = {
        currentValue: tasks?.length || 0,
        exiting: doneTasks || 0,
        icon: TaskImage,
        increaseValue: 0,
        pourcentage: (doneTasks * 100 / (tasks?.length || 1)) || 0,
        sentence: "déja fais",
        subject: "Taches",
        title: "Nombre Totale",
        id: "",
    };

    async function getAllTasks() {
        const data: { Tasks: Array<Task> } = await getTasks(undefined);
        setTasks(data.Tasks);
    };

    useEffect(() => {
        getAllTasks();
    }, [refreshTrigger]);

    useEffect(() => {
        console.log(refreshTrigger);
    }, [refreshTrigger]);

    useEffect(() => {
        searchTasks(searchTerm);
    }, [tasks, taskType, searchTerm]);

    const searchTasks = (term: string) => {
        const filtered = tasks?.filter((task) => {
            const isMatchingTitle = task.title.toLowerCase().includes(term.toLowerCase());
            const difference = new Date().getTime() - new Date(task.deadline).getTime();
            const isCompleted = difference > 0;

            switch (taskType) {
                case "completed":
                    return isMatchingTitle && isCompleted;
                case "nonCompleted":
                    return isMatchingTitle && !isCompleted;
                default:
                    return isMatchingTitle;
            }
        });

        setFilteredTasks(filtered || []);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    type DayName = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

    type DayCounts = {
        [key in DayName]: number;
    };

    function getTasksForCurrentWeek(tasks: Task[]): { startOfWeek: Date; endOfWeek: Date; dayCounts: DayCounts } {
        const today = new Date();
        const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)

        // Calculate the start of the week (most recent Sunday)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - currentDay);
        startOfWeek.setHours(0, 0, 0, 0);

        // Calculate the end of the week (upcoming Saturday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        // Initialize counters for each day
        const dayCounts: DayCounts = {
            Sunday: 0,
            Monday: 0,
            Tuesday: 0,
            Wednesday: 0,
            Thursday: 0,
            Friday: 0,
            Saturday: 0
        };

        const dayNames: DayName[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Filter tasks and count them for each day
        tasks.forEach(task => {
            const taskDate = new Date(task.deadline);
            if (taskDate >= startOfWeek && taskDate <= endOfWeek) {
                const dayName = dayNames[taskDate.getDay()];
                dayCounts[dayName]++;
            }
        });

        return {
            startOfWeek,
            endOfWeek,
            dayCounts
        };
    };

    const result = getTasksForCurrentWeek(tasks || []);
    const data = [
        ['Jours', 'Taches'],
        ['Dimanche', result.dayCounts.Sunday],
        ['Lundi', result.dayCounts.Monday],
        ['Mardi', result.dayCounts.Tuesday],
        ['Mercredi', result.dayCounts.Wednesday],
        ['Jeudi', result.dayCounts.Thursday],
        ['Vendredi', result.dayCounts.Friday],
        ['Samedi', result.dayCounts.Saturday],
    ];

    return (
        <div className='flex flex-col gap-6 w-full h-full overflow-hidden'>
            <section className='text-white relative lg:mb-60'>
                <div className='w-full h-64 p-4 grid grid-cols-[75%,25%] bg-gradient-to-r from-blue-900 to-blue-600 rounded-xl relative'>
                    <span>
                        <h1 className='text-3xl lg:text-4xl xl:text-5xl font-medium mb-4'>Taches Management</h1>
                        <p className=' text-lg md:text-xl font-medium w-2/3 md:pl-8 mb-12 md:w-fit'>Vous g&eacute;rez toutes les taches dans cette section et avez une r&eacute;flexion approfondie pour organiser votre travail</p>
                    </span>
                    <span>
                        <Image src={TaskHeroImage} alt='' width={150} height={150} className='absolute top-1/4 right-8 sm:top-0 w-36 h-36 md:h-52 md:w-52' />
                    </span>
                </div>
                <div className='gap-2 mt-4 flex flex-col md:gap-8 text-black lg:grid lg:grid-cols-[22.5%,60%] lg:gap-16 lg:absolute lg:top-52 pl-1'>
                    <CardStyle2 infos={item} />
                    <TasksLineChart data={data} title='Taches' />
                </div>
            </section>
            <section className='flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between'>
                <div className='w-4/5'>
                    <Input
                        startContent={<FaSearch className='text-black' />}
                        classNames={
                            {
                                inputWrapper: "border border-gray-500 text-black dark:bg-slate-800 xl:w-[30rem]"
                            }
                        }
                        isClearable
                        className="sm:max-w-[10rem] w-full lg:w-[20rem] xl:w-[30rem]"
                        placeholder="La Recherche par Nom ..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className='flex items-center gap-8'>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button endContent={<IoMdArrowDropdown className='size-5' />} variant="shadow" color={taskType === "all" ? "primary" : taskType === "completed" ? "success" : "danger"}>
                                {taskType === "all" ? "tous" : taskType === "completed" ? "success" : "non-finis"}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu defaultSelectedKeys={"all"}>
                            <DropdownItem key={"all"} onClick={() => settaskType("all")}>All</DropdownItem>
                            <DropdownItem key={"completed"} color='success' className='text-success' onClick={() => settaskType("completed")}>finis</DropdownItem>
                            <DropdownItem key={"nonCompleted"} color="danger" className="text-danger" onClick={() => settaskType("nonCompleted")}>non-finis</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Button className='bg-secondary text-white' endContent={<FaPlus className='size-5' />} onClick={onOpen}>Ajouter une nouvelle Tache</Button>
                    <RefreshMenuProvider setFetchTrigger={setRefreshTrigger}>
                        <AddTaskModal
                            isOpen={props.isOpen}
                            onOpenChange={props.onOpenChange}
                            onOpen={props.onOpen}
                            mode={props.mode}
                            initialData={props.initialData}
                        />
                        <DisplayModalStyle3 data1={displayedItem} title1='Tache' props={displayModalProps} SecondModal={AddTaskModal as React.FC<ModalModeProps<Task | Note>>} dataType='task' />

                    </RefreshMenuProvider>
                </div>
            </section>
            <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 zl:grid-cols-4 gap-4'>
                {
                    filteredTasks.map((item) => (
                        <CardStyle4 DipslayIcon={TaskImage} key={item.id} infos={item} onOpen={displayModalProps.onOpen} setDisplayedItem={setDisplayedItem} />
                    ))
                }
            </section>
        </div>
    )
}
