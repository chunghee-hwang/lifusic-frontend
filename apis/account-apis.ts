import axios from '@/constants/axios';
import { AUTH_KEY } from '@/constants/cookie-keys';
import Cookies from 'js-cookie';
export const LOGIN = async (
  request: LoginRequest
): Promise<LoginSuccessResponse> => {
  Cookies.remove(AUTH_KEY);
  const response = await axios.post('/api/account/login', request);
  return response.data;
};

export const LOGOUT = async (): Promise<CommonResponse> => {
  const response = await axios.post('/api/account/logout');
  return response.data;
};

export const SIGNUP = async (
  request: SignupRequest
): Promise<CommonResponse> => {
  const response = await axios.post('/api/account/user', request);
  return response.data;
};

export const GET_USER_DATA = async (): Promise<UserData> => {
  const response = await axios.get('/api/account/me');
  return response.data;
};
