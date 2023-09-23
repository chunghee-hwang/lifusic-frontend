import useLogoutMutation from '@/hooks/account-api-hooks/logout-mutation';
import useUserDataQuery from '@/hooks/account-api-hooks/user-data-query';
import { createContext, useContext, useMemo } from 'react';

const AuthContext = createContext<UserContext>({
  isLogin: false,
  isUserDataLoading: false,
  logout: () => {},
});

AuthContext.displayName = 'AuthContext';

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    isSuccess: isGetUserDataSuccess,
    data: userData,
    isLoading,
  } = useUserDataQuery();
  const { mutate: logoutMutate } = useLogoutMutation();
  const value = useMemo(
    () => ({
      userData: isGetUserDataSuccess ? userData : null,
      isLogin: isGetUserDataSuccess,
      logout: () => logoutMutate(),
      isUserDataLoading: isLoading,
    }),
    [isGetUserDataSuccess, userData, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
