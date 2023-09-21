type CommonResponse = {
  success: boolean;
};

type LoginRequest = {
  email: string;
  password: string;
};

type LoginSuccessResponse = {
  token: string;
};

type Role = 'customer' | 'admin';

type SignupRequest = {
  email: string;
  name: string;
  role: Role;
};

type UserData = {
  id: number;
  email: string;
  name: string;
  role: Role;
};

type UserContext = {
  isLogin: boolean;
  userData?: UserData;
  setUserData: Function;
  setIsLogin: Function;
};
