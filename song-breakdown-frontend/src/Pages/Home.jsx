import React from 'react';
import { PageTemplate } from '../Components/PageTemplate.jsx';
import Concert from '../assets/concert.jpeg';
import ControlRoom from '../assets/control-room.jpeg';
import Console from '../assets/console.jpeg';
import { Footer } from '../Components/Footer.jsx';


export const Home = () => { 
   
     return (
        <PageTemplate>
            <div className="h-full overflow-auto overflow-x-hidden w-full scrollbar-none relative">
                <div className='h-full w-full flex flex-col items-center gap-4'>
                    <div className='w-full lg:w-2/3 h-auto items-center justify-end gap-2 flex flex-col bg-[#292929] bg-opacity-80 lg:rounded-xl p-0 lg:p-4'>
                        <h1 className='text-4xl text-white font-bold'>Live Events</h1>
                        <p className='p-2 lg:p-0 grow text-xl text-white text-justify'>
                            Perfectly direct every frame of your event. With intuitive shot sequence planning and full coordination of the camera team, each show becomes an unforgettable experience.
                        </p>
                        <img src={Concert} alt="Concert" className="w-full max-h-[600px] lg:rounded-lg shadow-md"/>
                    </div>
                    <div className='w-full lg:w-2/3 h-auto items-center justify-end gap-2 flex flex-col bg-[#292929] bg-opacity-80 lg:rounded-xl p-0 lg:p-4'>
                        <h1 className='text-4xl text-white font-bold'>Production Control Room</h1>
                        <p className='p-2 lg:p-0 grow text-xl text-white text-justify'>
                            Get to know the professional control room with complete camera and shot control. Real-time support provides flexibility and precision, delivering the highest quality live broadcast.
                        </p> 
                        <img src={ControlRoom} alt="Control Room" className="w-full max-h-[900px] lg:rounded-lg shadow-md"/>
                    </div>
                    <div className='w-full lg:w-2/3 h-auto items-center justify-end gap-2 flex flex-col bg-[#292929] bg-opacity-80 lg:rounded-xl p-0 lg:p-4'>
                        <h1 className='text-4xl text-white font-bold'>Intuitive Planning</h1>
                        <p className='p-2 lg:p-0 grow text-xl text-white text-justify'>
                            Intuitive interface is the key to efficient collaboration and team synchronization. From planning scenarios to dynamically adapting to real-time changes, the app ensures a professional execution of every event.
                        </p>
                        <img src={Console} alt="Logic Pro" className="w-full max-h-[800px] lg:rounded-lg shadow-md"/>
                    </div>
                    <Footer />
                </div>
            </div>
        </PageTemplate>
    );
}