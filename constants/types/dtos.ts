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

type Role = 'admin' | 'customer';

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
  logout: Function;
  userData?: UserData | null;
};
