const API_URL = 'http://localhost:3000/register';

export const registerUser = async (name, lastname, email, password, question_id, answer) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, lastname, email, password, question_id, answer }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error('Registration failed:', data.message);
      return { error: true, message: data.message || 'Registration failed' };
    }

    return data;
  } catch (error) {
    console.error('Network error during registration:', error);
    return { error: true, message: 'Network error. Please try again later.' };
  }
};

export const fetchSecurityQuestions = async () => {
  try {
    const response = await fetch(`${API_URL}/security-questions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error('Failed to fetch security questions:', data.message);
      throw new Error(data.message || 'Failed to fetch security questions');
    }

    return data.questions;
  } catch (error) {
    console.error('Error fetching security questions:', error);
    return [];
  }
};