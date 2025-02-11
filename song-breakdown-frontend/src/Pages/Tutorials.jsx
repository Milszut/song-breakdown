import React from 'react';
import { PageTemplate } from '../Components/PageTemplate.jsx';
import Teams from '../assets/overview.png';
import Library from '../assets/Library.png';
import EditMode from '../assets/EditMode.png';
import PresentMode from '../assets/PresentMode.png';
import Events from '../assets/Events.png';
import { Footer } from '../Components/Footer.jsx';

export const Tutorials = () => {
    return (
        <PageTemplate>
            <div className="h-full overflow-auto overflow-x-hidden w-full scrollbar-none relative">
                <div className="w-full lg:w-5/6 mx-auto flex flex-col items-center gap-5">
                    <div className="text-center text-white bg-[#292929] bg-opacity-80 p-4 lg:rounded-lg w-full">
                        <h1 className="text-5xl font-bold mb-4">Song Brakedown</h1>
                        <p className="text-lg text-justify">
                            An application designed for directing and managing live events and concerts. 
                            It enables comprehensive organization and control over every aspect of production, 
                            from planning to execution.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-2 lg:gap-5 bg-[#292929] bg-opacity-80 p-0 md:p-4 lg:rounded-xl shadow-lg">
                        <div className="w-full md:w-1/2 p-4 md:p-0">
                            <h2 className="text-3xl text-white font-bold mb-2 md:mb-4">Teams</h2>
                            <p className="text-white text-justify">
                                Users can connect with others by forming teams. This feature allows users to create structured teams where each member is assigned a specific role and set of responsibilities. 
                                Team leaders can define objectives, assign roles, and ensure clear communication between all members. 
                                Each team operates within its own dedicated workspace, which includes a library of tracks, a comprehensive list of events, 
                                a catalog of cameras, and a collection of shot descriptions. By providing these tools, this feature fosters a collaborative environment 
                                where teams can adapt dynamically to challenges and execute their projects with a high level of professionalism and coordination.
                            </p>
                        </div>
                        <div className="w-full md:w-1/2">
                            <img 
                                src={Teams} 
                                alt="Control Room" 
                                className="w-full h-auto max-h-[350px] md:rounded-lg shadow-md object-cover"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-2 lg:gap-5 bg-[#292929] bg-opacity-80 p-0 md:p-4 lg:rounded-xl shadow-lg">
                        <div className="w-full md:w-1/2 p-4 md:p-0">
                            <h2 className="text-3xl text-white font-bold mb-2 md:mb-4">Library</h2>
                            <p className="text-white text-justify">
                                The Library is the central hub where users manage their tracks, assign cameras, and define shot descriptions. 
                                This is the space where all creative planning and technical setup take place, enabling users to prepare for their events with precision. 
                                The Library is also the workspace where Edit Mode and Present Mode take place. 
                                In Edit Mode, users meticulously prepare their tracks, shots, and camera configurations. 
                                Present Mode, on the other hand, allows users to review and refine their work, 
                                ensuring that every aspect is perfectly aligned with the planned performance. More about EditMode and Present Mode below.
                            </p>
                        </div>
                        <div className="w-full md:w-1/2">
                            <img 
                                src={Library} 
                                alt="Library" 
                                className="w-full h-auto max-h-[350px] md:rounded-lg shadow-md object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-2 lg:gap-5 bg-[#292929] bg-opacity-80 p-0 md:p-4 lg:rounded-xl shadow-lg">
                        <div className="w-full md:w-1/2 p-4 md:p-0">
                            <h2 className="text-3xl text-white font-bold mb-2 md:mb-4">Edit Mode</h2>
                            <p className="text-white text-justify">
                                In Edit Mode users can precisely break down each track into individual shots. 
                                This feature allows for specifying which camera shots will be executed during specific parts of the track, 
                                ensuring fluidity and visual coherence for each part of the performance. Users can set the duration of each shot, 
                                select the appropriate cameras, and define what shot will be filmed during specific moments of the event.
                            </p>
                        </div>
                        <div className="w-full md:w-1/2">
                            <img 
                                src={EditMode} 
                                alt="Edit Mode" 
                                className="w-full h-auto max-h-[350px] md:rounded-lg shadow-md object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-2 lg:gap-5 bg-[#292929] bg-opacity-80 p-0 md:p-4 lg:rounded-xl shadow-lg">
                        <div className="w-full md:w-1/2 p-4 md:p-0">
                            <h2 className="text-3xl text-white font-bold mb-2 md:mb-4">Present Mode</h2>
                            <p className="text-white text-justify">
                                In Present Mode, users can review and experience the presentation of tracks they have prepared in Edit Mode. 
                                This feature allows users to preview the sequence of shots and camera transitions as they will appear during the actual event, 
                                ensuring that the planned visuals and timing meet their expectations. Users can simulate the flow of the performance, 
                                observing how each shot integrates with specific parts of the track to maintain fluidity and visual coherence.
                                Present Mode provides a real-time playback environment where users can evaluate the duration of each shot 
                                and confirm the alignment of visuals with the intended moments of the event. 
                                This mode helps identify potential adjustments needed for a seamless and professional execution, 
                                offering a final check before moving forward to live production.
                            </p>
                        </div>
                        <div className="w-full md:w-1/2">
                            <img 
                                src={PresentMode} 
                                alt="Present Mode" 
                                className="w-full h-auto max-h-[350px] md:rounded-lg shadow-md object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-2 lg:gap-5 bg-[#292929] bg-opacity-80 p-0 md:p-4 lg:rounded-xl shadow-lg mb-4">
                        <div className="w-full md:w-1/2 p-4 md:p-0">
                            <h2 className="text-3xl text-white font-bold mb-2 md:mb-4">Events</h2>
                            <p className="text-white text-justify">
                                The Events section is the ultimate destination for live production, where all the preparation from the Library comes to life.
                                This is where users assign previously configured tracks to specific events, 
                                seamlessly integrating the work done in Edit Mode and Present Mode into the live workflow. Each event acts as a container for tracks, cameras, and shots, 
                                ensuring that all necessary resources are in place for a flawless production.
                                In addition to managing live operations, Events enables users to plan and schedule upcoming productions. 
                                Events can be assigned specific dates and times, helping teams organize their workflow and prepare for upcoming deadlines. 
                                Users can also invite selected team members to participate in events, ensuring that the right people are involved in executing the production.
                                By linking tracks and teams to events, this feature provides a structured and collaborative approach to live production. 
                                Whether it's managing the technical setup or coordinating team efforts, Events serves as the central hub for turning plans into reality.
                            </p>
                        </div>
                        <div className="w-full md:w-1/2">
                            <img 
                                src={Events} 
                                alt="Events" 
                                className="w-full h-auto max-h-[350px] md:rounded-lg shadow-md object-cover"
                            />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </PageTemplate>
    );
};