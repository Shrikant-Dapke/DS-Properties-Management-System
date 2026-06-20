import client from './client';

/**
 * DS Properties — Auth API
 *
 * API callers for authentication endpoints.
 * All functions return the response data (unwrapped from axios).
 *
 * Endpoints (from API_REVIEW.md):
 *   POST /auth/login          — public
 *   POST /auth/refresh        — public
 *   POST /auth/logout         — authenticated
 *   PUT  /auth/change-password — authenticated
 */

/**
 * Login with username and password
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ user, accessToken, refreshToken }>}
 */
export async function loginApi(username, password) {
  const response = await client.post('/auth/login', { username, password });
  return response.data;
}

/**
 * Refresh the access token using a refresh token
 * @param {string} refreshToken
 * @returns {Promise<{ accessToken }>}
 */
export async function refreshApi(refreshToken) {
  const response = await client.post('/auth/refresh', { refreshToken });
  return response.data;
}

/**
 * Logout — revoke the refresh token
 * @param {string} refreshToken
 * @returns {Promise<{ message }>}
 */
export async function logoutApi(refreshToken) {
  const response = await client.post('/auth/logout', { refreshToken });
  return response.data;
}

/**
 * Change password (authenticated)
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Promise<{ message }>}
 */
export async function changePasswordApi(currentPassword, newPassword) {
  const response = await client.put('/auth/change-password', {
    currentPassword,
    newPassword,
  });
  return response.data;
}
