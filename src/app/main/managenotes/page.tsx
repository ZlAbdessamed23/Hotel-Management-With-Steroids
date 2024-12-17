"use client"

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, useDisclosure } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import NoteHeroImage from "/public/NoteHeroImage.svg";
import NoteImage from "/public/NoteImage.svg";
import Image from 'next/image';
import { FaPlus } from 'react-icons/fa6';
import { Note } from '@/app/types/types';
import CardStyle4 from '../components/cards/CardStyle4';
import AddNoteModal from '../components/modals/forms/AddNoteModal';
import { FaSearch } from 'react-icons/fa';
import { OperationMode } from '@/app/types/constants';
import DisplayModalStyle3 from '../components/modals/display/DisplayModalStyle3';
import { getNotes } from '@/app/utils/funcs';
import { IoMdArrowDropdown } from "react-icons/io";
import { RefreshMenuProvider } from '../components/RefreshTriggerContext';
import TodayNotesDisplayModal from '../components/modals/display/TodayNotesDisplayModal';

type NoteType = "all" | "completed" | "nonCompleted" 

export default function ManageNotes() {

    const [refreshTrigger , setRefreshTrigger] = useState<number>(0);
    const [displayedItem, setDisplayedItem] = useState<Note>({
        id: "",
        title: "",
        description: "",
        deadline: new Date().toISOString(),
        isDone: false,
    });
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [noteType, setNoteType] = useState<NoteType>("all");
    const [notes, setNotes] = useState<Note[]>();
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const displayModalProps = useDisclosure();
    const todayNotesDisplayModalProps = useDisclosure();

    async function getAllNotes() {
        const data = await getNotes(undefined);
        setNotes(data.notes);
    };

    useEffect(() => {   
        getAllNotes();
    }, [refreshTrigger]);

   

    useEffect(() => {
        searchNotes(searchTerm);
    }, [notes, noteType, searchTerm]);

    const searchNotes = (term: string) => {
        const filtered = notes?.filter((note) => {
            const isMatchingTitle = note.title.toLowerCase().includes(term.toLowerCase());
            const difference = new Date().getTime() - new Date(note.deadline).getTime();
            const isCompleted = difference > 0;

            switch (noteType) {
                case "completed":
                    return isMatchingTitle && isCompleted;
                case "nonCompleted":
                    return isMatchingTitle && !isCompleted;
                default:
                    return isMatchingTitle;
            }
        });

        setFilteredNotes(filtered || []);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const todayNotes: Note[] = notes?.filter((note) => {
        const noteDate = new Date(note.deadline);
        const today = new Date();
        
        return noteDate.getFullYear() === today.getFullYear() &&
               noteDate.getMonth() === today.getMonth() &&
               noteDate.getDate() === today.getDate();
    }) || [];

    return (
        <div className='text-white flex flex-col gap-10 w-full overflow-hidden'>
            <section className='relative w-full h-64 p-6 grid grid-cols-[75%,25%] bg-gradient-to-r from-blue-900 to-blue-600 rounded-xl'>
                <div>
                    <h1 className='text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium mb-4'>Notes Management</h1>
                    <p className='text-sm md:text-base lg:text-xl font-medium w-2/3 md:pl-8 mb-2 md:w-fit'>Vous g&eacute;rez toutes les notes de cette section et avez une r&eacute;flexion approfondie pour organiser votre travail</p>
                    <Button className='lg:ml-8 bg-success-500 text-white' onClick={todayNotesDisplayModalProps.onOpen}>Les notes d&#39;aujourd&apos;hui</Button>
                </div>
                <div>
                    <Image src={NoteHeroImage} alt='' width={300} height={300} className='absolute top-1/4 right-8 sm:top-0 w-44 h-44 md:h-52 md:w-52 md:top-[15%]' />
                </div>
            </section>
            <section className='flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between'>
                <div className=''>
                    <Input
                        startContent={<FaSearch className='text-black' />}
                        classNames={
                            {
                                inputWrapper: "border border-gray-500 text-black dark:bg-slate-800"
                            }
                        }
                        isClearable
                        className="sm:w-[10rem] w-full lg:w-[20rem]"
                        placeholder="La Recherche par Nom ..." 
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                        
                </div>
                <div className='flex items-center gap-8'>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button endContent={<IoMdArrowDropdown className='size-5' />}  variant="shadow" color={noteType === "all" ? "primary" : noteType === "completed" ? "success" : "danger"}>
                            {noteType === "all" ? "tous" : noteType === "completed" ? "success" : "non-finis"}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu defaultSelectedKeys={"all"}>
                            <DropdownItem key={"all"} onClick={() => setNoteType("all")}>All</DropdownItem>
                            <DropdownItem key={"completed"} color='success' className='text-success' onClick={() => setNoteType("completed")}>finis</DropdownItem>
                            <DropdownItem key={"nonCompleted"} color="danger" className="text-danger" onClick={() => setNoteType("nonCompleted")}>non-finis</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>           
                    <Button className='bg-secondary text-white' endContent={<FaPlus className='size-5' />} onClick={onOpen}>Ajouter une nouvelle Note</Button>
                    <RefreshMenuProvider setFetchTrigger={setRefreshTrigger}>
                        <AddNoteModal isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} mode={OperationMode.add} />
                        <TodayNotesDisplayModal data={todayNotes} displayModalProps={displayModalProps} props={todayNotesDisplayModalProps} setDisplayedItem={setDisplayedItem} />
                        <DisplayModalStyle3 data1={displayedItem} title1='Note' props={displayModalProps} SecondModal={AddNoteModal} dataType='note' />
                    </RefreshMenuProvider>
                </div>
            </section>
            <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {
                    filteredNotes.map((item) => (
                        <CardStyle4 DipslayIcon={NoteImage} key={item.id} infos={item} onOpen={displayModalProps.onOpen} setDisplayedItem={setDisplayedItem} />
                    ))
                }

            </section>
        </div>
    )
}
