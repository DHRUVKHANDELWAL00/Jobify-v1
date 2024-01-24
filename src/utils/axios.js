import axios from 'axios';
export const customFetch = axios.create({
  baseURL: 'https://jobify-prod.herokuapp.com/api/v1/toolkit',
});

export const addUserToLocalStorage = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem('user');
};

export const getUserFromLocalStorage = () => {
  const result = localStorage.getItem('user');
  const user = result ? JSON.parse(result) : null;
  return user;
};

export const authHeader = (thunkAPI) => {
  return  {
        headers: {
          authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
        },
      };
};
