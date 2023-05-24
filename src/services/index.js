import { API } from '../config';
import jwt_decode from 'jwt-decode';

export const signup = (user) => {
  return fetch(`${API}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const signin = (user) => {
  return fetch(`${API}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const authenticate = (data, next) => {
  if (typeof window !== 'undefined') {
    console.log("data: ", data);
    localStorage.setItem('accessToken', JSON.stringify(data.accessToken));
    localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken));
    localStorage.setItem('userData', JSON.stringify(data.user));


    next();
  }
};

export const signout = (next) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');

    next();
    // return fetch(`${API}/signout`, {
    //   method: 'GET',
    // })
    // .then((response) => {
    //   console.log('signout', response);
    // })
    // .catch((err) => console.log(err));
  }
};

export const isAuthenticated = (key) => {
  if (typeof window === 'undefined') {
    return false;
  }
  if (localStorage.getItem(''+key)) {
    return JSON.parse(localStorage.getItem(''+key));
  } else {
    return false;
  }
};

export const handleRefreshTokenValidation = async () => {
        const accessToken = localStorage.getItem('accessToken');
      
        // Check if access token is expired
        const { exp } = jwt_decode(accessToken);
        if (Date.now() >= exp * 1000) {
          const refreshToken = localStorage.getItem('refreshToken');
          const response = await fetch(`${API}/refreshToken`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
          });
          if (response.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/sign-in';
            throw new Error("Your session expired. please sign in again");
          }
          const { accessToken } = await response.json();
          localStorage.setItem('accessToken', accessToken);
        }
}