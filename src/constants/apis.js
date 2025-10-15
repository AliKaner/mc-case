const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://jsonplaceholder.typicode.com";

const API_ENDPOINTS = {
  USERS: {
    GET_USERS: `${API_BASE_URL}/users`,
    GET_USER_BY_ID: `${API_BASE_URL}/users/:id`,
    CREATE_USER: `${API_BASE_URL}/users`,
    UPDATE_USER: `${API_BASE_URL}/users/:id`,
    DELETE_USER: `${API_BASE_URL}/users/:id`,
  },
};

export default API_ENDPOINTS;
