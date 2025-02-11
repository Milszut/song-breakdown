import React, { Children } from 'react';
import { Navbar } from '../Components/Navbar.jsx';
import { Footer } from '../Components/Footer.jsx';

export const PageTemplate = ({ children }) => {

    return (
        <div className={`bg-[#cc8111] h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] flex flex-col items-center justify-center place-items-center`}>
                <Navbar />
                <div className="flex flex-col h-full overflow-auto bg-gradient-to-b from-[#CC8111] from-5% via-[#FFBB27] via-85% to-[#CC8111] to-100% w-full items-center justify-center place-items-center">
                   {children}
                </div>
        </div>
    );
};