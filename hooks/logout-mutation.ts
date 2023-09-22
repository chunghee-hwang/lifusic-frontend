import { LOGOUT } from '@/apis/account-apis';
import { AUTH_KEY } from '@/constants/cookie-keys';
import { USER_KEY } from '@/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';

function useLogoutMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: LOGOUT,
    onSuccess: () => {
      Cookies.remove(AUTH_KEY);
      queryClient.invalidateQueries(USER_KEY);
    },
    retry: false,
  });

  return mutation;
}

export default useLogoutMutation;
