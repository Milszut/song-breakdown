import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTemplate } from '../Components/PageTemplate.jsx';
import { Footer } from '../Components/Footer.jsx';
import { fetchUserTeams, createTeam, fetchUserInvitations, acceptInvitation, declineInvitation } from '../Services/teamService.js';
import { CreateTeamForm } from '../Components/Forms/CreateTeamForm';
import { FormTemplate } from '../Components/FormTemplate.jsx';
import { useTeam } from '../Components/TeamContext.jsx';

export const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const { setTeamId } = useTeam();


    useEffect(() => {
        const getTeams = async () => {
            try {
                const userTeams = await fetchUserTeams();
                setTeams(userTeams);

                const userInvitations = await fetchUserInvitations();
                setInvitations(userInvitations);
            } catch (err) {
                console.error('Failed to fetch user teams:', err);
            }
        };
        getTeams();
    }, []);

    const handleTeamClick = (teamId) => {
        setTeamId(teamId);
        navigate('/teams/overview');
    };      

    const handleCreateTeam = async (teamData) => {
        try {
            const newTeam = await createTeam(teamData);
            setTeams([...teams, { ...teamData, id: newTeam.teamId, membersCount: 1 }]);
        } catch (err) {
            console.error('Failed to create team:', err);
        }
    };

    const handleAccept = async (invitationId) => {
        try {
            const result = await acceptInvitation(invitationId);
    
            if (result.success) {
                const updatedTeams = await fetchUserTeams();
                setTeams(updatedTeams);
    
                const updatedInvitations = await fetchUserInvitations();
                setInvitations(updatedInvitations);
            }
        } catch (err) {
            console.error('Failed to accept invitation:', err);
        }
    };
    
    const handleDecline = async (invitationId) => {
        try {
            const result = await declineInvitation(invitationId);
    
            if (result.success) {
                const updatedInvitations = await fetchUserInvitations();
                setInvitations(updatedInvitations);
            }
        } catch (err) {
            console.error('Failed to decline invitation:', err);
        }
    };    
    
    return (
        <PageTemplate>
            <div className="h-full overflow-auto overflow-x-hidden w-full scrollbar-none relative">
                <div className="h-full w-full flex flex-col items-center">
                    <div className="flex flex-col h-full bg-[#292929] bg-opacity-80 w-full lg:w-5/6 xl:w-3/4 lg:rounded-t-md overflow-hidden">
                        <div className="w-full flex border-b h-20 justify-center items-center p-4">
                            <h1 className="text-4xl text-white">Your Teams</h1>
                            <div className="grow"></div>
                            <button
                                className="w-44 p-1 rounded-md bg-[#cc8111] text-white text-sm font-medium"
                                onClick={() => setShowPopup(true)}
                            >
                                Create New Team
                            </button>
                        </div>
                        <div className="w-full flex items-end gap-4 bg-[#201616] bg-opacity-80 justify-center px-5 p-2">
                            <div className='flex w-72 text-lg md:text-2xl text-white rounded-md font-medium'>Team Name</div>
                            <div className='hidden md:flex grow text-lg md:text-xl text-white rounded-md font-medium'>Team Description</div>
                            <div className='md:hidden flex grow'></div>
                            <div className='justify-center flex w-20 lg:w-24 text-lg md:text-xl text-white rounded-md font-medium'>Members</div>
                        </div>
                        
                        <div className="flex flex-col gap-2 w-full opacity-80 h-full overflow-y-auto scrollbar scrollbar-w-0.5 lg:scrollbar-w-1.5 scrollbar-thumb-rounded-full scrollbar-thumb-zinc-50 p-2">
                            {teams.map((team) => (
                                <div
                                    key={team.id}
                                    className='flex items-end justify-center gap-4 w-full bg-[#201616] bg-opacity-80 p-3 rounded-md cursor-pointer hover:bg-opacity-100 transition'
                                    onClick={() => handleTeamClick(team.id)}
                                >
                                    <div className='flex w-72 text-lg md:text-2xl text-white rounded-md font-medium'>
                                        {team.name || 'No team name available'}
                                    </div>
                                    <div className='hidden md:flex grow text-lg md:text-xl text-white rounded-md font-medium'>
                                        {team.description || 'No description available'}
                                    </div>
                                    <div className='md:hidden flex grow'></div>
                                    <div className='flex justify-center w-20 lg:w-24 text-lg md:text-xl text-white rounded-md font-medium'>
                                        {team.membersCount || '-'}
                                    </div>
                                </div>
                            ))}
                            {invitations.length > 0 && invitations.map((invitation) => (
                                <div 
                                key={invitation.id} 
                                className="flex items-end gap-4 w-full bg-[#201616] bg-opacity-80 p-3 rounded-md"
                                >
                                    <div className="flex w-72 text-lg md:text-2xl text-white rounded-md font-medium">
                                        {invitation.team_name}
                                    </div>
                                    <div className="flex grow"></div>
                                    <button 
                                    className="w-24 p-1 rounded-md bg-[#58C134] text-white text-sm font-medium cursor-pointer hover:bg-opacity-60 transition"
                                    onClick={() => handleAccept(invitation.id)}
                                    >
                                        Accept
                                    </button>
                                    <button 
                                    className="w-24 p-1 rounded-md bg-[#B90000] text-white text-sm font-medium cursor-pointer hover:bg-opacity-60 transition"
                                    onClick={() => handleDecline(invitation.id)}
                                    >
                                        Decline
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
            <FormTemplate onClose={() => setShowPopup(false)} visible={showPopup}>
                <CreateTeamForm
                    onClose={() => setShowPopup(false)}
                    onCreate={handleCreateTeam}
                />
            </FormTemplate>
        </PageTemplate>
    );
};