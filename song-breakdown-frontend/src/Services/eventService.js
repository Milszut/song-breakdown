const API_URL = 'http://localhost:3000/events';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const fetchEvents = async (teamId) => {
  const response = await fetch(`${API_URL}/${teamId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return response.json();
};

export const fetchEventDetails = async (teamId, eventId) => {
  const response = await fetch(`${API_URL}/${teamId}/${eventId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return response.json();
};

export const addEvent = async (teamId, eventData) => {
  const response = await fetch(`${API_URL}/${teamId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return response.json();
};

export const updateEvent = async (id, updateData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return response.json();
};

export const deleteEvent = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return response.text();
};

export const fetchEventSongs = async (teamId, eventId) => {
  const response = await fetch(`${API_URL}/${teamId}/${eventId}/songs`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return response.json();
};

export const addSongToEvent = async (teamId, eventId, songId) => {
  const response = await fetch(`${API_URL}/events/${teamId}/${eventId}/songs`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ songId }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return response.json();
};

export const removeSongFromEvent = async (teamId, eventId, songId) => {
  const response = await fetch(`${API_URL}/${teamId}/${eventId}/songs/${songId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return response.json();
};