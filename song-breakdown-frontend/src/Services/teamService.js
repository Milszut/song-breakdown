const API_URL = 'http://localhost:3000/teams';

export const fetchUserTeams = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/userTeams`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user teams');
  }

  return response.json();
};

export const createTeam = async (teamData) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
  });

  if (!response.ok) {
      throw new Error('Failed to create team');
  }

  return response.json();
};

export const fetchUserInvitations = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/pending`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch invitations');
    }

    return response.json();
};

export const acceptInvitation = async (invitationId) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/invitations/${invitationId}/accept`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    return response.json();
};

export const declineInvitation = async (invitationId) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/invitations/${invitationId}/decline`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    return response.json();
};