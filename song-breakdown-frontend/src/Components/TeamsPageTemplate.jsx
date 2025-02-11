import React from 'react';
import { Navbar } from '../Components/Navbar.jsx';
import { TeamsNavbar } from '../Components/TeamsNavbar.jsx';
import { TeamsNavbarBottom } from './TeamsNavbarBottom.jsx';

export const TeamsPageTemplate = ({ children }) => {

    return (
            <div className={`bg-[#cc8111] h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] flex flex-col items-center justify-center place-items-center`}>
                <Navbar />
                <TeamsNavbar />
                <div className="flex flex-col h-full overflow-auto bg-gradient-to-b from-[#cc8111] to-black w-full items-center justify-center place-items-center">
                   {children}
                </div>
                <TeamsNavbarBottom />
            </div>
    );
};