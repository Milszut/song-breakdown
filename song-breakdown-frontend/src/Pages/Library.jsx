import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { TeamsPageTemplate } from '../Components/TeamsPageTemplate.jsx';
import { FormTemplate } from '../Components/FormTemplate.jsx';
import { SongAddForm } from '../Components/Forms/SongAddForm.jsx';
import { SongEditForm } from '../Components/Forms/SongEditForm.jsx';
import { SongDeleteForm } from '../Components/Forms/SongDeleteForm.jsx';
import { CameraAddForm } from '../Components/Forms/CameraAddForm.jsx';
import { CameraEditForm } from '../Components/Forms/CameraEditForm.jsx';
import { CameraDeleteForm } from '../Components/Forms/CameraDeleteForm.jsx';
import { DescriptionAddForm } from '../Components/Forms/DescriptionAddForm.jsx';
import { DescriptionEditForm } from '../Components/Forms/DescriptionEditForm.jsx';
import { DescriptionDeleteForm } from '../Components/Forms/DescriptionDeleteForm.jsx';
import { SongCard } from '../Components/Cards/SongCard.jsx';
import { CameraCard } from '../Components/Cards/CameraCard.jsx';
import { DescriptionCard } from '../Components/Cards/DescriptionCard.jsx';
import { Error } from '../Components/Error.jsx';
import { EditMode } from '../Components/Cards/EditMode.jsx';
import { PresentMode } from '../Components/Cards/PresentMode.jsx';
import { IoChevronBackOutline } from "react-icons/io5";
import { fetchTeamMembers } from '../Services/overviewService.js';
import { useTeam } from "../Components/TeamContext";

import { fetchSongs, addSong, updateSong, deleteSong } from '../Services/songService';
import { fetchCameras, addCamera, updateCamera, deleteCamera, updateCameraColor } from '../Services/cameraService';
import { fetchDescriptions, addDescription, updateDescription, deleteDescription } from '../Services/descriptionService';
import { fetchShotsBySong, addShot, updateShot, deleteShot } from '../Services/shotService';

export const Library = () => {
    const { teamId } = useTeam();
    const navigate = useNavigate();
    const [songs, setSongs] = useState([]);
    const [cameras, setCameras] = useState([]);
    const [descriptions, setDescriptions] = useState([]);
    const [shots, setShots] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [currentForm, setCurrentForm] = useState(null);
    const [currentCamera, setCurrentCamera] = useState(null);
    const [currentDescription, setCurrentDescription] = useState(null);
    const [selectedSongId, setSelectedSongId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPresentMode, setIsPresentMode] = useState(false);
    const [isNotAuthorized, setIsNotAuthorized] = useState(false);
    const [isSecondDivVisible, setIsSecondDivVisible] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState(null);
    
    const handleOnClose = () => setShowPopup(false);

    const openAddSong = () => {
        setCurrentForm('addSong');
        setShowPopup(true);
    };

    const openEditSong = (song) => {
        setCurrentSong(song);
        setCurrentForm('editSong');
        setShowPopup(true);
    };

    const openDeleteSong = (song) => {
        setCurrentSong(song);
        setCurrentForm('deleteSong');
        setShowPopup(true);
    };

    const openAddCamera = () => {
        setCurrentForm('addCamera');
        setShowPopup(true);
    };

    const openEditCamera = (camera) => {
        setCurrentCamera(camera);
        setCurrentForm('editCamera');
        setShowPopup(true);
    };

    const openDeleteCamera = (camera) => {
        setCurrentCamera(camera);
        setCurrentForm('deleteCamera');
        setShowPopup(true);
    };

    const openAddDescription = () => {
        setCurrentForm('addDescription');
        setShowPopup(true);
    };

    const openEditDescription = (description) => {
        setCurrentDescription(description);
        setCurrentForm('editDescription');
        setShowPopup(true);
    };

    const openDeleteDescription = (description) => {
        setCurrentDescription(description);
        setCurrentForm('deleteDescription');
        setShowPopup(true);
    };
    
     useEffect(() => {
            if (!teamId) {
                console.error('No teamId found in context. Redirecting to /teams.');
                navigate('/teams');
            }
    }, [teamId, navigate]);  

    useEffect(() => {

        const fetchData = async () => {
            if (!teamId) return;

            try {
                const songData = await fetchSongs(teamId);
                setSongs(songData);

                const cameraData = await fetchCameras(teamId);
                setCameras(cameraData);

                const descriptionData = await fetchDescriptions(teamId);
                setDescriptions(descriptionData);

                const membersResponse = await fetchTeamMembers(teamId);
                setCurrentUserRole(membersResponse.userRole?.role_id || null);
            } catch (error) {
                console.error("Error fetching data:", error);

                if (error.message.includes("You don't have access to this team")) {
                    setIsNotAuthorized(true);
                    setErrorMessage("You do not have access to this team!");
                    setTimeout(() => navigate('/teams'), 3000);
                } else {
                    setErrorMessage('An unexpected error occurred');
                }
            }
        };

        fetchData();
    }, [teamId, navigate]);

    const handleAddSong = async (name) => {
        if (!teamId) return;
        const newSong = await addSong(name, teamId);
        setSongs([...songs, newSong]);
        setCurrentSong(newSong);
        setSelectedSongId(newSong.id);
        fetchShots(newSong.id);
    };    

    const handleUpdateSong = async (id, name) => {
        await updateSong(id, name);
        setSongs(songs.map(song => (song.id === id ? { ...song, name } : song)));
        if (currentSong && currentSong.id === id) {
            setCurrentSong({ ...currentSong, name });
        }
    };    

    const handleDeleteSong = async (id) => {
        await deleteSong(id);
        setSongs(songs.filter(song => song.id !== id));
        setShots(shots.filter(shot => shot.song_id !== id));
        if (currentSong && currentSong.id === id) {
            setCurrentSong(null);
        }
    };    

    const handleAddCamera = async (name, color = 'bg-white') => {
        if (!teamId) {
            console.error("teamId is missing");
            return;
        }
    
        try {
            const newCamera = await addCamera(name, color, teamId);
            setCameras((prevCameras) => [...prevCameras, newCamera]);
        } catch (error) {
            console.error("Error adding camera:", error.message || error);
        }
    };    

    const handleUpdateCamera = async (id, name) => {
        await updateCamera(id, name);
        setCameras(cameras.map(camera => (camera.id === id ? { ...camera, name } : camera)));
    };

    const handleUpdateCameraColor = async (id, color) => {
        await updateCameraColor(id, color);
        setCameras(cameras.map(camera => (camera.id === id ? { ...camera, color } : camera)));
      };

    const handleDeleteCamera = async (id) => {
        try {
            await deleteCamera(id);
            setCameras(cameras.filter(camera => camera.id !== id));
        } catch (error) {
            if (error.message.includes('Cannot delete camera')) {
                setErrorMessage('This Camera is being used!');
            } else {
                setErrorMessage('Error deleting camera');
            }
        }
    };

    const handleAddDescription = async (name) => {
        if (!teamId) return;
        const newDescription = await addDescription(name, teamId);
        setDescriptions([...descriptions, newDescription]);
    };    

    const handleUpdateDescription = async (id, name) => {
        await updateDescription(id, name);
        setDescriptions(descriptions.map(description => (description.id === id ? { ...description, name } : description)));
    };

    const handleDeleteDescription = async (id) => {
        try {
            await deleteDescription(id);
            setDescriptions(descriptions.filter(description => description.id !== id));
        } catch (error) {
            if (error.message.includes('Cannot delete description')) {
                setErrorMessage('This Description is being Used!');
            } else {
                setErrorMessage('Error deleting description');
            }
        }
    };

    const fetchShots = async (songId) => {
        const shotData = await fetchShotsBySong(songId);
        setShots(shotData);
    };

    const handleAddShot = async (songId) => {
        const newShot = await addShot(songId);
        setShots([...shots, newShot]);
    };

    const handleUpdateShot = async (id, camera_id, description_id, duration) => {
        await updateShot(id, camera_id, description_id, duration);
        setShots(shots.map(shot => (shot.id === id ? { ...shot, camera_id, description_id, duration } : shot)));

        await fetchShots(currentSong.id);
    };
    
    const handleDeleteShot = async (id) => {
        await deleteShot(id);
        setShots(shots.filter(shot => shot.id !== id));
    };

    const handleSongClick = (song) => {
        setSelectedSongId(song.id);
        setCurrentSong(song);
        fetchShots(song.id);
    };

    const toggleMode = () => {
        const newMode = !isPresentMode;
        setIsPresentMode(newMode);
    };

    const calculateTotalDuration = () => {
        if (!shots || shots.length === 0) return 0; 
        const total = shots.reduce((sum, shot) => {
            const duration = parseFloat(shot.duration) || 0;
            return sum + duration;
        }, 0);
        return parseFloat(total.toFixed(1));
    };
    

    const closeErrorPopup = () => {
        setErrorMessage('');
    };
    
    return (
        <TeamsPageTemplate>
            <div className="h-full overflow-auto overflow-x-hidden w-full lg:p-2 scrollbar-none relative">
                {isNotAuthorized ? (
                    <div className="w-full h-full"></div>
                ) : (
                <div className={`h-full flex flex-wrap w-full gap-2 ${isPresentMode ? 'xl:gap-0 ' : 'xl:gap-2'}`}>
                    <div className={`h-full w-full min-w-[300px] flex flex-col bg-[#292929] bg-opacity-80 lg:rounded-lg lg:w-1/5`}>
                        <div className="flex p-2 border-b border-white border-opacity-50 h-[52px]">
                            <p className="grow text-white text-xl lg:text-2xl font-medium">Library</p>
                            {(currentUserRole === 1 || currentUserRole === 2) && (
                                <button onClick={openAddSong} className="p-1 lg:p-2 rounded-md bg-[#cc8111] text-white text-sm font-medium">
                                    Add Song
                                </button>
                            )}
                        </div>
                        <div className="overflow-auto scrollbar scrollbar-w-1.5 scrollbar-thumb-rounded-full scrollbar-thumb-zinc-50 overflow-y-scroll p-3 flex flex-col gap-2">
                            {songs.map((song) => (
                            <SongCard
                                key={song.id}
                                song={song}
                                onDelete={() => openDeleteSong(song)}
                                onEdit={openEditSong}
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
 
                    <div className={`h-full w-full flex flex-col bg-[#292929] lg:bg-opacity-80 lg:rounded-lg md:min-w-[640px] lg:flex-1 md:h-full absolute lg:relative transition-all duration-500 ease-in-out 
                        ${isSecondDivVisible ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} ${isPresentMode ? 'xl:ml-2' : 'xl:ml-0'}`}>

                        <div className="flex p-1.5 lg:p-2 border-b gap-1.5 border-white border-opacity-50 h-[52px]">
                            <button className="p-2 h-8 lg:h-9 flex justify-center items-center rounded-md bg-[#cc8111] text-white text-sm font-medium lg:hidden"
                                    onClick={() => setIsSecondDivVisible(false)}>
                                <IoChevronBackOutline />
                                Back
                            </button>
                            <button className="flex items-center justify-between h-8 lg:h-9 w-28 lg:w-32 rounded-md border-2 border-[#cc8111] cursor-pointer relative" onClick={toggleMode}>
                                <div className={`absolute w-1/2 h-full rounded-sm bg-[#cc8111] border-10 border-[#cc8111] transition-transform duration-300 ease-in-out 
                                    ${isPresentMode ? 'translate-x-full' : ''}`}>
                                </div>
                                <span className={`w-1/2 text-sm font-medium text-center z-10 ${isPresentMode ? 'text-gray-400' : 'text-white'}`}>
                                    Edit
                                </span>
                                <span className={`w-1/2 text-sm font-medium text-center z-10 ${isPresentMode ? 'text-white' : 'text-gray-400'}`}>
                                    Present
                                </span>
                            </button>
                            <div className="grow flex justify-center items-center">
                                <p className="text-white justify-center items-center text-md lg:text-2xl font-medium text-center">
                                    {currentSong ? `${currentSong.name}` : 'Select Song'}
                                </p>
                            </div>  
                            <div className="flex justify-end w-18 lg:w-32">
                                {(currentUserRole === 1 || currentUserRole === 2) && (
                                    <button onClick={() => handleAddShot(currentSong.id)}
                                            className={`p-1 lg:p-2 justify-center items-center rounded-md bg-[#cc8111] text-white text-sm font-medium transition-opacity duration-500 ${
                                            isPresentMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                        Add New
                                    </button>
                                )}
                            </div>
                        </div>

                        {isPresentMode ? (
                            <PresentMode
                            shots={shots}
                            cameras={cameras}
                            descriptions={descriptions}
                            selectedSongId={selectedSongId}
                            isFormOpen={showPopup}
                            />
                        ) : (
                            <EditMode
                            shots={shots}
                            cameras={cameras}
                            descriptions={descriptions}
                            handleUpdateShot={handleUpdateShot}
                            handleDeleteShot={handleDeleteShot}
                            totalDuration={calculateTotalDuration()}
                            currentUserRole={currentUserRole}
                            />
                        )}
                    </div>

                    <div className={`hidden w-full h-auto md:h-full rounded-lg xl:flex flex-col xl:flex-col gap-2 transition-all duration-500 ease-in-out ${isPresentMode ? 'xl:w-0 xl:min-w-0' : 'xl:w-1/5 min-w-[300px]'}`}>
                        <div className="flex flex-col bg-[#292929] bg-opacity-80 w-full h-80 xl:h-1/2 rounded-lg overflow-auto overflow-x-hidden">
                            <div className="flex p-2 border-b border-white border-opacity-50 h-[52px]">
                                <p className="grow text-white text-2xl font-medium">Cameras</p>
                                {(currentUserRole === 1 || currentUserRole === 2) && (
                                <button className="p-2 rounded-md bg-[#cc8111] text-white text-sm font-medium"
                                        onClick={openAddCamera}>
                                    Add Camera
                                </button>
                                )}
                            </div>
                            <div className="overflow-auto scrollbar scrollbar-w-1.5 scrollbar-thumb-rounded-full scrollbar-thumb-zinc-50 overflow-y-scroll overflow-x-hidden p-3 flex flex-col gap-6">
                                {cameras.map((camera) => (
                                    <CameraCard
                                    key={camera.id}
                                    camera={camera}
                                    onDelete={() => openDeleteCamera(camera)}
                                    onEdit={openEditCamera}
                                    onUpdateColor={handleUpdateCameraColor}
                                    currentUserRole={currentUserRole}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col bg-[#292929] bg-opacity-80 w-full h-80 xl:h-1/2 rounded-lg overflow-auto overflow-x-hidden">
                            <div className="flex p-2 border-b border-white border-opacity-50 h-[52px]">
                                <p className="grow text-white text-2xl font-medium">Descriptions</p>
                                {(currentUserRole === 1 || currentUserRole === 2) && (
                                <button className="p-2 rounded-md bg-[#cc8111] text-white text-sm font-medium"
                                        onClick={openAddDescription}>
                                    Add Description
                                </button>
                                )}
                            </div>
                            <div className="overflow-auto scrollbar scrollbar-w-1.5 scrollbar-thumb-rounded-full scrollbar-thumb-zinc-50 overflow-y-scroll overflow-x-hidden p-3 flex flex-col gap-6">
                                {descriptions.map((description) => (
                                    <DescriptionCard
                                    key={description.id}
                                    description={description}
                                    onDelete={() => openDeleteDescription(description)}
                                    onEdit={openEditDescription}
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
                {currentForm === 'addSong' && <SongAddForm onClose={handleOnClose} onAddSong={handleAddSong} />}
                {currentForm === 'editSong' && <SongEditForm onClose={handleOnClose} song={currentSong} onUpdateSong={handleUpdateSong} />}
                {currentForm === 'deleteSong' && <SongDeleteForm onClose={handleOnClose} song={currentSong} onDelete={handleDeleteSong} />}
                {currentForm === 'addCamera' && <CameraAddForm onClose={handleOnClose} onAddCamera={handleAddCamera} />}
                {currentForm === 'editCamera' && <CameraEditForm onClose={handleOnClose} camera={currentCamera} onUpdateCamera={handleUpdateCamera} />}
                {currentForm === 'deleteCamera' && <CameraDeleteForm onClose={handleOnClose} camera={currentCamera} onDelete={handleDeleteCamera} />}
                {currentForm === 'addDescription' && <DescriptionAddForm onClose={handleOnClose} onAddDescription={handleAddDescription} />}
                {currentForm === 'editDescription' && <DescriptionEditForm onClose={handleOnClose} description={currentDescription} onUpdateDescription={handleUpdateDescription} />}
                {currentForm === 'deleteDescription' && <DescriptionDeleteForm onClose={handleOnClose} description={currentDescription} onDelete={handleDeleteDescription} />}
            </FormTemplate>
            {errorMessage && <Error message={errorMessage} onClose={closeErrorPopup} />}
        </TeamsPageTemplate>
    );
}