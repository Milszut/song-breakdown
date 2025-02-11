import React from 'react';
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { FaTiktok } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";


export const Footer = () => {
   
    return (
        <div className='border-t border-[#292929] grid grid-cols-2 p-4 gap-6 items-center justify-center place-items-center bg-black w-full
                        sm:grid-cols-3 
                        md:flex md:flex-wrap'>
                <a href="https://www.facebook.com/" target="_blank"><div className='md:mx-10 flex gap-2 items-center justify-center place-items-center text-white text-lg font-medium hover:text-[#cc8111]'><FaFacebook className='text-2xl'/>Facebook</div></a>
                <a href="https://www.instagram.com/" target="_blank"><div className='md:mx-10 flex gap-2 items-center justify-center place-items-center text-white text-lg font-medium hover:text-[#cc8111]'><FaInstagram className='text-2xl'/>Instagram</div></a>
                <a href="https://www.youtube.com/" target="_blank"><div className='md:mx-10 flex gap-2 items-center justify-center place-items-center text-white text-lg font-medium hover:text-[#cc8111]'><FaDiscord className='text-2xl'/>Discord</div></a>
                <a href="https://discord.com/" target="_blank"><div className='md:mx-10 flex gap-2 items-center justify-center place-items-center text-white text-lg font-medium hover:text-[#cc8111]'><IoLogoYoutube className='text-2xl'/>YouTube</div></a>
                <a href="https://www.tiktok.com/" target="_blank"><div className='md:mx-10 flex gap-2 items-center justify-center place-items-center text-white text-lg font-medium hover:text-[#cc8111]'><FaTiktok  className='text-2xl'/>TikTok</div></a>
                <a href="https://twitter.com/" target="_blank"><div className='md:mx-10 flex gap-2 items-center justify-center place-items-center text-white text-lg font-medium hover:text-[#cc8111]'><FaTwitter  className='text-2xl'/>Twitter</div></a>
        </div>
    )
}