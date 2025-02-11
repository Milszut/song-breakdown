import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TeamsPageTemplate } from '../Components/TeamsPageTemplate.jsx';
import { FormTemplate } from '../Components/FormTemplate.jsx';
import { EventAddForm } from '../Components/Forms/EventAddForm.jsx';
import { Error } from '../Components/Error.jsx';
import { fetchEvents, addEvent } from '../Services/eventService';
import { fetchTeamMembers } from '../Services/overviewService.js';
import { useTeam } from '../Components/TeamContext.jsx';
import { useEvent } from '../Components/EventContext.jsx';

export const Events = () => {
    const { teamId } = useTeam();
    const { setEventId } = useEvent();

    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [isNotAuthorized, setIsNotAuthorized] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentUserRole, setCurrentUserRole] = useState(null);

    const handleOnClose = () => setShowPopup(false);

    const openAddEvent = () => setShowPopup(true);

    const closeErrorPopup = () => setErrorMessage('');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!teamId) return;

            try {
                const eventData = await fetchEvents(teamId);
                setEvents(eventData);

                const membersResponse = await fetchTeamMembers(teamId);
                setCurrentUserRole(membersResponse.userRole?.role_id || null);

            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.message.includes("You don't have access to this team")) {
                    setIsNotAuthorized(true);
                    setErrorMessage('You do not have access to this team!');
                    setTimeout(() => navigate('/teams'), 3000);
                } else {
                    setErrorMessage('An unexpected error occurred');
                }
            }
        };

        fetchData();
    }, [teamId, navigate]);

    const handleAddEvent = async (event) => {
        if (!teamId) return;

        try {
            const newEvent = await addEvent(teamId, event);
            setEvents([...events, newEvent]);
            setShowPopup(false);
        } catch (error) {
            console.error('Error adding event:', error);
            setErrorMessage('Failed to add event');
        }
    };

    const handleEventClick = (eventId) => {
        setEventId(eventId);
        navigate('/teams/eventdetails');
    };

    return (
        <TeamsPageTemplate>
            <div className="h-full overflow-auto overflow-x-hidden w-full scrollbar-none relative">
                {isNotAuthorized ? (
                    <div className="w-full h-full"></div>
                ) : (
                    <div className="h-full w-full flex flex-col items-center">
                        <div className="flex flex-col h-full bg-[#292929] bg-opacity-80 w-full lg:w-5/6 xl:w-2/3 overflow-hidden">
                            <div className="w-full flex border-b h-20 justify-center items-center p-4">
                                <h1 className="text-4xl text-white">Your Events</h1>
                                <div className="grow"></div>

                                {currentUserRole && (currentUserRole === 1 || currentUserRole === 2) && (
                                    <button
                                        className="w-44 p-1 rounded-md bg-[#cc8111] text-white text-sm font-medium"
                                        onClick={openAddEvent}
                                    >
                                        Create New Event
                                    </button>
                                )}
                            </div>
                            <div className="w-full flex items-end gap-4 bg-[#201616] bg-opacity-80 justify-center px-5 p-2">
                                <div className="flex w-72 text-lg md:text-2xl text-white rounded-md font-medium">Event Name</div>
                                <div className='grow'></div>
                                <div className="flex justify-center w-20 lg:w-24 text-lg md:text-xl text-white rounded-md font-medium">Date</div>
                                <div className="flex justify-center w-20 lg:w-24 text-lg md:text-xl text-white rounded-md font-medium">Time</div>
                            </div>
                            <div className="flex flex-col gap-2 w-full opacity-80 h-full overflow-y-auto scrollbar scrollbar-w-0.5 lg:scrollbar-w-1.5 scrollbar-thumb-rounded-full scrollbar-thumb-zinc-50 p-2">
                                {events.map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-end justify-center gap-4 w-full bg-[#201616] bg-opacity-80 p-3 rounded-md cursor-pointer hover:bg-opacity-100 transition"
                                        onClick={() => handleEventClick(event.id)}
                                    >
                                        <div className="flex w-72 text-lg md:text-2xl text-white rounded-md font-medium">
                                            {event.name}
                                        </div>
                                        <div className='grow'></div>
                                        <div className="flex justify-center w-20 lg:w-24 text-lg md:text-xl text-white rounded-md font-medium">
                                            {formatDate(event.event_date)}
                                        </div>
                                        <div className="flex justify-center w-20 lg:w-24 text-lg md:text-xl text-white rounded-md font-medium">
                                            {formatTime(event.event_time)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <FormTemplate onClose={handleOnClose} visible={showPopup}>
                <EventAddForm onClose={handleOnClose} onAddEvent={handleAddEvent} />
            </FormTemplate>
            {errorMessage && <Error message={errorMessage} onClose={closeErrorPopup} />}
        </TeamsPageTemplate>
    );
}; 