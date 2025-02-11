import React, { useEffect, useState } from 'react';
import { MdEventNote } from "react-icons/md";
import { GoHomeFill } from "react-icons/go";
import { FaItunesNote } from "react-icons/fa";
import { LuFileSpreadsheet } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchTeamMembers } from "../Services/overviewService";
import { useTeam } from "../Components/TeamContext";

export const TeamsNavbar = () => {
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { teamId } = useTeam();
    const navigate = useNavigate();
    const location = useLocation();

    const Links = [
        { name: 'Overview', icon: <GoHomeFill />, path: 'overview' },
        { name: 'Events', icon: <MdEventNote />, path: 'events' },
        { name: 'Library', icon: <FaItunesNote />, path: 'library' },
        { name: 'Labels', icon: <LuFileSpreadsheet />, path: 'labels' },
    ];

    useEffect(() => {
        if (!teamId) {
            navigate('/teams');
        } else {
            const fetchData = async () => {
                try {
                    const response = await fetchTeamMembers(teamId);
                    setCurrentUserRole(response.userRole?.role_id);
                } catch (error) {
                    console.error('Error fetching team members:', error);
                    navigate('/teams');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [teamId, navigate]);

    const handleBackClick = () => {
        navigate('/teams');
    };

    const handleNavigation = (path) => {
        navigate(`/teams/${path}`);
    };

    const isActive = (path) => {
        if (path === 'events') {
            return location.pathname.startsWith(`/teams/events`) || location.pathname === `/teams/eventdetails`;
        }
        return location.pathname === `/teams/${path}`;
    };      

    const filteredLinks = currentUserRole === 3
        ? Links.filter(link => link.name !== 'Library' && link.name !== 'Labels')
        : Links;

    if (isLoading) {
        return <div className="text-white text-center">Loading...</div>;
    }

    return (
        <>
            <div className='hidden md:flex h-28 md:h-auto flex-col md:flex-row items-center md:items-start gap-2 p-2 md:p-4 px-4 bg-black w-full'>
                <div 
                    className='flex justify-center items-center gap-2 mx-4 md:m-0 text-nowrap text-white text-xl font-bold border rounded-sm p-2 cursor-pointer'
                    onClick={handleBackClick}
                >
                    <IoIosArrowBack />
                    <span>Back</span>
                </div>
                <ul className='flex items-center justify-center md:justify-normal place-items-center w-full'>
                    {filteredLinks.map((link) => (
                        <li 
                            key={link.name}  
                            className={`m-3 md:m-4 flex items-center justify-center place-items-center my-1 md:my-0 text-white text-xl font-bold ${
                                link.name === 'Labels' ? 'flex xl:hidden' : ''
                            }`}
                        >
                            <button
                                onClick={() => handleNavigation(link.path)}
                                className={`p-2 rounded-md ${
                                    isActive(link.path) ? 'bg-gradient-to-b from-[#cc8111]/0 from-70% to-white to-100% text-white' : 'text-white'
                                }`}
                            >
                                {link.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className='md:hidden h-14 md:h-auto flex flex-col md:flex-row items-start justify-center place-items-center gap-0 md:gap-2 p-2 md:p-4 px-1 bg-black w-full'>
                <div 
                    className='flex justify-center items-center gap-2 md:m-0 text-nowrap text-white text-xl font-bold border rounded-sm p-2 cursor-pointer'
                    onClick={handleBackClick}
                >
                    <IoIosArrowBack />
                    <span>Back To Teams</span>
                </div>
            </div>
        </>
    );
};