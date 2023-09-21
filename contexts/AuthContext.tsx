import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext<UserContext>({
  isLogin: false,
  setIsLogin: () => {},
  setUserData: () => {},
});

AuthContext.displayName = 'AuthContext';

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userData, setUserData] = useState<UserData>({
    id: 777,
    name: '홍길동',
    email: 'hongkil@naver.com',
    role: 'customer',
  });
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const value = useMemo(
    () => ({
      userData,
      isLogin,
      setUserData,
      setIsLogin,
    }),
    [userData, isLogin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
