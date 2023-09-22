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

type SignUpRequest = {
  email: string;
  name: string;
  password: string;
  role: Role;
};

type SignUpRequestForm = {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
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
  isUserDataLoading: boolean;
  userData?: UserData | null;
};
