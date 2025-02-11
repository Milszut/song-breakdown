const API_URL = 'http://localhost:3000/overview';

export const fetchTeamDetails = async (teamId) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/${teamId}`, {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
  });

  if (!response.ok) {
      const errorMessage = await response.text();
      console.error('Fetch team details error:', errorMessage);
      throw new Error(errorMessage || 'Failed to fetch team details');
  }

  return response.json();
};

export const fetchTeamMembers = async (teamId) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/${teamId}/members`, {
      method: 'GET',
      headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
  });

  if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch team members');
  }

  return response.json();
};

export const updateTeamName = async (teamId, name) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/${teamId}/name`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    console.error('Error response:', await response.text());
    throw new Error('Failed to update team name');
  }

  return response.json();
};

export const updateTeamDescription = async (teamId, description) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/${teamId}/description`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description }),
  });

  if (!response.ok) {
    console.error('Error response:', await response.text());
    throw new Error('Failed to update team description');
  }

  return response.json();
};

export const deleteTeam = async (teamId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/${teamId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error('Error response:', await response.text());
    throw new Error('Failed to delete team');
  }

  return response.json();
};

export const removeUserFromTeam = async (teamId, userId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/${teamId}/members/${userId}`, {
      method: 'DELETE',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
  });

  if (!response.ok) {
      throw new Error('Failed to remove user from team');
  }

  return response.json();
};

export const inviteMemberToTeam = async (teamId, email) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/${teamId}/invite`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    return { success: false, message: error.message };
  }

  const successResponse = await response.json();
  return { success: true, message: successResponse.message };
};

export const fetchRoles = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/roles`, {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
  });

  if (!response.ok) {
      throw new Error('Failed to fetch roles');
  }

  return response.json();
};

export const updateUserRole = async (teamId, userId, roleId) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/${teamId}/members/${userId}/role`, {
      method: 'PUT',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role_id: roleId }),
  });

  if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update role');
  }

  return response.json();
};

export const leaveTeam = async (teamId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/${teamId}/leave`, {
      method: 'DELETE',
      headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
  });

  if (!response.ok) {
      throw new Error('Failed to leave the team');
  }

  return response.json();
};

export const fetchTeamInvitations = async (teamId) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/${teamId}/invitations`, {
      method: 'GET',
      headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
  });

  if (!response.ok) {
      throw new Error('Failed to fetch team invitations');
  }

  return response.json();
};