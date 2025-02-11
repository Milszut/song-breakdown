import { useState, useEffect } from "react";
import { TeamsPageTemplate } from '../Components/TeamsPageTemplate.jsx';
import { FormTemplate } from '../Components/FormTemplate.jsx';
import { CameraAddForm } from '../Components/Forms/CameraAddForm.jsx';
import { CameraEditForm } from '../Components/Forms/CameraEditForm.jsx';
import { CameraDeleteForm } from '../Components/Forms/CameraDeleteForm.jsx';
import { DescriptionAddForm } from '../Components/Forms/DescriptionAddForm.jsx';
import { DescriptionEditForm } from '../Components/Forms/DescriptionEditForm.jsx';
import { DescriptionDeleteForm } from '../Components/Forms/DescriptionDeleteForm.jsx';
import { CameraCard } from '../Components/Cards/CameraCard.jsx';
import { DescriptionCard } from '../Components/Cards/DescriptionCard.jsx';
import { Error } from '../Components/Error.jsx';
import { useNavigate } from 'react-router-dom';
import { fetchCameras, addCamera, updateCamera, deleteCamera, updateCameraColor } from '../Services/cameraService';
import { fetchDescriptions, addDescription, updateDescription, deleteDescription } from '../Services/descriptionService';
import { fetchTeamMembers } from '../Services/overviewService.js';
import { useTeam } from "../Components/TeamContext.jsx";

export const Labels = () => {
    const { teamId } = useTeam();
    const [cameras, setCameras] = useState([]);
    const navigate = useNavigate();
    const [descriptions, setDescriptions] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [currentForm, setCurrentForm] = useState(null);
    const [currentCamera, setCurrentCamera] = useState(null);
    const [currentDescription, setCurrentDescription] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showCameras, setShowCameras] = useState(true);
    const [isNotAuthorized, setIsNotAuthorized] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState(null);

    const handleOnClose = () => setShowPopup(false);

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

    if (!teamId) {
        navigate('/teams');
        return;
    }    

    useEffect(() => {

        const fetchData = async () => {
            if (!teamId) return;

            try {
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

    const handleAddCamera = async (name) => {
        if (!teamId) return;
        const newCamera = await addCamera(name, "bg-white", teamId);
        setCameras([...cameras, newCamera]);
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

    return (
        <TeamsPageTemplate>
            <div className="h-full overflow-auto w-full scrollbar-none">
                {isNotAuthorized ? (
                    <div className="w-full h-full"></div>
                ) : (
                <div className={`h-full flex flex-wrap w-full gap-2`}>
                    <div className={`w-full h-full xl:flex flex md:flex-row xl:flex-col gap-2`}>
                        <div className="flex flex-col h-full bg-[#292929] bg-opacity-80 w-full  overflow-auto overflow-x-hidden">
                            <div className="flex py-2 px-1 border-b border-white border-opacity-50 items-center justify-between">
                                <button className="flex items-center justify-between h-8 w-44 rounded-md border-2 border-[#cc8111] cursor-pointer relative"
                                        onClick={() => setShowCameras(!showCameras)}>
                                    <div className={`absolute w-1/2 h-full rounded-sm bg-[#cc8111] border-10 border-[#cc8111] transition-transform duration-300 ease-in-out ${showCameras ? "translate-x-0" : "translate-x-full"}`}></div>
                                    
                                    <span className={`w-1/2 text-sm font-medium text-center z-10 ${showCameras ? "text-white" : "text-gray-400"}`}>Cameras</span>
                                    <span className={`w-1/2 text-sm font-medium text-center z-10 ${showCameras ? "text-gray-400" : "text-white"}`}>Descriptions</span>
                                </button>

                                <p className="grow text-white text-xl font-medium text-center">{showCameras ? "Cameras" : "Descriptions"}</p>
                                <div className="flex h-8">
                                {(currentUserRole === 1 || currentUserRole === 2) && (
                                    <button className="p-1 rounded-md bg-[#cc8111] text-white text-sm font-medium"
                                            onClick={showCameras ? openAddCamera : openAddDescription}>
                                        {showCameras ? "Add Camera" : "Add Description"}
                                    </button>
                                )}
                                </div>
                            </div>
                            <div className="overflow-auto scrollbar scrollbar-w-1.5 scrollbar-thumb-rounded-full scrollbar-thumb-zinc-50 overflow-y-scroll overflow-x-hidden p-3 flex flex-col gap-6">
                                {showCameras ? (
                                    cameras.map(camera => (
                                        <CameraCard 
                                            key={camera.id} 
                                            camera={camera} 
                                            onDelete={() => openDeleteCamera(camera)} 
                                            onEdit={openEditCamera} 
                                            onUpdateColor={handleUpdateCameraColor}
                                            currentUserRole={currentUserRole}
                                        />
                                    ))
                                ) : (
                                    descriptions.map(description => (
                                        <DescriptionCard 
                                            key={description.id} 
                                            description={description} 
                                            onDelete={() => openDeleteDescription(description)} 
                                            onEdit={openEditDescription}
                                            currentUserRole={currentUserRole}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
            <FormTemplate onClose={handleOnClose} visible={showPopup}>
                {currentForm === 'addCamera' && <CameraAddForm onClose={handleOnClose} onAddCamera={handleAddCamera} />}
                {currentForm === 'editCamera' && <CameraEditForm onClose={handleOnClose} camera={currentCamera} onUpdateCamera={handleUpdateCamera} />}
                {currentForm === 'deleteCamera' && <CameraDeleteForm onClose={handleOnClose} camera={currentCamera} onDelete={handleDeleteCamera} />}
                {currentForm === 'addDescription' && <DescriptionAddForm onClose={handleOnClose} onAddDescription={handleAddDescription} />}
                {currentForm === 'editDescription' && <DescriptionEditForm onClose={handleOnClose} description={currentDescription} onUpdateDescription={handleUpdateDescription} />}
                {currentForm === 'deleteDescription' && <DescriptionDeleteForm onClose={handleOnClose} description={currentDescription} onDelete={handleDeleteDescription} />}
            </FormTemplate>
            {errorMessage && <Error message={errorMessage} onClose={() => setErrorMessage('')} />}
        </TeamsPageTemplate>
    );
};