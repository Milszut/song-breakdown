import React, { createContext, useContext, useState } from 'react';

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
    const [teamId, setTeamId] = useState(null);

    return (
        <TeamContext.Provider value={{ teamId, setTeamId }}>
            {children}
        </TeamContext.Provider>
    );
};

export const useTeam = () => useContext(TeamContext);