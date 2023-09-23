import axios from '@/constants/axios';
import { AUTH_KEY } from '@/constants/cookie-keys';
import {
  LoginRequest,
  LoginSuccessResponse,
  CommonResponse,
  SignUpRequest,
  UserData,
} from '@/constants/types/types';
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
  request: SignUpRequest
): Promise<CommonResponse> => {
  const response = await axios.post('/api/account/user', request);
  return response.data;
};

export const GET_USER_DATA = async (): Promise<UserData> => {
  const response = await axios.get('/api/account/me');
  return response.data;
};
