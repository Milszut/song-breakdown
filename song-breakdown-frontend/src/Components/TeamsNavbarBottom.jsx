import React, { useEffect, useState } from 'react'; 
import { MdEventNote } from "react-icons/md";
import { GoHomeFill } from "react-icons/go";
import { FaItunesNote } from "react-icons/fa";
import { LuFileSpreadsheet } from "react-icons/lu";
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchTeamMembers } from '../Services/overviewService';
import { useTeam } from '../Components/TeamContext';

export const TeamsNavbarBottom = () => {
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { teamId } = useTeam();

    useEffect(() => {
        if (teamId) {
            const fetchRole = async () => {
                try {
                    const response = await fetchTeamMembers(teamId);
                    setCurrentUserRole(response.userRole?.role_id);
                } catch (error) {
                    console.error("Error fetching team members:", error);
                }
            };
            fetchRole();
        }
    }, [teamId]);

    let Links = [
        { name: 'Overview', icon: <GoHomeFill />, link: 'overview' },
        { name: 'Events', icon: <MdEventNote />, link: 'events' },
    ];

    if (currentUserRole === 1 || currentUserRole === 2) {
        Links.push(
            { name: 'Library', icon: <FaItunesNote />, link: 'library' },
            { name: 'Labels', icon: <LuFileSpreadsheet />, link: 'labels' }
        );
    }

    const handleNavigation = (link) => {
        navigate(`/teams/${link}`); 
    };

    const isActive = (path) => {
        if (path === 'events') {
            return location.pathname.startsWith(`/teams/events`) || location.pathname === `/teams/eventdetails`;
        }
        return location.pathname === `/teams/${path}`;
    }; 

    return (
        <>
            <div className='md:hidden h-14 md:h-auto flex flex-col md:flex-row border-t border-stone-700 items-center justify-center place-items-center gap-0 md:gap-2 p-2 md:p-4 px-4 bg-black w-full'>
                <ul className='flex h-full items-center justify-center md:justify-normal place-items-center w-full'>
                    {teamId && Links.map((link) => (
                        <li 
                            key={link.name} 
                            className='m-4 md:m-4 flex h-full items-center justify-center place-items-center my-0 md:my-0 text-md font-bold'
                        >
                            <button 
                                onClick={() => handleNavigation(link.link)}
                                className={`flex flex-col items-center justify-center p-1 rounded-md ${
                                    isActive(link.link) ? 'text-white' : 'text-gray-400'
                                }`}
                            >
                                {link.icon}
                                {link.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};