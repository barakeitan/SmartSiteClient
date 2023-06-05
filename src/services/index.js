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

export const getAllRooms = (siteId) => {
  return fetch(`${API}/room/${siteId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getAllSites = () => {
  return fetch(`${API}/site`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
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
    // localStorage.setItem('userData', JSON.stringify(data.user));
    next();
  }
};

export const isAuthenticated = (accessToken) => {

  return fetch(`${API}/isAuthenticate`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
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
            localStorage.clear();
            window.location.href = '/authentication/sign-in';
            throw new Error("Your session expired. please sign in again");
          }
          const { accessToken } = await response.json();
          localStorage.setItem('accessToken', accessToken);
        }
}