import { makeAuthenticatedRequest } from './auth-api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getProfile = async (token: string) => {
  const response = await makeAuthenticatedRequest(`${API_URL}/profile/get_profile`, {
    method: 'GET',
  }, token);
  return await response.json();
};

export const updateProfile = async (data: { name: string }, token: string) => {
  const response = await makeAuthenticatedRequest(
    `${API_URL}/profile/update_profile`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
    token
  );
  return await response.json();
};

export const resetPassword = async (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  token: string
) => {
  const response = await makeAuthenticatedRequest(
    `${API_URL}/profile/reset_password`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirm: confirmPassword,
      }),
    },
    token
  );
  return await response.json();
};

export const deleteProfile = async (token: string) => {
  const response = await makeAuthenticatedRequest(
    `${API_URL}/profile/delete_profile`,
    {
      method: 'DELETE',
    },
    token
  );
  return response.ok;
};
