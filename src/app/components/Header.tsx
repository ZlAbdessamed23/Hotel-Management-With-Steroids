"use client"

import { Link as ScrollLink } from 'react-scroll'
import React, { useEffect, useState } from 'react'
import { Button } from '@nextui-org/react'
import { FaMoon, FaSun } from "react-icons/fa";
import Link from 'next/link';
import { useTheme } from 'next-themes';
import Hotiverse from "/public/hotiverse.svg";
import Image from 'next/image';

export default function Header() {
    const [mounted, setMounted] = useState<boolean>(false);
    const { theme, setTheme } = useTheme();
    const [showHeader, setShowHeader] = useState<boolean>(true); // To toggle header visibility
    const [lastScrollY, setLastScrollY] = useState<number>(0); // Track last scroll position

    // Handle scroll behavior
    const controlHeader = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY <= 0) {
            // If at the top, show the header
            setShowHeader(true);
        } else if (currentScrollY > lastScrollY) {
            // If scrolling down, hide the header
            setShowHeader(false);
        } else if (currentScrollY < lastScrollY) {
            // If scrolling up, show the header
            setShowHeader(true);
        }
        setLastScrollY(currentScrollY);
    };


    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', controlHeader);
        return () => {
            window.removeEventListener('scroll', controlHeader);
        };
    }, [lastScrollY]);


    if (!mounted) return <div>Loading ...</div>
    return (
        <header
            className={`px-8 lg:px-16 w-screen overflow-hidden flex flex-row items-center justify-between h-16 border-b-1 border-b-black shadow-md mb-12 dark:shadow-gray-400 dark:border-b-white 
    ${showHeader ? 'translate-y-0' : '-translate-y-20'} 
    transition-transform duration-500 fixed top-0 left-0 w-full bg-white dark:bg-black z-50`} 
        >
            <div className='flex flex-row items-center'>
                <Image src={Hotiverse} alt="hotyverse - gestion de hotelerie logo" className='mr-8' height={30} width={30}  />
                <nav className='w-72 hidden md:block'>
                    <ul className='flex flex-row items-center justify-between'>
                        <li className='cursor-pointer'><ScrollLink to='hero-div-container' spy={true} smooth={true} duration={800} >Home</ScrollLink></li>
                        <li className='cursor-pointer'><ScrollLink to='pricing-div-container' spy={true} smooth={true} duration={1000} >Pricing</ScrollLink></li>
                        <li className='cursor-pointer'><ScrollLink to='about-div-container' spy={true} smooth={true} duration={1200} >About</ScrollLink></li>
                        <li className='cursor-pointer'><ScrollLink to='contact-div-container' spy={true} smooth={true} duration={1400} >Contact Us</ScrollLink></li>
                    </ul>
                </nav>
            </div>
            <div className='flex items-center'>
                <ul className='flex items-center w-48'>
                    <li><Button className='bg-transparent'><Link href="/login">Connecter</Link></Button></li>
                    <li><Button className='bg-primary-400'><ScrollLink to='pricing-div-container' spy={true} smooth={true} duration={1000} >Inscrire</ScrollLink></Button></li>
                </ul>
                <Button className='bg-transparent' isIconOnly={true} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? <FaMoon className='size-6' /> : <FaSun className='size-6' />}</Button>
            </div>

        </header>
    )
}
