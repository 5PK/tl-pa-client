let backendHost;
//const apiVersion = 'v1.0a';

const hostname = window && window.location && window.location.hostname;

if(hostname === 'pattech.com') {
  backendHost = 'https://api.pattech.com';
} else if(hostname === 'https://tl-patentapp.herokuapp.com') {
  backendHost = 'https://tl-patent-api.herokuapp.com/';
} else {
  backendHost = process.env.REACT_APP_BACKEND_HOST || 'http://localhost:6969';
}

//export const API_ROOT = `${backendHost}/api/${apiVersion}`;
export const API_ROOT = `${backendHost}`;