const API_URL = 'http://localhost:3000/users';

export const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        console.error('Failed to fetch current user', response.status, response.statusText);
        throw new Error('Failed to fetch current user');
    }

    const data = await response.json();
    return data.user;
};

export const fetchUserData = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }

    return response.json();
};

export const updateUserName = async (userData) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/profile/name`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user name');
    }

    return response.json();
};

export const updateUserLastName = async (userData) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/profile/lastname`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user last name');
    }

    return response.json();
};

export const updateUserPassword = async (passwordData) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/profile/password`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update password');
    }

    return response.json();
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
};