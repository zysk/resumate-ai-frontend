import axios from 'axios';
import { useAuth } from '../components/auth/authProvider';
import { BASE_URL } from '../appConstants';

function getHeaders() {
  let headers = {
    'Content-Type': 'application/json',
    "ngrok-skip-browser-warning": "69420",
    // 'CSRF-Token': localStorage.getItem('CSRF-Token') //TODO: not required for get requests
  };
  return headers;
}

const client = axios.create({
  baseURL: BASE_URL,
});

function apiget(url: string) {
  return client.get(url, { headers: getHeaders() });
}

function apipost(url: string, body: any) {
  return client.post(url, body, { headers: getHeaders() });
}

function apiput(url: string, body: any) {
  return client.put(url, body, { headers: getHeaders() });
}

function apidelete(url: string) {
  return client.delete(url, { headers: getHeaders() });
}

export { getHeaders, apiget, apipost, apiput, apidelete };