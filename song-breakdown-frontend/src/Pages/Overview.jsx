import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaRegUserCircle, FaChevronDown, FaChevronUp, FaCog } from "react-icons/fa";
import { TeamsPageTemplate } from '../Components/TeamsPageTemplate.jsx';
import { fetchTeamDetails, fetchTeamMembers, updateTeamName, updateTeamDescription, deleteTeam, removeUserFromTeam, inviteMemberToTeam, fetchRoles, updateUserRole, leaveTeam, fetchTeamInvitations } from '../Services/overviewService.js';
import { FormTemplate } from '../Components/FormTemplate.jsx';
import { TeamNameEditForm } from '../Components/Forms/TeamNameEditForm.jsx';
import { TeamDescriptionEditForm } from '../Components/Forms/TeamDescriptionEditForm.jsx';
import { TeamDeleteForm } from '../Components/Forms/TeamDeleteForm.jsx';
import { TeamMemberDeleteForm } from '../Components/Forms/TeamMemberDeleteForm.jsx';
import { InviteMemberForm } from '../Components/Forms/InviteMemberForm.jsx';
import { LeaveTeamForm } from '../Components/Forms/LeaveTeamForm.jsx';
import { Error } from '../Components/Error.jsx';
import { useTeam } from '../Components/TeamContext';
import { fetchCurrentUser} from '../Services/userService.js';

export const Overview = () => {
    const { teamId } = useTeam();
    const navigate = useNavigate();
    const [teamDetails, setTeamDetails] = useState({});
    const [teamMembers, setTeamMembers] = useState([]);
    const [showSettings, setShowSettings] = useState(false);
    const [expandedUserIds, setExpandedUserIds] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [currentForm, setCurrentForm] = useState('');
    const [currentMember, setCurrentMember] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [roles, setRoles] = useState([]);
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isNotAuthorized, setIsNotAuthorized] = useState(false);
    const [activeTab, setActiveTab] = useState('members');
    const [teamInvitations, setTeamInvitations] = useState([]);

    useEffect(() => {
        if (!teamId) {
            console.error('No teamId found in context. Redirecting to /teams.');
            navigate('/teams');
        }
    }, [teamId, navigate]);    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await fetchCurrentUser();
                setCurrentUser(user);

                if (teamId) {
                    const details = await fetchTeamDetails(teamId);
                    setTeamDetails(details);

                    const response = await fetchTeamMembers(teamId);
                    setTeamMembers(response.members);
                    setCurrentUserRole(response.userRole?.role_id);

                    const invitations = await fetchTeamInvitations(teamId);
                    setTeamInvitations(invitations);
                } else {
                    setTeamDetails({});
                    setTeamMembers([]);
                    setTeamInvitations([]);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);

                if (error.message.includes("You don't have access to this team")) {
                    setIsNotAuthorized(true);
                    setErrorMessage('You do not have access to this team!');
                    setTimeout(() => navigate('/teams'), 3000);
                } else if (error.message.includes('Team ID is required')) {
                    setErrorMessage('Invalid team ID');
                } else {
                    setErrorMessage('An unexpected error occurred');
                }
            }
        };

        fetchData();
    }, [teamId, navigate]);

    const toggleExpanded = (userId) => {
        setExpandedUserIds((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const toggleSettings = () => {
        setShowSettings((prev) => !prev);
    };

    const handleOnClose = () => {
        setShowPopup(false);
        setCurrentForm('');
        setCurrentMember(null);
    };

    const handleUpdateName = async (newName) => {
        try {
            await updateTeamName(teamId, newName);
            setTeamDetails((prev) => ({ ...prev, name: newName }));
        } catch (err) {
            console.error('Failed to update team name:', err);
        }
    };

    const handleUpdateDescription = async (newDescription) => {
        try {
            await updateTeamDescription(teamId, newDescription);
            setTeamDetails((prev) => ({ ...prev, description: newDescription }));
        } catch (err) {
            console.error('Failed to update team description:', err);
        }
    };

    const handleDeleteTeam = async () => {
        try {
            await deleteTeam(teamId);
        } catch (err) {
            console.error('Failed to delete team:', err);
        }
    };

    const handleRemoveMember = async (memberId) => {
        try {
            await removeUserFromTeam(teamId, memberId);
            setTeamMembers((prev) => prev.filter((member) => member.id !== memberId));
        } catch (err) {
            console.error('Failed to remove member:', err);
        }
    };

    const handleInviteMember = async (email) => {
        try {
            const result = await inviteMemberToTeam(teamId, email);
            setErrorMessage(result.message);
    
            if (!result.success) {
                console.error(`Error: ${result.message}`);
            }
        } catch (error) {
            setErrorMessage(`An error occurred: ${error.message}`);
            console.error('Error inviting member:', error);
        }
    };    

    const handleLeaveTeam = async () => {
        try {
            await leaveTeam(teamId);
        } catch (err) {
            console.error('Failed to leave team:', err);
        }
    };   

    const closeErrorPopup = () => {
        setErrorMessage('');
    };    

    useEffect(() => {
        const loadRoles = async () => {
            try {
                const fetchedRoles = await fetchRoles();
                setRoles(fetchedRoles);
            } catch (error) {
                console.error('Failed to fetch roles:', error);
            }
        };
    
        loadRoles();
    }, []);

    return (
        <TeamsPageTemplate>
            <div className="h-full overflow-auto overflow-x-hidden w-full lg:p-2 scrollbar-none relative">
                {isNotAuthorized ? (
                <div className="w-full h-full"></div>
                ) : (
                <div className="h-full w-full min-w-[300px] flex flex-col bg-[#292929] bg-opacity-80 lg:rounded-lg">
                    <div className="h-40 w-full p-3 gap-4 flex items-center border-b justify-center flex-row bg-[#292929] bg-opacity-40">
                        {!showSettings && (
                            <>
                                <FaUsers className="text-white text-8xl lg:text-9xl" />
                                <div className="grow flex items-start justify-center flex-col">
                                    <p className="text-white font-bold text-2xl lg:text-4xl">
                                        {teamDetails.name}
                                    </p>
                                    <p className="text-white font-semi text-sm lg:text-xl">
                                        {teamDetails.description}
                                    </p>
                                </div>
                            </>
                        )}
                        <div className="grow"></div>
                        
                        {currentUserRole === 1 && (
                            <div className="flex items-center gap-4">
                                <div className={`flex flex-col gap-2 ${showSettings ? 'md:flex' : 'hidden md:flex'}`}>
                                    <button
                                        className="w-44 p-1 rounded-md bg-[#cc8111] text-white text-sm font-medium"
                                        onClick={() => {
                                            setShowPopup(true);
                                            setCurrentForm('editName');
                                        }}
                                    >
                                        Change Team Name
                                    </button>
                                    <button
                                        className="w-44 p-1 rounded-md bg-[#cc8111] text-white text-sm font-medium"
                                        onClick={() => {
                                            setShowPopup(true);
                                            setCurrentForm('editDescription');
                                        }}
                                    >
                                        Change Team Description
                                    </button>
                                    <button
                                        className="w-44 p-1 rounded-md bg-[#B90000] text-white text-sm font-medium"
                                        onClick={() => {
                                            setShowPopup(true);
                                            setCurrentForm('deleteTeam');
                                        }}
                                    >
                                        Delete Team
                                    </button>
                                </div>

                                <button
                                    className="p-2 rounded-full bg-[#cc8111] text-white text-lg md:hidden"
                                    onClick={toggleSettings}
                                >
                                    <FaCog />
                                </button>
                            </div>
                        )}
                    </div>


                    <div className='h-22 w-full p-4 pr-3 gap-4 flex items-center justify-start border-b border-gray-800 flex-row bg-[#292929] bg-opacity-40'>
                    <p 
                    className={`font-medium text-lg md:text-2xl cursor-pointer ${activeTab === 'members' ? 'text-white' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('members')}
                    >
                        Members
                    </p>
                    <p className='text-white font-medium text-2xl'>/</p>
                    <p
                    className={`font-medium text-lg md:text-2xl cursor-pointer ${activeTab === 'invitations' ? 'text-white' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('invitations')}
                    >
                        Invitations
                    </p>
                        <div className='grow'></div>
                        {currentUserRole === 1 && (
                            <button className="p-1 lg:p-2 w-44 rounded-md bg-[#cc8111] text-white text-xs lg:text-sm font-medium"
                                onClick={() => {
                                    setShowPopup(true);
                                    setCurrentForm('inviteMember');
                                }}>
                                Invite New Member
                            </button>
                        )}
                    </div>
                    {activeTab === 'members' ? (
                        <div className='flex flex-col'>
                            <div className='h-12 w-full px-2 flex items-center justify-start border-b border-gray-800 flex-row text-white font-medium bg-[#292929] bg-opacity-40'>
                                <div className='grow'></div>
                                <div className='hidden sm:flex items-center h-full justify-center border-l border-gray-800 opacity-0'><FaRegUserCircle className='text-3xl mx-2'/></div>
                                <div className='h-full flex items-center justify-center border-x border-gray-800'><p className='w-40 text-center'>First Name</p></div>
                                <div className='h-full flex items-center justify-center border-r border-gray-800'><p className='w-40 text-center'>Last Name</p></div>
                                <div className='hidden xl:flex h-full items-center justify-center border-r border-gray-800'><p className='w-80 text-center'>Email Address</p></div>
                                <div className='hidden xl:flex h-full items-center justify-center border-r border-gray-800'><p className='w-40 text-center'>Permissions</p></div>
                                <div className='hidden xl:flex items-center justify-center border-r border-gray-800 opacity-0 pointer-events-none'><button className='p-1 lg:p-1 m-2 w-20 rounded-md bg-[#B90000] text-white text-sm font-medium'>Remove</button></div>
                                <div className='h-full flex opacity-0 pointer-events-none items-center justify-center xl:hidden m-3'> <FaChevronUp /></div>
                                <div className='grow'></div>
                            </div>

                            <div className="pl-1 w-full border-b border-gray-800 text-white overflow-auto scrollbar scrollbar-w-1 scrollbar-thumb-rounded-full scrollbar-thumb-zinc-50 overflow-y-scroll overflow-x-hidden">
                                {teamMembers.map((member) => (
                                    <React.Fragment key={member.id}>
                                            <div className="h-10 w-full px-2 flex items-center justify-start flex-row bg-opacity-40">
                                            <div className="grow"></div>
                                            <div className="hidden sm:flex h-full items-center justify-center border-l border-gray-800">
                                                <FaRegUserCircle className="text-3xl mx-2" />
                                            </div>
                                            <div className="h-full flex items-center justify-center border-x border-gray-800">
                                                <p className="w-40 text-center">{member.name}</p>
                                            </div>
                                            <div className="h-full flex items-center justify-center border-r border-gray-800">
                                                <p className="w-40 text-center">{member.lastname}</p>
                                            </div>
                                            <div className="hidden xl:flex h-full items-center justify-center border-r border-gray-800">
                                                <p className="w-80 text-center">{member.email}</p>
                                            </div>
                                            <div className="hidden xl:flex h-full items-center justify-center border-r border-gray-800">
                                            {currentUserRole === 1 ? (
                                                <select
                                                    className="bg-[#1A1A1A] w-40 text-center text-white p-2 rounded"
                                                    value={member.role_id}
                                                    onChange={async (e) => {
                                                        const newRoleId = parseInt(e.target.value, 10);
                                                        try {
                                                            await updateUserRole(teamId, member.id, newRoleId);
                                                            setTeamMembers((prev) =>
                                                                prev.map((m) =>
                                                                    m.id === member.id
                                                                        ? {
                                                                            ...m,
                                                                            role_id: newRoleId,
                                                                            role_name: roles.find((role) => role.id === newRoleId)?.name,
                                                                        }
                                                                        : m
                                                                )
                                                            );
                                                        } catch (err) {
                                                            console.error('Failed to update role:', err);
                                                        }
                                                    }}>
                                                    {roles.map((role) => (
                                                        <option key={role.id} value={role.id}>
                                                            {role.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <p className="w-40 text-center">{member.role_name}</p>
                                            )}
                                            </div>
                                            <div className="hidden xl:flex h-full items-center justify-center border-r border-gray-800">
                                                {currentUser && currentUser.id === member.id ? (
                                                    <button
                                                        className="p-1 lg:p-1 m-2 w-20 rounded-md bg-[#B90000] text-white text-sm font-medium"
                                                        onClick={() => {
                                                            setShowPopup(true);
                                                            setCurrentForm('leaveTeam');
                                                            setCurrentMember(member);
                                                        }}
                                                    >
                                                        Leave
                                                    </button>
                                                ) : currentUserRole === 1 ? (
                                                    <button
                                                        className="p-1 lg:p-1 m-2 w-20 rounded-md bg-[#B90000] text-white text-sm font-medium"
                                                        onClick={() => {
                                                            setShowPopup(true);
                                                            setCurrentForm('removeMember');
                                                            setCurrentMember(member);
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="p-1 lg:p-1 m-2 w-20 rounded-md bg-[#B90000] text-white text-sm font-medium opacity-0 pointer-events-none"
                                                    >
                                                        Placeholder
                                                    </button>
                                                )}
                                            </div>
                                            <div
                                                className="h-full flex items-center justify-center cursor-pointer xl:hidden m-3"
                                                onClick={() => toggleExpanded(member.id)}>
                                                {expandedUserIds.includes(member.id) ? <FaChevronUp /> : <FaChevronDown />}
                                            </div>
                                            <div className="grow"></div>
                                            </div>

                                            {expandedUserIds.includes(member.id) && (
                                                <div className="w-full justify-center px-2 py-2 flex flex-col gap-2 border-t border-gray-800 bg-[#292929] items-center text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-medium">Email Address</span>
                                                        <span>{member.email}</span>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-medium">Role</span>
                                                        {currentUserRole === 1 ? (
                                                            <select
                                                                className="bg-[#1A1A1A] text-white p-2 rounded"
                                                                value={member.role_id}
                                                                onChange={async (e) => {
                                                                    const newRoleId = parseInt(e.target.value, 10);
                                                                    try {
                                                                        await updateUserRole(teamId, member.id, newRoleId);
                                                                        setTeamMembers((prev) =>
                                                                            prev.map((m) =>
                                                                                m.id === member.id
                                                                                    ? {
                                                                                        ...m,
                                                                                        role_id: newRoleId,
                                                                                        role_name: roles.find((role) => role.id === newRoleId)?.name,
                                                                                    }
                                                                                    : m
                                                                            )
                                                                        );
                                                                    } catch (err) {
                                                                        console.error('Failed to update role:', err);
                                                                    }
                                                                }}
                                                            >
                                                                {roles.map((role) => (
                                                                    <option key={role.id} value={role.id}>
                                                                        {role.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <p className="w-40 text-center">{member.role_name}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex justify-center">
                                                        {currentUser && currentUser.id === member.id ? (
                                                            <button
                                                                className="p-1 lg:p-1 m-2 w-20 rounded-md bg-[#B90000] text-white text-sm font-medium"
                                                                onClick={() => {
                                                                    setShowPopup(true);
                                                                    setCurrentForm('leaveTeam');
                                                                    setCurrentMember(member);
                                                                }}
                                                            >
                                                                Leave
                                                            </button>
                                                        ) : currentUserRole === 1 ? (
                                                            <button
                                                                className="p-1 lg:p-1 m-2 w-20 rounded-md bg-[#B90000] text-white text-sm font-medium"
                                                                onClick={() => {
                                                                    setShowPopup(true);
                                                                    setCurrentForm('removeMember');
                                                                    setCurrentMember(member);
                                                                }}
                                                            >
                                                                Remove
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col overflow-auto h-full p-0'>
                            <div className='h-10 w-full px-0 md:px-2 flex items-center justify-start border-b border-gray-800 flex-row text-white font-medium bg-[#292929] bg-opacity-40'>
                                <div className='grow'></div>
                                <div className='flex h-full items-center justify-center border-x border-gray-800'><p className='w-40 md:w-80 text-center'>Email Address</p></div>
                                <div className='hidden md:flex h-full items-center justify-center border-r border-gray-800'><p className='w-24 text-center'>Date</p></div>
                                <div className='flex h-full items-center justify-center border-r border-gray-800'><p className='w-40 text-center'>Invitation Status</p></div>
                                <div className='grow'></div>
                            </div>

                            <div className="flex flex-col w-full overflow-auto scrollbar scrollbar-w-1 scrollbar-thumb-rounded-full scrollbar-thumb-zinc-50 overflow-y-scroll overflow-x-hidden">
                            {teamInvitations.length > 0 && teamInvitations.map((invitation) => (
                                <React.Fragment key={invitation.id}>
                                    <div className="flex pl-1 w-full border-b border-gray-800 text-white">
                                        <div className="h-10 w-full px-0 flex items-center justify-start flex-row bg-opacity-40">
                                            <div className="grow"></div>
                                            <div className="flex h-full items-center justify-center border-x border-gray-800">
                                                <p className="w-40 md:w-80 text-center">{invitation.email}</p>
                                            </div>
                                            <div className="hidden md:flex h-full items-center justify-center border-r border-gray-800">
                                                <p className="w-24 text-center">{invitation.invitation_date}</p>
                                            </div>
                                            <div className="flex h-full items-center justify-center border-r border-gray-800">
                                                <p className={` ${invitation.status_name === "Pending" ? "text-yellow-500" : ""} 
                                                            ${invitation.status_name === "Accepted" ? "text-green-500" : ""} 
                                                            ${invitation.status_name === "Declined" ? "text-red-500" : ""} 
                                                            w-40 text-center`}>
                                                    {invitation.status_name}
                                                </p>
                                            </div>
                                            <div className="grow"></div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}
                            </div>
                        </div>
                    )}
                </div>
                )}
            </div>

            <FormTemplate onClose={handleOnClose} visible={showPopup}>
                {currentForm === 'editName' && (<TeamNameEditForm onClose={handleOnClose} onUpdateName={handleUpdateName} currentName={teamDetails.name}/>)}
                {currentForm === 'editDescription' && (<TeamDescriptionEditForm onClose={handleOnClose} onUpdateDescription={handleUpdateDescription} currentDescription={teamDetails.description}/>)}
                {currentForm === 'deleteTeam' && (<TeamDeleteForm onClose={handleOnClose} onDeleteTeam={handleDeleteTeam} team={teamDetails}/>)}
                {currentForm === 'removeMember' && (<TeamMemberDeleteForm onClose={handleOnClose} onDelete={() => handleRemoveMember(currentMember.id)} member={currentMember} teamName={teamDetails.name}/>)}
                {currentForm === 'leaveTeam' && (<LeaveTeamForm onClose={handleOnClose} onLeaveTeam={handleLeaveTeam} teamName={teamDetails.name}/>)}
                {currentForm === 'inviteMember' && (<InviteMemberForm onClose={handleOnClose} onInvite={handleInviteMember}/>)}
            </FormTemplate>
            {errorMessage && (<Error message={errorMessage} onClose={closeErrorPopup}/>)}
        </TeamsPageTemplate>
    );
};