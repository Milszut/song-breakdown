import './App.css';
import React, { useEffect } from 'react'; 
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./Pages/Home.jsx";
import { Tutorials } from './Pages/Tutorials';
import { Contact } from "./Pages/Contact.jsx";
import { Teams } from "./Pages/Teams.jsx";
import { Profile } from "./Pages/Profile.jsx";
import { Overview } from "./Pages/Overview.jsx";
import { Library } from "./Pages/Library.jsx";
import { Events } from "./Pages/Events.jsx";
import { EventDetails } from "./Pages/EventDetails.jsx";
import { Labels } from "./Pages/Labels.jsx";
import { Login } from "./Pages/Login.jsx";
import { Register } from "./Pages/Register.jsx";
import { ResetPassword } from "./Pages/ResetPassword.jsx";
import { webSocketService } from './Services/webSocketService.js';
import PrivateRoute from './Components/PrivateRoute';
import { SessionCheck } from './Components/SessionCheck';
import { TeamProvider } from './Components/TeamContext.jsx';
import { EventProvider } from './Components/EventContext.jsx';

function App() {
  useEffect(() => {
    webSocketService.connect('ws://localhost:3000', (data) => {
        console.log('Message from WebSocket:', data);
    });

    return () => {
        webSocketService.disconnect();
    };
  }, []);

  return (
      <BrowserRouter>
        <SessionCheck />
        <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/tutorials" element={<Tutorials />} />
             <Route path="/contact" element={<Contact />} />
             <Route path="/login" element={<Login />} />
             <Route path="/register" element={<Register />} />
             <Route path="/resetpassword" element={<ResetPassword />} />
             
             <Route path="/profile" 
                element={<PrivateRoute><Profile /></PrivateRoute>} 
             />

             <Route path="/teams/*" element={
                <PrivateRoute>
                    <TeamProvider>
                        <Routes>
                            <Route index element={<Teams />} />
                            <Route path="overview" element={<Overview />} />
                            <Route path="library" element={<Library />} />
                            <Route path="events" 
                              element={<EventProvider><Events /></EventProvider>} 
                            />
                            <Route path="eventdetails" 
                              element={<EventProvider><EventDetails /></EventProvider>} 
                            />
                            <Route path="labels" element={<Labels />} />
                        </Routes>
                    </TeamProvider>
                </PrivateRoute>
              }/>
         </Routes>
      </BrowserRouter>
  );
}

export default App;