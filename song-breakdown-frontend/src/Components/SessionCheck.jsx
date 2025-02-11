import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FormTemplate } from './FormTemplate.jsx';
import { SessionExpiredPopup } from './Forms/SessionExpiredPopup.jsx';

export const SessionCheck = () => {
    const [showSessionExpiredPopup, setShowSessionExpiredPopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkTokenExpiration = () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                const currentTime = Math.floor(Date.now() / 1000);

                if (decodedToken.exp < currentTime) {
                    setShowSessionExpiredPopup(true);
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('token');
            }
        };

        const interval = setInterval(checkTokenExpiration, 60000);

        checkTokenExpiration();

        return () => clearInterval(interval);
    }, []);

    const handleSessionExpiredClose = () => {
        setShowSessionExpiredPopup(false);
        navigate('/login');
    };

    return (
        <>
            {showSessionExpiredPopup && (
                <FormTemplate visible={showSessionExpiredPopup} onClose={handleSessionExpiredClose}>
                    <SessionExpiredPopup onClose={handleSessionExpiredClose} />
                </FormTemplate>
            )}
        </>
    );
};