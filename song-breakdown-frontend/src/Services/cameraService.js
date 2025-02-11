const API_URL = 'http://localhost:3000/cameras';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const fetchCameras = async (teamId) => {
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

export const addCamera = async (name, color, teamId) => {
  const response = await fetch(`${API_URL}/${teamId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, color }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return response.json();
};

export const updateCamera = async (id, name) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error(`Error updating camera: ${response.statusText}`);
  }

  return response.text();
};

export const updateCameraColor = async (id, color) => {
  const response = await fetch(`${API_URL}/${id}/color`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ color }),
  });

  if (!response.ok) {
    throw new Error(`Error updating camera color: ${response.statusText}`);
  }

  return response.text();
};

export const deleteCamera = async (id) => {
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