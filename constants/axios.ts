import axios, { InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { AUTH_KEY } from './cookie-keys';

const onRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = Cookies.get(AUTH_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
});
instance.interceptors.request.use(onRequest);
export default instance;
