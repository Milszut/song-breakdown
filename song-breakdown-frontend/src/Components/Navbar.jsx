import React, { useState, useEffect } from 'react';
import { BiCamera, BiUserCircle } from 'react-icons/bi';
import { FaBars, FaXmark } from 'react-icons/fa6';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const [isOpen, setisOpen] = useState(false);
    const [isSmallScreen, setIsMdScreen] = useState(window.innerWidth < 1024);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleResize = () => {
        setIsMdScreen(window.innerWidth < 1024);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    let Links = [
        { name: 'Home', link: '/' },
        { name: 'Tutorials', link: '/Tutorials' },
        { name: 'Contact', link: '/Contact' }
    ];

    if (isLoggedIn) {
        Links.push({ name: 'Teams', link: '/Teams' });
        if (isSmallScreen) {
            Links.push({ name: 'Profile', link: '/Profile' });
            Links.push({ name: 'Sign Out', link: '#' });
        }
    } else {
        if (isSmallScreen) {
            Links.push({ name: 'Login', link: '/Login' });
            Links.push({ name: 'Register', link: '/Register' });
        }
    }

    const handleSignOut = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <div className='flex h-20 lg:flex-row gap-4 p-4 px-5 items-center justify-between place-items-center bg-[#cc8111] w-full'>
            <div className='text-white text-5xl'>
                <Link to="/"><BiCamera /></Link>
            </div>

            <div className='grow lg:grow-0'></div>

            <div className='hidden xl:flex justify-between items-center gap-2 opacity-0 pointer-events-none'>
                <Link to="/Login" className="hover:text-white">
                    <button className='hidden lg:block w-24 text-white font-bold border-4 border-white text-xl rounded-lg hover:text-[#cc8111] hover:bg-white'>Sign In</button>
                </Link>
                <Link to="/Register" className="hover:text-white">
                    <button className='hidden lg:block w-24 bg-white text-[#cc8111] font-bold border-4 border-white text-xl rounded-lg hover:bg-[#cc8111] hover:text-white'>Register</button>
                </Link>
            </div>

            <div onClick={() => setisOpen(!isOpen)} className='cursor-pointer lg:hidden'>
                {isOpen ? <FaXmark className='text-white text-4xl' /> : <FaBars className='text-white text-4xl' />}
            </div>

            <ul className={`items-center justify-center place-items-center absolute bg-[#cc8111] lg:flex lg:grow lg:items-center lg:static w-full ${isOpen ? 'bg-opacity-70 top-20 left-0 z-50 h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-5rem)] backdrop-blur-sm' : 'hidden'}`}>
                {Links.map(link => (
                    <li key={link.name} className='m-10 flex items-center justify-center place-items-center my-5 lg:my-0 text-white text-2xl font-bold'>
                        {link.name === 'Sign Out' ? (
                            <button
                                onClick={handleSignOut}
                                className="p-2 rounded-md text-white font-bold hover:text-[#cc8111] hover:bg-white"
                            >
                                {link.name}
                            </button>
                        ) : (
                            <Link to={link.link} className={`p-2 rounded-md ${location.pathname === link.link ? 'bg-gradient-to-b from-[#cc8111]/0 from-70% to-white to-100% text-white' : 'text-white'}`}>
                                {link.name}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>

            <div className='flex justify-between items-center gap-0 lg:gap-2'>
                {!isLoggedIn && (
                    <>
                        <Link to="/Login">
                            <button className='hidden lg:block w-24 text-white font-bold border-4 border-white text-xl rounded-lg hover:text-[#cc8111] hover:bg-white'>Sign In</button>
                        </Link>
                        <Link to="/Register">
                            <button className='hidden lg:block w-24 bg-white text-[#cc8111] font-bold border-4 border-white text-xl rounded-lg hover:bg-[#cc8111] hover:text-white'>Register</button>
                        </Link>
                    </>
                )}
                {isLoggedIn && (
                    <>
                        <button onClick={handleSignOut} className='hidden lg:block w-24 text-white font-bold border-4 border-white text-xl rounded-lg hover:text-[#cc8111] hover:bg-white'>Sign Out</button>
                        <Link to="/Profile">
                            <div className='hidden lg:block text-white text-5xl'><BiUserCircle /></div>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};