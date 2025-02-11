import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TeamsPageTemplate } from '../Components/TeamsPageTemplate.jsx';
import { FormTemplate } from '../Components/FormTemplate.jsx';
import { EventSongAddForm } from '../Components/Forms/EventSongAddForm.jsx';
import { EventSongCard } from '../Components/Cards/EventSongCard.jsx';
import { Error } from '../Components/Error.jsx';
import { PresentModeEvents } from '../Components/Cards/PresentModeEvents.jsx';
import { IoChevronBackOutline } from "react-icons/io5";
import { fetchCameras } from '../Services/cameraService';
import { fetchDescriptions } from '../Services/descriptionService';
import { fetchShotsBySong } from '../Services/shotService';
import { IoIosArrowBack } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { fetchEventDetails, updateEvent, deleteEvent } from '../Services/eventService';
import { EventEditForm } from '../Components/Forms/EventEditForm.jsx';
import { EventDeleteForm } from '../Components/Forms/EventDeleteForm.jsx';
import { fetchEventSongs, addSongToEvent, removeSongFromEvent } from '../Services/eventService';
import { fetchTeamMembers } from '../Services/overviewService.js';
import { webSocketService } from "../Services/webSocketService";
import { useTeam } from "../Components/TeamContext.jsx";
import { useEvent } from "../Components/EventContext.jsx";

export const EventDetails = () => {
    const { teamId } = useTeam();
    const { eventId, setEventId } = useEvent();
    const navigate = useNavigate();
    const [songs, setSongs] = useState([]);
    const [cameras, setCameras] = useState([]);
    const [descriptions, setDescriptions] = useState([]);
    const [shots, setShots] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [currentForm, setCurrentForm] = useState(null);
    const [selectedSongId, setSelectedSongId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isNotAuthorized, setIsNotAuthorized] = useState(false);
    const [isSecondDivVisible, setIsSecondDivVisible] = useState(false);
    const [toggleOption, setToggleOption] = useState('notes');
    const [eventDetails, setEventDetails] = useState(null);
    const [eventSongs, setEventSongs] = useState([]); 
    const [currentUserRole, setCurrentUserRole] = useState(null);

    const handleOnClose = () => setShowPopup(false);

    const openAddSong = () => {
        setCurrentForm('addSong');
        setShowPopup(true);
    };
    
    const fetchData = async () => {
        if (!teamId || !eventId) return;
    
        try {
            const eventSongs = await fetchEventSongs(teamId, eventId);
            setSongs(eventSongs);
            setEventSongs(eventSongs);
    
            const cameraData = await fetchCameras(teamId);
            setCameras(cameraData);
    
            const descriptionData = await fetchDescriptions(teamId);
            setDescriptions(descriptionData);
    
            const eventDetailsData = await fetchEventDetails(teamId, eventId);
            setEventDetails(eventDetailsData);

            const membersResponse = await fetchTeamMembers(teamId);
            setCurrentUserRole(membersResponse.userRole?.role_id || null);
        } catch (error) {
            console.error("Error fetching data:", error);
    
            if (error.message.includes("You don't have access to this team")) {
                setIsNotAuthorized(true);
                setErrorMessage("You do not have access to this team!");
                setTimeout(() => navigate('/teams'), 2000);
            } else {
                setIsNotAuthorized(true);
                setErrorMessage("You do not have access to this Event!");
                setTimeout(() => navigate(`/teams/events`), 2000);
            }
        }
    };    

    useEffect(() => {
        fetchData();
    }, [teamId, eventId, navigate]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1280px)');
        const handleMediaChange = (event) => {
            if (event.matches) {
                setToggleOption('notes');
            }
        };

        mediaQuery.addEventListener('change', handleMediaChange);
        
        if (mediaQuery.matches) {
            setToggleOption('notes');
        }

        return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }, []);
    
    const handleUpdateEvent = async (updatedData) => {
        try {
            const updatedEvent = await updateEvent(eventId, updatedData);
            setEventDetails(updatedEvent);
            setShowPopup(false);
        } catch (error) {
            console.error("Error updating event:", error);
            setErrorMessage("Failed to update the event.");
        }
    };

    const openEditEventForm = () => {
        setCurrentForm('editEvent');
        setShowPopup(true);
    };

    const handleDeleteEvent = async () => {
        try {
            await deleteEvent(eventId);
            navigate('/teams/events');
        } catch (error) {
            console.error("Error deleting event:", error);
            setErrorMessage("Failed to delete the event.");
        }
    };    

    const handleAddSongToEvent = async (songId) => {
        try {
          await addSongToEvent(teamId, eventId, songId);
          fetchData();
        } catch (error) {
          console.error("Error adding song to event:", error);
          setErrorMessage("Failed to add song to the event.");
        }
      };      

    const handleDeleteSong = async (songId) => {
        try {
            await removeSongFromEvent(teamId, eventId, songId);
            setSongs(songs.filter(song => song.id !== songId));
            fetchData();
        } catch (error) {
            console.error("Error removing song from event:", error);
            setErrorMessage("Failed to remove song from the event.");
        }
    };       

    const fetchShots = async (songId) => {
        const shotData = await fetchShotsBySong(songId);
        setShots(shotData);
    };

    const handleSongClick = (song) => {
        setSelectedSongId(song.id);
        setCurrentSong(song);
        fetchShots(song.id);
    
        webSocketService.sendMessage({
            type: 'songSelected',
            songId: song.id,
        });
    };
    
    useEffect(() => {
        const handleMessage = (data) => {
            if (data.type === 'songSelected') {
                console.log("Ustawianie nowej piosenki:", data.songId);
    
                setSelectedSongId(data.songId);
                const newSong = songs.find((song) => song.id === data.songId);
                setCurrentSong(newSong);
                fetchShots(data.songId);
            }
        };
    
        webSocketService.addOnMessageCallback(handleMessage);
    
        return () => {
            webSocketService.removeOnMessageCallback(handleMessage);
        };
    }, [songs]);

    const closeErrorPopup = () => {
        setErrorMessage('');
    };
    
    const handleEventClickBack = () => {
        setEventId(null);
        navigate('/teams/events');
    };    

    return (
        <TeamsPageTemplate>
            <div className="h-full overflow-auto overflow-x-hidden w-full xl:p-2 scrollbar-none relative">
                {isNotAuthorized ? (
                    <div className="w-full h-full"></div>
                ) : (
                    <div className={`h-full flex flex-wrap w-full gap-2`}>
                        <div className={`h-full w-full min-w-[300px] flex flex-col bg-[#292929] bg-opacity-80 xl:rounded-lg xl:w-1/5`}>
                            <div className="flex flex-col p-2 border-b border-white border-opacity-50 xl:h-12 gap-2">
                                <div className="flex items-center text-white text-xl lg:text-2xl">
                                    <IoIosArrowBack
                                        className="cursor-pointer"
                                        onClick={handleEventClickBack}
                                    />
                                    <div className="grow"></div>
                                    <div className="flex text-white text-xl font-medium">
                                        {eventDetails?.name || "Event Name"}
                                    </div>
                                    <div className="grow"></div>
                                    {currentUserRole && (currentUserRole === 1 || currentUserRole === 2) && (
                                        <MdEdit
                                            className="text-2xl hover:cursor-pointer hover:text-red-600"
                                            onClick={openEditEventForm}
                                        />
                                    )}
                                </div>
                                <div className="flex xl:hidden gap-2">
                                    <button
                                        className={`p-1 w-20 text-md rounded-md ${toggleOption === 'notes' ? 'bg-[#cc8111] text-white' : 'text-white border-2 border-[#cc8111] bg-opacity-0'}`}
                                        onClick={() => setToggleOption('notes')}
                                    >
                                        Notes
                                    </button>
                                    <button
                                        className={`p-1 w-20 text-md rounded-md ${toggleOption === 'songs' ? 'bg-[#cc8111] text-white' : 'text-white border-2 border-[#cc8111] bg-opacity-0'}`}
                                        onClick={() => setToggleOption('songs')}
                                    >
                                        Songs
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-auto scrollbar h-full scrollbar-w-1.5 scrollbar-thumb-rounded-full scrollbar-thumb-zinc-50 overflow-y-scroll p-3 flex flex-col gap-2">
                                {toggleOption === 'notes' && 
                                    <div className="flex flex-col text-white h-full">
                                        <div className="flex flex-col text-white h-full">
                                            <div className="flex justify-center items-center gap-2 text-white text-lg font-medium">
                                                <p>{eventDetails?.event_date ? new Date(eventDetails.event_date).toLocaleDateString() : "Date"}</p>
                                                <p>{eventDetails?.event_date ? new Date(eventDetails.event_date).toLocaleDateString('en-US', { weekday: 'long' }) : "Day Name"}</p>
                                                {eventDetails?.event_time? eventDetails.event_time.slice(0, 5): "Time"}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-white text-lg font-medium">Notes</p>
                                                <p>{eventDetails?.notes || "Notes Content"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center">
                                        {currentUserRole && (currentUserRole === 1 || currentUserRole === 2) && (    
                                            <button className="w-36 p-1 rounded-md bg-[#B90000] text-white text-sm font-medium" onClick={() => { setCurrentForm('deleteEvent'); setShowPopup(true); }}>Delete Event</button>
                                        )}
                                        </div>
                                    </div>
                                }
                                {toggleOption === 'songs' && songs.map((song) => (
                                    <EventSongCard
                                        key={song.id}
                                        song={song}
                                        onDelete={() => handleDeleteSong(song.id)}
                                        onClick={() => {
                                            handleSongClick(song);
                                            setIsSecondDivVisible(true);
                                        }}
                                        selectedSongId={selectedSongId}
                                        currentUserRole={currentUserRole}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className={`h-full w-full flex flex-col bg-[#292929] xl:bg-opacity-80 xl:rounded-lg md:min-w-[640px] xl:flex-1 md:h-full absolute xl:relative transition-all duration-500 ease-in-out 
                            ${isSecondDivVisible ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}`}>
                            <div className="flex p-1.5 xl:p-2 border-b gap-1.5 border-white border-opacity-50 h-12">
                                <button className="p-2 h-8 xl:h-9 flex justify-center items-center rounded-md bg-[#cc8111] text-white text-sm font-medium xl:hidden"
                                    onClick={() => setIsSecondDivVisible(false)}>
                                    <IoChevronBackOutline />
                                    Back
                                </button>
                                <div className="grow flex justify-center items-center">
                                    <p className="text-white justify-center items-center text-md xl:text-2xl font-medium text-center">
                                        {currentSong ? `${currentSong.name}` : 'Select Song'}
                                    </p>
                                </div>
                                <button className="pointer-events-none opacity-0 p-2 h-8 xl:h-9 flex justify-center items-center rounded-md bg-[#cc8111] text-white text-sm font-medium xl:hidden"
                                    onClick={() => setIsSecondDivVisible(false)}>
                                    <IoChevronBackOutline />
                                    Back
                                </button>
                            </div>
                            <PresentModeEvents
                                shots={shots}
                                cameras={cameras}
                                descriptions={descriptions}
                                selectedSongId={selectedSongId}
                                isFormOpen={showPopup}
                                currentUserRole={currentUserRole}
                            />
                        </div>

                        <div className={`hidden w-full h-auto md:h-full rounded-lg xl:flex flex-col xl:flex-col gap-2 xl:w-1/5 min-w-[300px]`}>
                            <div className="flex flex-col bg-[#292929] bg-opacity-80 w-full h-80 xl:h-full rounded-lg overflow-auto overflow-x-hidden">
                                <div className="flex p-2 border-b border-white border-opacity-50 h-12">
                                    <p className="grow text-white text-2xl font-medium">Songs</p>
                                    {currentUserRole && (currentUserRole === 1 || currentUserRole === 2) && ( 
                                        <button onClick={openAddSong} className="p-1 lg:p-2 rounded-md bg-[#cc8111] text-white text-sm font-medium">
                                            Add Song
                                        </button>
                                    )}
                                </div>
                                <div className="overflow-auto scrollbar scrollbar-w-1.5 scrollbar-thumb-rounded-full scrollbar-thumb-zinc-50 overflow-y-scroll overflow-x-hidden p-3 flex flex-col gap-2">
                                    {songs.map((song) => (
                                        <EventSongCard
                                            key={song.id}
                                            song={song}
                                            onDelete={() => handleDeleteSong(song.id)}
                                            onClick={() => {
                                                handleSongClick(song);
                                                setIsSecondDivVisible(true);
                                            }}
                                            selectedSongId={selectedSongId}
                                            currentUserRole={currentUserRole}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <FormTemplate onClose={handleOnClose} visible={showPopup}>
                {currentForm === 'editEvent' && <EventEditForm onClose={handleOnClose} onUpdateEvent={handleUpdateEvent} eventData={eventDetails} onRefresh={fetchData} />}
                {currentForm === 'deleteEvent' && (<EventDeleteForm eventName={eventDetails?.name} onClose={handleOnClose} onDelete={handleDeleteEvent} />)}
                {currentForm === 'addSong' && ( <EventSongAddForm teamId={teamId} eventSongs={eventSongs} onAddSongToEvent={handleAddSongToEvent} onClose={handleOnClose} />)}
            </FormTemplate>
            {errorMessage && <Error message={errorMessage} onClose={closeErrorPopup} />}
        </TeamsPageTemplate>
    );
};