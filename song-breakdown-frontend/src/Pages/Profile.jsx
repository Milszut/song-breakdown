import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTemplate } from '../Components/PageTemplate.jsx';
import { Footer } from '../Components/Footer.jsx';
import { FaPen } from "react-icons/fa";
import { fetchUserData, updateUserName, updateUserLastName, updateUserPassword } from '../Services/userService';
import { FormTemplate } from '../Components/FormTemplate.jsx';
import { UserNameEditForm } from '../Components/Forms/UserNameEditForm.jsx';
import { UserLastNameEditForm } from '../Components/Forms/UserLastNameEditForm.jsx';
import { UserPasswordEditForm } from '../Components/Forms/UserPasswordEditForm.jsx';
import { Error } from '../Components/Error.jsx';

export const Profile = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '' });
    const [showPopup, setShowPopup] = useState(false);
    const [currentForm, setCurrentForm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const data = await fetchUserData();
                setUserData({
                    firstName: data.user.name,
                    lastName: data.user.lastname,
                    email: data.user.email,
                });
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
        loadUserData();
    }, []);

    const handleEditClick = (field) => {
        setCurrentForm(field);
        setShowPopup(true);
    };

    const handleUpdateName = async (newName) => {
        try {
            await updateUserName({ name: newName });
            setUserData((prev) => ({ ...prev, firstName: newName }));
        } catch (error) {
            console.error('Failed to update first name:', error);
        }
    };
    
    const handleUpdateLastName = async (newLastName) => {
        try {
            await updateUserLastName({ lastname: newLastName });
            setUserData((prev) => ({ ...prev, lastName: newLastName }));
        } catch (error) {
            console.error('Failed to update last name:', error);
        }
    }; 

    const handleUpdatePassword = async (passwordData) => {
        try {
            const result = await updateUserPassword(passwordData);
            setErrorMessage(result.message);
            setShowPopup(false);
        } catch (error) {
            console.error('Failed to update password:', error);
            setErrorMessage(error.message);
        }
    };    

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const closeErrorPopup = () => {
        setErrorMessage('');
    };    

    return (
        <PageTemplate>
            <div className="h-full flex w-full flex-col overflow-auto overflow-x-hidden scrollbar-none relative">
                <div className="flex-grow flex flex-col items-center justify-center w-full">
                    <div className="flex flex-col justify-center items-center gap-4 p-8 md:rounded-lg shadow-md text-white w-full md:w-2/3 lg:w-1/2 2xl:w-1/3 bg-[#292929] bg-opacity-80 h-full md:h-3/4">
                        <h2 className="text-2xl font-bold text-center">Your Account</h2>
                        
                        <div className="flex flex-col w-full justify-center items-start py-2 border-b border-white gap-2">
                            <h1 className="block text-xl font-semibold">First Name</h1>
                            <div className="flex w-full">
                                <h1 className="block text-md text-stone-300 font-semibold">{userData.firstName}</h1>
                                <div className="grow"></div>
                                <FaPen className="cursor-pointer" onClick={() => handleEditClick('editFirstName')} />
                            </div>
                        </div>

                        <div className="flex flex-col w-full justify-center items-start py-2 border-b border-white gap-2">
                            <h1 className="block text-xl font-semibold">Last Name</h1>
                            <div className="flex w-full">
                                <h1 className="block text-md text-stone-300 font-semibold">{userData.lastName}</h1>
                                <div className="grow"></div>
                                <FaPen className="cursor-pointer" onClick={() => handleEditClick('editLastName')} />
                            </div>
                        </div>

                        <div className="flex flex-col w-full justify-center items-start py-2 border-b border-white gap-2">
                            <h1 className="block text-xl font-semibold">Email</h1>
                            <div className="flex w-full">
                                <h1 className="block text-md text-stone-300 font-semibold">{userData.email}</h1>
                                <div className="grow"></div>
                            </div>
                        </div>

                        <div className="flex flex-col w-full justify-center items-start py-2 border-b border-white gap-2">
                            <h1 className="block text-xl font-semibold">Password</h1>
                            <div className="flex w-full">
                                <h1 className="block text-md text-stone-300 font-semibold">********</h1>
                                <div className="grow"></div>
                                <FaPen className="cursor-pointer" onClick={() => handleEditClick('editPassword')}/>
                            </div>
                        </div>

                        <div className="flex flex-col w-full justify-center items-end">
                            <button
                                onClick={handleLogout}
                                className="w-44 p-1 rounded-md bg-[#cc8111] text-white text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>

            <FormTemplate onClose={() => setShowPopup(false)} visible={showPopup}>
                {currentForm === 'editFirstName' && (
                    <UserNameEditForm
                        currentName={userData.firstName}
                        onClose={() => setShowPopup(false)}
                        onUpdateName={handleUpdateName}
                    />
                )}
                {currentForm === 'editLastName' && (
                    <UserLastNameEditForm
                        currentLastName={userData.lastName}
                        onClose={() => setShowPopup(false)}
                        onUpdateLastName={handleUpdateLastName}
                    />
                )}
                {currentForm === 'editPassword' && (
                    <UserPasswordEditForm 
                        onClose={() => setShowPopup(false)} 
                        onUpdatePassword={handleUpdatePassword} 
                    />
                )}
            </FormTemplate>
            {errorMessage && <Error message={errorMessage} onClose={closeErrorPopup} />}
        </PageTemplate>
    );
};