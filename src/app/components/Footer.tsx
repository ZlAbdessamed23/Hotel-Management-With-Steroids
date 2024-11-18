import React from 'react'
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { TiSocialLinkedin } from "react-icons/ti";
import { BiLogoGmail } from "react-icons/bi";
import { IoMdCall } from "react-icons/io";
import Link from 'next/link';

export default function Footer() {
  return (
    <div className='bg-gray-200 py-12 mt-8 dark:bg-slate-800 w-screen overflow-x-hidden' id='contact-div-container'>
      <div className='w-10/12 mx-auto'>
        <section className='flex flex-col justify-center items-center gap-8 md:gap-0 md:flex-row md:items-start md:justify-between mb-8'>
          <span className='w-56 text-primary-500 font-inter'>
            <h2 className='text-3xl text-center font-semibold mb-4'>CloudyVerse</h2>
            <div className='flex justify-between items-center text-primary-500 mb-2'>
              <a href="www.linkedin.com"><TiSocialLinkedin className='size-11 p-3 border border-primary-500 rounded-full' /></a>
              <a href="https://www.facebook.com/"><FaFacebookF className='size-11 p-3 border border-primary-500 rounded-full' /></a>
              <a href="www.facebook.com"><FaXTwitter className='size-11 p-3 border border-primary-500 rounded-full' /></a>
            </div>
            <div className='flex items-center justify-center gap-12'>
              <a href="www.linkedin.com"><BiLogoGmail className='size-11 p-3 border border-primary-500 rounded-full' /></a>
              <a href="https://www.facebook.com/"><IoMdCall className='size-11 p-3 border border-primary-500 rounded-full' /></a>
            </div>
          </span>
          <span>
            <h2 className='text-2xl font-semibold mb-4 text-primary-500'>Quick Links</h2>
            <div className='flex flex-col items-start gap-4'>
              <Link className='text-xl font-medium' href="">contact-us</Link>
              <Link className='text-xl font-medium' href="">about-us</Link>
              <Link className='text-xl font-medium' href="">cloudyverse.com</Link>
            </div>
          </span>
          <span className='w-full flex flex-col justify-center items-center md:w-auto md:block'>
            <h2 className='text-2xl font-semibold mb-4 text-primary-500'>Support & Help</h2>
            <div className='flex flex-col items-start gap-4'>
              <Link className='ml-24 md:ml-0 text-xl font-medium' href="">documentation pour le systeme</Link>
              <Link className='ml-24 md:ml-0 text-xl font-medium' href="">tutorial pour le systeme</Link>
            </div>
          </span>
        </section>
      </div>
      <div className='w-11/12 mx-auto'>
        <p className='text-end ml-8'>© 2024 CloudyVerse.Tous les droits sont preserves</p>
      </div>
    </div>
  )
}
