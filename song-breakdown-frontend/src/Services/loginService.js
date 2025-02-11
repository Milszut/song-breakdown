const API_URL = 'http://localhost:3000/login';

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return { error: true, message: data.message || 'Login failed' };
    }

    return data;
  } catch (error) {
    return { error: true, message: 'Network error. Please try again later.' };
  }
};

export const resetPassword = async (email, question_id, answer, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, question_id, answer, newPassword }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return { error: true, message: data.message || 'Failed to reset password' };
    }

    return data;
  } catch (error) {
    return { error: true, message: 'Network error. Please try again later.' };
  }
};