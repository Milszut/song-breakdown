import React, { createContext, useContext, useState } from "react";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
    const [eventId, setEventId] = useState(null);

    return (
        <EventContext.Provider value={{ eventId, setEventId }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvent = () => useContext(EventContext);